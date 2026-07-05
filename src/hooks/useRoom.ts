import { useCallback, useEffect, useRef, useState } from 'react';
import type { DuoCapturePart, RoomState } from '../types';
import { getWsUrl } from '../constants';

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

export function useRoom() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentionalClose = useRef(false);
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

  const handleMessage = useCallback((event: MessageEvent) => {
    const msg: ServerMessage = JSON.parse(event.data);

    switch (msg.type) {
      case 'connected':
        setPlayerId(msg.playerId);
        setError(null);
        break;
      case 'room-joined':
        setRoom(msg.room);
        setIsHost(msg.isHost);
        setPlayerId(msg.playerId);
        setError(null);
        break;
      case 'room-updated':
      case 'session-started':
        setRoom(msg.room);
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

  const connect = useCallback(() => {
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
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };

    ws.onerror = () => {
      if (!intentionalClose.current) {
        setError('Could not connect to sync server. Retrying…');
      }
    };

    ws.onmessage = handleMessage;
  }, [handleMessage]);

  useEffect(() => {
    connect();
    return () => {
      intentionalClose.current = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const send = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    setError('Not connected to sync server. Please wait a moment and try again.');
    return false;
  }, []);

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
    retryConnect: connect,
  };
}
