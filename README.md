# Photobooth

An online photobooth with frame layouts, themes, stickers, and remote duo sessions.

## Features

- **Welcome screen** guiding you to pick your frame
- **6 layouts**: 4-photo strip, 3-photo strip, 2-photo strip, 2×2 grid, 2-photo horizontal, single photo
- **6 themes**: Cherry blossom, mint, lavender, vintage cream, classic white, midnight
- **Solo mode**: Take photos on your device with countdown timer
- **Remote duo mode**: Two people on different devices share a room code, take turns with a synchronized countdown, and build one photo strip together
- **50+ stickers** to decorate your strip
- **Download** as PNG

## Getting Started

```bash
npm install
npm run dev
```

This starts both the web app (port 5173) and the sync server (port 3001).

Open http://localhost:5173 and allow camera access.

## Remote Duo on Vercel

The live site uses `/api/sync` (HTTP polling) instead of WebSockets. One-time setup:

1. Open your project in [Vercel](https://vercel.com) → **Storage** → **Upstash Redis** → **Connect**
2. Redeploy the project

Both friends can then create/join rooms on the deployed site. Local dev still uses the WebSocket server on port 3001 (`npm run dev`).

## Remote Duo How It Works

1. Both friends open the site and click **Pick Your Frame**
2. Choose a layout, theme, and select **Remote Duo**
3. One person **creates a room** and shares the 6-letter code
4. The other person **joins with the code**
5. Host clicks **Start Photo Session**
6. You take turns — each person sees the same synchronized countdown
7. Photos combine into one strip for both of you to decorate and save

## Scripts

- `npm run dev` — Start app + sync server
- `npm run dev:client` — Vite only
- `npm run dev:server` — Sync server only
- `npm run build` — Production build
