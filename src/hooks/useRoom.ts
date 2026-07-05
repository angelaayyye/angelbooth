import { useCallback, useEffect, useRef, useState } from 'react';
import type { DuoCapturePart, RoomState } from '../types';
import { getSyncApiUrl, getWsUrl, useSyncApi } from '../constants';

type ServerMessage =
  | { type: 'connected'; playerId: string }
  | { type: 'room-joined'; room: RoomState; playerId: string; isHost: boolean }
  | { type: 'room-updated'; room: RoomState }
  | { type: 'session-started'; room: RoomState }
  | {
      type: 'countdown-started';
      photoIndex: number;
      seconds: number;
      startedAt: number;
      triggeredBy: string;
    }
  | {
      type: 'duo-capture-received';
      photoIndex: number;
      playerId: string;
      room: RoomState;
    }
  | {
      type: 'duo-slot-ready';
      photoIndex: number;
      parts: DuoCapturePart[];
      room: RoomState;
    }
  | { type: 'next-photo'; photoIndex: number; room: RoomState }
  | {
      type: 'capture-complete';
      duoPhotos: (DuoCapturePart[] | null)[];
      room: RoomState;
    }
  | { type: 'player-left'; playerId: string; room: RoomState }
  | { type: 'error'; message: string };

const RECONNECT_DELAY_MS = 2000;
const POLL_INTERVAL_MS = 800;

