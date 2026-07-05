import { randomUUID } from 'crypto';
import { RoomManager } from './rooms.js';

function publicRoom(room) {
  return {
    id: room.id,
    hostId: room.hostId,
    layoutId: room.layoutId,
    themeId: room.themeId,
    phase: room.phase,
    players: room.players,
    photos: room.photos.map((p) =>
      p ? { hasPhoto: true, isDuo: !!p.parts } : null,
    ),
    pendingCount: room.pendingCaptures
      ? Object.keys(room.pendingCaptures[room.currentPhotoIndex] || {}).length
      : 0,
    currentPhotoIndex: room.currentPhotoIndex,
    countdown: room.countdown,
    countdownStartedAt: room.countdownStartedAt,
  };
}

function duoPhotosPayload(room) {
  return room.photos.map((p) => (p?.parts ? p.parts : null));
}

function roomPlayerIds(room) {
  return room?.players?.map((p) => p.id) ?? [];
}

/**
 * Process one client message. Returns outbound messages keyed by target playerId,
 * or `broadcast` for all players in the room.
 */
export function processSyncMessage(roomManager, playerId, msg) {
  const outbound = [];

  const sendTo = (targetId, message) => {
    outbound.push({ targetId, message });
  };

  const broadcast = (roomId, message, excludeId = null) => {
    const room = roomManager.getRoom(roomId);
    if (!room) return;
    for (const p of room.players) {
      if (p.id !== excludeId) sendTo(p.id, message);
    }
  };

  switch (msg.type) {
    case 'connect': {
      const id = randomUUID();
      sendTo(id, { type: 'connected', playerId: id });
      return { playerId: id, outbound, roomId: null };
    }

    case 'create-room': {
      const name = (msg.name || 'Player 1').slice(0, 20);
      const room = roomManager.createRoom(playerId, name);
      sendTo(playerId, {
        type: 'room-joined',
        room: publicRoom(room),
        playerId,
        isHost: true,
      });
      return { playerId, outbound, roomId: room.id };
    }

    case 'join-room': {
      const name = (msg.name || 'Player 2').slice(0, 20);
      if (!msg.roomId) {
        sendTo(playerId, { type: 'error', message: 'Room code required.' });
        return { playerId, outbound, roomId: null };
      }
      const result = roomManager.joinRoom(msg.roomId, playerId, name);
      if (result.error) {
        sendTo(playerId, { type: 'error', message: result.error });
        return { playerId, outbound, roomId: null };
      }
      sendTo(playerId, {
        type: 'room-joined',
        room: publicRoom(result.room),
        playerId,
        isHost: false,
      });
      broadcast(result.room.id, {
        type: 'room-updated',
        room: publicRoom(result.room),
      });
      return { playerId, outbound, roomId: result.room.id };
    }

    case 'update-settings': {
      const room = roomManager.updateSettings(msg.roomId, msg.layoutId, msg.themeId);
      if (!room || room.hostId !== playerId) {
        return { playerId, outbound, roomId: msg.roomId ?? null };
      }
      if (msg.photoCount) {
        roomManager.setPhotoCount(msg.roomId, msg.photoCount);
      }
      const updated = roomManager.getRoom(msg.roomId);
      broadcast(msg.roomId, { type: 'room-updated', room: publicRoom(updated) });
      return { playerId, outbound, roomId: msg.roomId };
    }

    case 'start-session': {
      const room = roomManager.getRoom(msg.roomId);
      if (!room || room.hostId !== playerId) {
        return { playerId, outbound, roomId: msg.roomId ?? null };
      }
      if (room.players.filter((p) => p.connected).length < 2) {
        sendTo(playerId, {
          type: 'error',
          message: 'Waiting for your friend to join.',
        });
        return { playerId, outbound, roomId: msg.roomId };
      }
      if (msg.photoCount) {
        roomManager.setPhotoCount(msg.roomId, msg.photoCount);
      } else if (!room.photos.length) {
        roomManager.setPhotoCount(msg.roomId, 4);
      }
      roomManager.startCapture(msg.roomId);
      const updated = roomManager.getRoom(msg.roomId);
      broadcast(msg.roomId, {
        type: 'session-started',
        room: publicRoom(updated),
      });
      return { playerId, outbound, roomId: msg.roomId };
    }

    case 'start-countdown': {
      const room = roomManager.getRoom(msg.roomId);
      if (!room || room.phase !== 'capture') {
        return { playerId, outbound, roomId: msg.roomId ?? null };
      }
      const startedAt = Date.now();
      roomManager.startCountdown(msg.roomId, msg.photoIndex, msg.seconds, startedAt);
      broadcast(msg.roomId, {
        type: 'countdown-started',
        photoIndex: msg.photoIndex,
        seconds: msg.seconds,
        startedAt,
        triggeredBy: playerId,
      });
      return { playerId, outbound, roomId: msg.roomId };
    }

    case 'photo-captured': {
      const room = roomManager.getRoom(msg.roomId);
      if (!room) return { playerId, outbound, roomId: null };

      const result = roomManager.addDuoCapture(
        msg.roomId,
        msg.photoIndex,
        playerId,
        msg.dataUrl,
      );
      if (!result) return { playerId, outbound, roomId: msg.roomId };

      broadcast(msg.roomId, {
        type: 'duo-capture-received',
        photoIndex: msg.photoIndex,
        playerId,
        room: publicRoom(result.room),
      });

      if (!result.ready) {
        return { playerId, outbound, roomId: msg.roomId };
      }

      broadcast(msg.roomId, {
        type: 'duo-slot-ready',
        photoIndex: msg.photoIndex,
        parts: result.parts,
        room: publicRoom(result.room),
      });

      if (msg.photoIndex + 1 >= result.room.photos.length) {
        roomManager.advancePhoto(msg.roomId);
        const done = roomManager.getRoom(msg.roomId);
        broadcast(msg.roomId, {
          type: 'capture-complete',
          duoPhotos: duoPhotosPayload(done),
          room: publicRoom(done),
        });
      } else {
        roomManager.advancePhoto(msg.roomId);
        const next = roomManager.getRoom(msg.roomId);
        broadcast(msg.roomId, {
          type: 'next-photo',
          photoIndex: next.currentPhotoIndex,
          room: publicRoom(next),
        });
      }
      return { playerId, outbound, roomId: msg.roomId };
    }

    case 'leave-room': {
      if (msg.roomId) {
        roomManager.setPlayerDisconnected(msg.roomId, playerId);
        const updated = roomManager.getRoom(msg.roomId);
        broadcast(msg.roomId, {
          type: 'player-left',
          playerId,
          room: publicRoom(updated),
        });
      }
      return { playerId, outbound, roomId: null };
    }

    case 'webrtc-signal': {
      if (!msg.roomId || !msg.signal) {
        return { playerId, outbound, roomId: msg.roomId ?? null };
      }
      broadcast(
        msg.roomId,
        { type: 'webrtc-signal', from: playerId, signal: msg.signal },
        playerId,
      );
      return { playerId, outbound, roomId: msg.roomId };
    }

    default:
      return { playerId, outbound, roomId: msg.roomId ?? null };
  }
}

export function getGlobalRoomManager() {
  if (!globalThis.__photoboothRoomManager) {
    globalThis.__photoboothRoomManager = new RoomManager();
  }
  return globalThis.__photoboothRoomManager;
}

export function playerIdsInManager(roomManager) {
  const ids = new Set();
  for (const room of roomManager.rooms.values()) {
    for (const id of roomPlayerIds(room)) ids.add(id);
  }
  return ids;
}
