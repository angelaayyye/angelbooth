const ROOM_TTL_MS = 60 * 60 * 1000;

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export class RoomManager {
  constructor() {
    /** @type {Map<string, object>} */
    this.rooms = new Map();
  }

  createRoom(hostId, hostName) {
    let code = generateRoomCode();
    while (this.rooms.has(code)) {
      code = generateRoomCode();
    }

    const room = {
      id: code,
      hostId,
      layoutId: 'strip-4',
      themeId: 'pink',
      phase: 'lobby',
      players: [{ id: hostId, name: hostName, connected: true }],
      photos: [],
      pendingCaptures: {},
      currentPhotoIndex: 0,
      countdown: null,
      countdownStartedAt: null,
      createdAt: Date.now(),
    };

    this.rooms.set(code, room);
    return room;
  }

  joinRoom(code, playerId, playerName) {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) return { error: 'Room not found. Check the code and try again.' };
    if (room.players.length >= 2) {
      return { error: 'This room is full. Only 2 players can join.' };
    }
    if (room.phase !== 'lobby') {
      return { error: 'This session has already started.' };
    }

    room.players.push({ id: playerId, name: playerName, connected: true });
    return { room };
  }

  getRoom(code) {
    return this.rooms.get(code.toUpperCase()) || null;
  }

  updateSettings(code, layoutId, themeId) {
    const room = this.getRoom(code);
    if (!room) return null;
    if (layoutId) room.layoutId = layoutId;
    if (themeId) room.themeId = themeId;
    return room;
  }

  setPhotoCount(code, count) {
    const room = this.getRoom(code);
    if (!room) return null;
    room.photos = Array(count).fill(null);
    room.pendingCaptures = {};
    return room;
  }

  startCapture(code) {
    const room = this.getRoom(code);
    if (!room) return null;
    room.phase = 'capture';
    room.currentPhotoIndex = 0;
    room.countdown = null;
    room.pendingCaptures = {};
    return room;
  }

  startCountdown(code, photoIndex, seconds, startedAt) {
    const room = this.getRoom(code);
    if (!room) return null;
    room.currentPhotoIndex = photoIndex;
    room.countdown = seconds;
    room.countdownStartedAt = startedAt;
    return room;
  }

  clearCountdown(code) {
    const room = this.getRoom(code);
    if (!room) return null;
    room.countdown = null;
    room.countdownStartedAt = null;
    return room;
  }

  addDuoCapture(code, photoIndex, playerId, dataUrl) {
    const room = this.getRoom(code);
    if (!room) return null;

    if (!room.pendingCaptures) room.pendingCaptures = {};
    if (!room.pendingCaptures[photoIndex]) room.pendingCaptures[photoIndex] = {};

    room.pendingCaptures[photoIndex][playerId] = dataUrl;
    room.countdown = null;
    room.countdownStartedAt = null;

    const connectedPlayers = room.players.filter((p) => p.connected);
    const pending = room.pendingCaptures[photoIndex];
    const ready = connectedPlayers.every((p) => pending[p.id]);

    if (!ready) {
      return { room, ready: false };
    }

    const parts = connectedPlayers.map((p) => ({
      playerId: p.id,
      name: p.name,
      dataUrl: pending[p.id],
    }));

    delete room.pendingCaptures[photoIndex];
    room.photos[photoIndex] = { parts };

    return { room, ready: true, parts };
  }

  getDuoPhotoParts(code) {
    const room = this.getRoom(code);
    if (!room) return [];
    return room.photos.map((p) => (p?.parts ? p.parts : null));
  }

  advancePhoto(code) {
    const room = this.getRoom(code);
    if (!room) return null;
    room.currentPhotoIndex += 1;
    if (room.currentPhotoIndex >= room.photos.length) {
      room.phase = 'done';
    }
    return room;
  }

  setPlayerDisconnected(code, playerId) {
    const room = this.getRoom(code);
    if (!room) return null;
    const player = room.players.find((p) => p.id === playerId);
    if (player) player.connected = false;
    return room;
  }

  cleanup() {
    const now = Date.now();
    for (const [code, room] of this.rooms.entries()) {
      if (now - room.createdAt > ROOM_TTL_MS) {
        this.rooms.delete(code);
      }
    }
  }
}