export function useRoom(enabled = true) {
  const useApi = useSyncApi();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const intentionalClose = useRef(false);
  const playerIdRef = useRef<string | null>(null);
  const pollCursorRef = useRef(0);
  const roomIdRef = useRef<string | null>(null);

  const [connected, setConnected] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duoSlotReady, setDuoSlotReady] = useState<{
    photoIndex: number;
    parts: DuoCapturePart[];
  } | null>(null);
  const [duoPhotosComplete, setDuoPhotosComplete] = useState<
    (DuoCapturePart[] | null)[] | null
  >(null);
  const [syncCountdown, setSyncCountdown] = useState<{
    photoIndex: number;
    seconds: number;
    startedAt: number;
  } | null>(null);
  const [captureComplete, setCaptureComplete] = useState(false);
  const [waitingForPartner, setWaitingForPartner] = useState(false);

  const applyMessage = useCallback((msg: ServerMessage) => {
    switch (msg.type) {
      case 'connected':
        playerIdRef.current = msg.playerId;
        setPlayerId(msg.playerId);
        setError(null);
        break;
      case 'room-joined':
        setRoom(msg.room);
        roomIdRef.current = msg.room.id;
        setIsHost(msg.isHost);
        setPlayerId(msg.playerId);
        playerIdRef.current = msg.playerId;
        setError(null);
        break;
      case 'room-updated':
      case 'session-started':
        setRoom(msg.room);
        roomIdRef.current = msg.room.id;
        break;
      case 'countdown-started':
        setSyncCountdown({
          photoIndex: msg.photoIndex,
          seconds: msg.seconds,
          startedAt: msg.startedAt,
        });
        setWaitingForPartner(false);
        break;
      case 'duo-capture-received':
        setRoom(msg.room);
        setSyncCountdown(null);
        break;
      case 'duo-slot-ready':
        setRoom(msg.room);
        setSyncCountdown(null);
        setWaitingForPartner(false);
        setDuoSlotReady({ photoIndex: msg.photoIndex, parts: msg.parts });
        break;
      case 'next-photo':
        setRoom(msg.room);
        setSyncCountdown(null);
        setWaitingForPartner(false);
        break;
      case 'capture-complete':
        setRoom(msg.room);
        setDuoPhotosComplete(msg.duoPhotos);
        setCaptureComplete(true);
        setSyncCountdown(null);
        setWaitingForPartner(false);
        break;
      case 'player-left':
        setRoom(msg.room);
        break;
      case 'error':
        setError(msg.message);
        break;
    }
  }, []);

  const handleWsMessage = useCallback(
    (event: MessageEvent) => {
      applyMessage(JSON.parse(event.data));
    },
    [applyMessage],
  );

  const pollOnce = useCallback(async () => {
    const id = playerIdRef.current;
    if (!id || intentionalClose.current) return;

    try {
      const res = await fetch(
        `${getSyncApiUrl()}?playerId=${encodeURIComponent(id)}&cursor=${pollCursorRef.current}`,
      );
      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error('Invalid sync response');
      }
      const data = await res.json();

      if (!res.ok) {
        setConnected(false);
        setError(data.error ?? 'Could not connect to sync server.');
        return;
      }

      setConnected(true);
      setError(null);
      pollCursorRef.current = data.cursor ?? pollCursorRef.current;

      for (const msg of data.messages ?? []) {
        applyMessage(msg);
      }
    } catch {
      setConnected(false);
      setError('Lost connection to sync server. Retrying…');
    }
  }, [applyMessage]);

  const connectApi = useCallback(async () => {
    if (intentionalClose.current) return;

    try {
      const res = await fetch(getSyncApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'connect' }),
      });
      const data = await res.json();

      if (!res.ok) {
        setConnected(false);
        setError(
          data.error ??
            'Sync server unavailable. Add Upstash Redis in Vercel Storage, then redeploy.',
        );
        return;
      }

      playerIdRef.current = data.playerId;
      setPlayerId(data.playerId);
      pollCursorRef.current = 0;
      setConnected(true);
      setError(null);

      for (const msg of data.messages ?? []) {
        applyMessage(msg);
      }

      if (pollTimer.current) clearInterval(pollTimer.current);
      pollTimer.current = setInterval(pollOnce, POLL_INTERVAL_MS);
    } catch {
      setConnected(false);
      setError(
        'Could not reach /api/sync. Hard refresh the page (Cmd+Shift+R). If testing locally, run npm run dev.',
      );
      reconnectTimer.current = setTimeout(connectApi, RECONNECT_DELAY_MS);
    }
  }, [applyMessage, pollOnce]);

  const connectWs = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

    intentionalClose.current = false;
    const ws = new WebSocket(getWsUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
      if (!intentionalClose.current) {
        reconnectTimer.current = setTimeout(connectWs, RECONNECT_DELAY_MS);
      }
    };

    ws.onerror = () => {
      if (!intentionalClose.current) {
        setError(
          'Could not connect to sync server. Run npm run dev locally (starts both app + sync server).',
        );
      }
    };

    ws.onmessage = handleWsMessage;
  }, [handleWsMessage]);

  useEffect(() => {
    if (!enabled) {
      intentionalClose.current = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (pollTimer.current) clearInterval(pollTimer.current);
      wsRef.current?.close();
      wsRef.current = null;
      setConnected(false);
      return;
    }

    intentionalClose.current = false;

    if (useApi) {
      connectApi();
    } else {
      connectWs();
    }

    return () => {
      intentionalClose.current = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (pollTimer.current) clearInterval(pollTimer.current);
      wsRef.current?.close();
    };
  }, [enabled, useApi, connectApi, connectWs]);

  const postAction = useCallback(
    async (message: Record<string, unknown>) => {
      const payload = {
        playerId: playerIdRef.current,
        roomId: roomIdRef.current,
        ...message,
      };

      try {
        const res = await fetch(getSyncApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? 'Sync request failed.');
          return false;
        }

        if (data.playerId) {
          playerIdRef.current = data.playerId;
          setPlayerId(data.playerId);
        }
        if (data.roomId) {
          roomIdRef.current = data.roomId;
        }

        for (const msg of data.messages ?? []) {
          applyMessage(msg);
        }
        return true;
      } catch {
        setError('Not connected to sync server. Please wait a moment and try again.');
        return false;
      }
    },
    [applyMessage],
  );

  const sendWs = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    setError('Not connected to sync server. Please wait a moment and try again.');
    return false;
  }, []);

  const send = useCallback(
    (message: object) => {
      if (useApi) {
        void postAction(message as Record<string, unknown>);
        return true;
      }
      return sendWs(message);
    },
    [useApi, postAction, sendWs],
  );

  const createRoom = useCallback(
    (name: string) => send({ type: 'create-room', name }),
    [send],
  );

  const joinRoom = useCallback(
    (roomId: string, name: string) => send({ type: 'join-room', roomId, name }),
    [send],
  );

  const updateSettings = useCallback(
    (layoutId: string, themeId: string, photoCount: number) =>
      send({ type: 'update-settings', layoutId, themeId, photoCount }),
    [send],
  );

  const startSession = useCallback(
    (photoCount: number) => send({ type: 'start-session', photoCount }),
    [send],
  );

  const startCountdown = useCallback(
    (photoIndex: number, seconds: number) =>
      send({ type: 'start-countdown', photoIndex, seconds }),
    [send],
  );

  const sendPhoto = useCallback(
    (photoIndex: number, dataUrl: string) => {
      setWaitingForPartner(true);
      return send({ type: 'photo-captured', photoIndex, dataUrl });
    },
    [send],
  );

  const leaveRoom = useCallback(() => {
    send({ type: 'leave-room' });
    setRoom(null);
    roomIdRef.current = null;
    setIsHost(false);
    setDuoSlotReady(null);
    setDuoPhotosComplete(null);
    setCaptureComplete(false);
    setSyncCountdown(null);
    setWaitingForPartner(false);
  }, [send]);

  const resetCapture = useCallback(() => {
    setDuoSlotReady(null);
    setDuoPhotosComplete(null);
    setCaptureComplete(false);
    setSyncCountdown(null);
    setWaitingForPartner(false);
  }, []);

  const clearDuoSlotReady = useCallback(() => setDuoSlotReady(null), []);

  const retryConnect = useCallback(() => {
    if (useApi) connectApi();
    else connectWs();
  }, [useApi, connectApi, connectWs]);

  return {
    connected,
    playerId,
    room,
    isHost,
    error,
    duoSlotReady,
    duoPhotosComplete,
    syncCountdown,
    captureComplete,
    waitingForPartner,
    createRoom,
    joinRoom,
    updateSettings,
    startSession,
    startCountdown,
    sendPhoto,
    leaveRoom,
    resetCapture,
    clearDuoSlotReady,
    setError,
    retryConnect,
  };
}
