import { createServer } from 'http';
import { randomUUID } from 'crypto';
import { WebSocketServer } from 'ws';
import { RoomManager } from './rooms.js';

const PORT = process.env.PORT || 3001;
const rooms = new RoomManager();

const server = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Photobooth sync server');
});

const wss = new WebSocketServer({ server });

/** @type {Map<WebSocket, { playerId: string, roomId: string | null }>} */
const clients = new Map();

function send(ws, message) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function broadcast(roomId, message, excludeWs = null) {
  for (const [ws, meta] of clients.entries()) {
    if (meta.roomId === roomId && ws !== excludeWs) {
      send(ws, message);
    }
  }
}

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

wss.on('connection', (ws) => {
  const playerId = randomUUID();
  clients.set(ws, { playerId, roomId: null });

  send(ws, { type: 'connected', playerId });

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      send(ws, { type: 'error', message: 'Invalid message' });
      return;
    }

    const meta = clients.get(ws);
    if (!meta) return;

    switch (msg.type) {
      case 'create-room': {
        const name = (msg.name || 'Player 1').slice(0, 20);
        const room = rooms.createRoom(meta.playerId, name);
        meta.roomId = room.id;
        send(ws, { type: 'room-joined', room: publicRoom(room), playerId: meta.playerId, isHost: true });
        break;
      }

      case 'join-room': {
        const name = (msg.name || 'Player 2').slice(0, 20);
        const result = rooms.joinRoom(msg.roomId, meta.playerId, name);
        if (result.error) {
          send(ws, { type: 'error', message: result.error });
          break;
        }
        meta.roomId = result.room.id;
        send(ws, {
          type: 'room-joined',
          room: publicRoom(result.room),
          playerId: meta.playerId,
          isHost: false,
        });
        broadcast(result.room.id, {
          type: 'room-updated',
          room: publicRoom(result.room),
        });
        break;
      }

      case 'update-settings': {
        const room = rooms.updateSettings(meta.roomId, msg.layoutId, msg.themeId);
        if (!room || room.hostId !== meta.playerId) break;
        if (msg.photoCount) {
          rooms.setPhotoCount(meta.roomId, msg.photoCount);
        }
        const updated = rooms.getRoom(meta.roomId);
        broadcast(meta.roomId, { type: 'room-updated', room: publicRoom(updated) });
        break;
      }

      case 'start-session': {
        const room = rooms.getRoom(meta.roomId);
        if (!room || room.hostId !== meta.playerId) break;
        if (room.players.filter((p) => p.connected).length < 2) {
          send(ws, { type: 'error', message: 'Waiting for your friend to join.' });
          break;
        }
        if (msg.photoCount) {
          rooms.setPhotoCount(meta.roomId, msg.photoCount);
        } else if (!room.photos.length) {
          rooms.setPhotoCount(meta.roomId, 4);
        }
        rooms.startCapture(meta.roomId);
        const updated = rooms.getRoom(meta.roomId);
        broadcast(meta.roomId, { type: 'session-started', room: publicRoom(updated) });
        break;
      }

      case 'start-countdown': {
        const room = rooms.getRoom(meta.roomId);
        if (!room || room.phase !== 'capture') break;
        const startedAt = Date.now();
        rooms.startCountdown(meta.roomId, msg.photoIndex, msg.seconds, startedAt);
        broadcast(meta.roomId, {
          type: 'countdown-started',
          photoIndex: msg.photoIndex,
          seconds: msg.seconds,
          startedAt,
          triggeredBy: meta.playerId,
        });
        break;
      }

      case 'photo-captured': {
        const room = rooms.getRoom(meta.roomId);
        if (!room) break;

        const result = rooms.addDuoCapture(
          meta.roomId,
          msg.photoIndex,
          meta.playerId,
          msg.dataUrl,
        );
        if (!result) break;

        broadcast(meta.roomId, {
          type: 'duo-capture-received',
          photoIndex: msg.photoIndex,
          playerId: meta.playerId,
          room: publicRoom(result.room),
        });

        if (!result.ready) break;

        broadcast(meta.roomId, {
          type: 'duo-slot-ready',
          photoIndex: msg.photoIndex,
          parts: result.parts,
          room: publicRoom(result.room),
        });

        if (msg.photoIndex + 1 >= result.room.photos.length) {
          rooms.advancePhoto(meta.roomId);
          const done = rooms.getRoom(meta.roomId);
          broadcast(meta.roomId, {
            type: 'capture-complete',
            duoPhotos: duoPhotosPayload(done),
            room: publicRoom(done),
          });
        } else {
          rooms.advancePhoto(meta.roomId);
          const next = rooms.getRoom(meta.roomId);
          broadcast(meta.roomId, {
            type: 'next-photo',
            photoIndex: next.currentPhotoIndex,
            room: publicRoom(next),
          });
        }
        break;
      }

      case 'leave-room': {
        if (meta.roomId) {
          rooms.setPlayerDisconnected(meta.roomId, meta.playerId);
          broadcast(meta.roomId, {
            type: 'player-left',
            playerId: meta.playerId,
            room: publicRoom(rooms.getRoom(meta.roomId)),
          });
          meta.roomId = null;
        }
        break;
      }

      case 'webrtc-signal': {
        if (!meta.roomId || !msg.signal) break;
        broadcast(
          meta.roomId,
          { type: 'webrtc-signal', from: meta.playerId, signal: msg.signal },
          ws,
        );
        break;
      }

      default:
        break;
    }
  });

  ws.on('close', () => {
    const meta = clients.get(ws);
    if (meta?.roomId) {
      rooms.setPlayerDisconnected(meta.roomId, meta.playerId);
      broadcast(meta.roomId, {
        type: 'player-left',
        playerId: meta.playerId,
        room: publicRoom(rooms.getRoom(meta.roomId)),
      });
    }
    clients.delete(ws);
  });
});

setInterval(() => rooms.cleanup(), 5 * 60 * 1000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Photobooth sync server on port ${PORT}`);
});
