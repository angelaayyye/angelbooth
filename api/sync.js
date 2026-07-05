import { Redis } from '@upstash/redis';
import {
  getGlobalRoomManager,
  processSyncMessage,
} from '../server/syncEngine.js';

const PREFIX = 'photobooth:';
const ROOM_TTL = 60 * 60;

function getRedis() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function loadRoomManager(redis) {
  if (!redis) return getGlobalRoomManager();

  const manager = getGlobalRoomManager();
  manager.rooms.clear();

  const keys = await redis.keys(`${PREFIX}room:*`);
  for (const key of keys) {
    const room = await redis.get(key);
    if (room?.id) manager.rooms.set(room.id, room);
  }
  return manager;
}

async function persistRooms(redis, manager) {
  if (!redis) return;
  for (const room of manager.rooms.values()) {
    await redis.set(`${PREFIX}room:${room.id}`, room, { ex: ROOM_TTL });
  }
}

async function enqueueMessages(redis, outbound) {
  for (const { targetId, message } of outbound) {
    const key = `${PREFIX}queue:${targetId}`;
    if (redis) {
      await redis.rpush(key, JSON.stringify(message));
      await redis.expire(key, ROOM_TTL);
    } else {
      if (!globalThis.__photoboothQueues) {
        globalThis.__photoboothQueues = new Map();
      }
      const queue = globalThis.__photoboothQueues.get(key) ?? [];
      queue.push(JSON.stringify(message));
      globalThis.__photoboothQueues.set(key, queue);
    }
  }
}

async function pollMessages(redis, playerId, cursor) {
  const key = `${PREFIX}queue:${playerId}`;
  let raw = [];

  if (redis) {
    const len = await redis.llen(key);
    if (cursor < len) {
      raw = await redis.lrange(key, cursor, len - 1);
    }
    return { messages: raw.map((item) => JSON.parse(item)), cursor: len };
  }

  const queue = globalThis.__photoboothQueues?.get(key) ?? [];
  raw = queue.slice(cursor);
  return {
    messages: raw.map((item) => JSON.parse(item)),
    cursor: queue.length,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const redis = getRedis();
  const storageReady =
    !!redis || process.env.VERCEL !== '1';

  if (!storageReady) {
    res.status(503).json({
      error:
        'Sync storage not configured. In Vercel → Storage → Upstash Redis → Connect to this project, then redeploy.',
    });
    return;
  }

  if (req.method === 'GET') {
    const playerId = req.query.playerId;
    const cursor = Number(req.query.cursor ?? 0);

    if (!playerId) {
      res.status(400).json({ error: 'playerId required' });
      return;
    }

    const { messages, cursor: nextCursor } = await pollMessages(
      redis,
      playerId,
      cursor,
    );
    res.status(200).json({ messages, cursor: nextCursor, ok: true });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const manager = await loadRoomManager(redis);
    const currentPlayerId = body.playerId ?? null;
    const result = processSyncMessage(manager, currentPlayerId, body);

    await persistRooms(redis, manager);
    await enqueueMessages(redis, result.outbound);

    const immediate = result.outbound
      .filter((item) => item.targetId === result.playerId)
      .map((item) => item.message);

    res.status(200).json({
      ok: true,
      playerId: result.playerId,
      roomId: result.roomId,
      messages: immediate,
    });
  } catch (err) {
    console.error('sync error', err);
    res.status(500).json({ error: 'Sync server error' });
  }
}
