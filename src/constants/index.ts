import type {
  LayoutOption,
  ThemeOption,
  StickerDef,
  StickerPack,
  StripColorOption,
  StripStyle,
} from '../types';

export const LAYOUTS: LayoutOption[] = [
  {
    id: 'strip-4',
    name: '4-Photo Strip',
    photoCount: 4,
    cols: 1,
    rows: 4,
    aspectRatio: 3 / 4,
    description: 'Classic vertical strip',
  },
  {
    id: 'strip-3',
    name: '3-Photo Strip',
    photoCount: 3,
    cols: 1,
    rows: 3,
    aspectRatio: 3 / 4,
    description: 'Compact vertical strip',
  },
  {
    id: 'strip-2',
    name: '2-Photo Strip',
    photoCount: 2,
    cols: 1,
    rows: 2,
    aspectRatio: 3 / 4,
    description: 'Perfect for duos',
  },
  {
    id: 'grid-4',
    name: '4-Photo Grid',
    photoCount: 4,
    cols: 2,
    rows: 2,
    aspectRatio: 1,
    description: '2×2 photo grid',
  },
  {
    id: 'grid-2',
    name: '2-Photo Grid',
    photoCount: 2,
    cols: 2,
    rows: 1,
    aspectRatio: 4 / 3,
    description: 'Side-by-side photos',
  },
  {
    id: 'single',
    name: 'Single Photo',
    photoCount: 1,
    cols: 1,
    rows: 1,
    aspectRatio: 3 / 4,
    description: 'One perfect shot',
  },
];

export const THEMES: ThemeOption[] = [
  {
    id: 'pink',
    name: 'Cherry Blossom',
    bg: '#fff0f5',
    border: '#ffb7c5',
    accent: '#ff6b9d',
    text: '#8b4560',
  },
  {
    id: 'mint',
    name: 'Mint Dream',
    bg: '#e8faf5',
    border: '#7dd3c0',
    accent: '#2db892',
    text: '#1a6655',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    bg: '#f3eeff',
    border: '#c4b5fd',
    accent: '#8b5cf6',
    text: '#5b21b6',
  },
  {
    id: 'cream',
    name: 'Vintage Cream',
    bg: '#fff8e7',
    border: '#d4a574',
    accent: '#c4841d',
    text: '#6b4423',
  },
  {
    id: 'classic',
    name: 'Classic White',
    bg: '#ffffff',
    border: '#333333',
    accent: '#222222',
    text: '#111111',
  },
  {
    id: 'night',
    name: 'Midnight',
    bg: '#1a1a2e',
    border: '#e94560',
    accent: '#e94560',
    text: '#eaeaea',
  },
];

/** Strip frames — Photoism-style pastels + polka-dot booth prints. */
export const STRIP_COLORS: StripColorOption[] = [
  { id: 'white', name: 'White', bg: '#ffffff', border: '#f4a7c0', text: '#5c3d4a', accent: '#f48fb1', pattern: 'dots-pink' },
  { id: 'baby-pink', name: 'Baby Pink', bg: '#ffe4ef', border: '#f48fb1', text: '#8b4560', accent: '#ec407a', pattern: 'dots-white' },
  { id: 'pink-dots', name: 'Pink Dots', bg: '#fff5f8', border: '#ff8fb8', text: '#a13d5c', accent: '#ff6b9d', pattern: 'dots-pink' },
  { id: 'red-dots', name: 'Red Dots', bg: '#fffafa', border: '#e53935', text: '#b71c1c', accent: '#ef5350', pattern: 'dots-red' },
  { id: 'sky-dots', name: 'Sky Dots', bg: '#f3f9ff', border: '#81d4fa', text: '#1565c0', accent: '#29b6f6', pattern: 'dots-blue' },
  { id: 'cream-dots', name: 'Cream', bg: '#fff8f0', border: '#e8c4a8', text: '#6b4423', accent: '#d4a574', pattern: 'dots-cream' },
  { id: 'blush', name: 'Blush', bg: '#fce4ec', border: '#f48fb1', text: '#880e4f', accent: '#ec407a', pattern: 'solid' },
  { id: 'lilac', name: 'Lilac', bg: '#f3e8ff', border: '#ce93d8', text: '#6a1b9a', accent: '#ab47bc', pattern: 'solid' },
  { id: 'mint', name: 'Mint', bg: '#e8faf5', border: '#80cbc4', text: '#00695c', accent: '#26a69a', pattern: 'solid' },
  { id: 'butter', name: 'Butter', bg: '#fffde7', border: '#ffe082', text: '#f57f17', accent: '#ffca28', pattern: 'solid' },
  { id: 'black', name: 'Black', bg: '#141414', border: '#ffffff', text: '#ffffff', accent: '#f8bbd0', pattern: 'solid' },
  { id: 'navy', name: 'Navy', bg: '#1a237e', border: '#9fa8da', text: '#e8eaf6', accent: '#c5cae9', pattern: 'solid' },
];

export const STICKER_PACKS: StickerPack[] = [
  { id: 'puffy', name: 'Puffy 3D', preview: '👻☁️🎧' },
  { id: 'coquette', name: 'Coquette', preview: '🩷🎀🌸' },
  { id: 'kawaii', name: 'Kawaii', preview: '🐵💕☁️' },
  { id: 'valentines', name: 'Valentines', preview: '💕💋' },
  { id: 'soft', name: 'Soft Core', preview: '🫧🤍✨' },
  { id: 'bw', name: 'B&W', preview: '★♡美' },
];

export const STICKERS: StickerDef[] = [
  // Puffy / claymorphic white aesthetic
  { id: 'pf1', emoji: '👻', pack: 'puffy', label: 'Ghost' },
  { id: 'pf2', emoji: '☁️', pack: 'puffy', label: 'Cloud' },
  { id: 'pf3', emoji: '🎧', pack: 'puffy', label: 'Headphones' },
  { id: 'pf4', emoji: '🔑', pack: 'puffy', label: 'Key' },
  { id: 'pf5', emoji: '🎤', pack: 'puffy', label: 'Mic' },
  { id: 'pf6', emoji: '💬', pack: 'puffy', label: 'Speech bubble' },
  { id: 'pf7', emoji: '💭', pack: 'puffy', label: 'Thought bubble' },
  { id: 'pf8', emoji: '🤍', pack: 'puffy', label: 'White heart' },
  { id: 'pf9', emoji: '🔍', pack: 'puffy', label: 'Magnifier' },
  { id: 'pf10', emoji: '🌀', pack: 'puffy', label: 'Dizzy' },
  { id: 'pf11', emoji: '🫥', pack: 'puffy', label: 'Dotted face' },
  { id: 'pf12', emoji: '🫧', pack: 'puffy', label: 'Bubbles' },
  { id: 'pf13', emoji: '📎', pack: 'puffy', label: 'Clip' },
  { id: 'pf14', emoji: '🥛', pack: 'puffy', label: 'Milk' },

  // Coquette / soft pink scrapbook
  { id: 'cq1', emoji: '🩷', pack: 'coquette', label: 'Pink heart' },
  { id: 'cq2', emoji: '🎀', pack: 'coquette', label: 'Ribbon' },
  { id: 'cq3', emoji: '🌸', pack: 'coquette', label: 'Blossom' },
  { id: 'cq4', emoji: '🩰', pack: 'coquette', label: 'Ballet' },
  { id: 'cq5', emoji: '🦢', pack: 'coquette', label: 'Swan' },
  { id: 'cq6', emoji: '💌', pack: 'coquette', label: 'Love letter' },
  { id: 'cq7', emoji: '🌷', pack: 'coquette', label: 'Tulip' },
  { id: 'cq8', emoji: '🧸', pack: 'coquette', label: 'Teddy' },
  { id: 'cq9', emoji: '🐰', pack: 'coquette', label: 'Bunny' },
  { id: 'cq10', emoji: '☕', pack: 'coquette', label: 'Coffee' },
  { id: 'cq11', emoji: '🪞', pack: 'coquette', label: 'Mirror' },
  { id: 'cq12', emoji: '💋', pack: 'coquette', label: 'Kiss' },
  { id: 'cq13', emoji: '🌹', pack: 'coquette', label: 'Rose' },
  { id: 'cq14', emoji: '🧁', pack: 'coquette', label: 'Cupcake' },

  // Kawaii / Monchhichi booth vibes
  { id: 'kw1', emoji: '🐵', pack: 'kawaii', label: 'Monkey' },
  { id: 'kw2', emoji: '💕', pack: 'kawaii', label: 'Hearts' },
  { id: 'kw3', emoji: '☁️', pack: 'kawaii', label: 'Cloud' },
  { id: 'kw4', emoji: '💗', pack: 'kawaii', label: 'Growing heart' },
  { id: 'kw5', emoji: '🍼', pack: 'kawaii', label: 'Bottle' },
  { id: 'kw6', emoji: '🎀', pack: 'kawaii', label: 'Bow' },
  { id: 'kw7', emoji: '🥰', pack: 'kawaii', label: 'Smiling hearts' },
  { id: 'kw8', emoji: '🐻', pack: 'kawaii', label: 'Bear' },
  { id: 'kw9', emoji: '🐶', pack: 'kawaii', label: 'Puppy' },
  { id: 'kw10', emoji: '🐣', pack: 'kawaii', label: 'Chick' },
  { id: 'kw11', emoji: '⭐', pack: 'kawaii', label: 'Star' },
  { id: 'kw12', emoji: '🍬', pack: 'kawaii', label: 'Candy' },
  { id: 'kw13', emoji: '🍥', pack: 'kawaii', label: 'Narutomaki' },
  { id: 'kw14', emoji: '🐱', pack: 'kawaii', label: 'Kitty' },

  // Valentines
  { id: 'v1', emoji: '💕', pack: 'valentines', label: 'Two hearts' },
  { id: 'v2', emoji: '💖', pack: 'valentines', label: 'Sparkling heart' },
  { id: 'v3', emoji: '💘', pack: 'valentines', label: 'Heart arrow' },
  { id: 'v4', emoji: '💝', pack: 'valentines', label: 'Heart box' },
  { id: 'v5', emoji: '🩷', pack: 'valentines', label: 'Pink heart' },
  { id: 'v6', emoji: '🤍', pack: 'valentines', label: 'White heart' },
  { id: 'v7', emoji: '💋', pack: 'valentines', label: 'Kiss' },
  { id: 'v8', emoji: '😘', pack: 'valentines', label: 'Blow kiss' },
  { id: 'v9', emoji: '💑', pack: 'valentines', label: 'Couple' },
  { id: 'v10', emoji: '🫶', pack: 'valentines', label: 'Heart hands' },

  // Soft core / dreamy
  { id: 'sf1', emoji: '🫧', pack: 'soft', label: 'Bubbles' },
  { id: 'sf2', emoji: '🤍', pack: 'soft', label: 'White heart' },
  { id: 'sf3', emoji: '✨', pack: 'soft', label: 'Sparkles' },
  { id: 'sf4', emoji: '☁️', pack: 'soft', label: 'Cloud' },
  { id: 'sf5', emoji: '🌙', pack: 'soft', label: 'Moon' },
  { id: 'sf6', emoji: '🕊️', pack: 'soft', label: 'Dove' },
  { id: 'sf7', emoji: '💫', pack: 'soft', label: 'Dizzy star' },
  { id: 'sf8', emoji: '🦋', pack: 'soft', label: 'Butterfly' },
  { id: 'sf9', emoji: '🌸', pack: 'soft', label: 'Blossom' },
  { id: 'sf10', emoji: '🪽', pack: 'soft', label: 'Wings' },
  { id: 'sf11', emoji: '⭐', pack: 'soft', label: 'Star' },
  { id: 'sf12', emoji: '🫧', pack: 'soft', label: 'Soap bubbles' },

  // B&W classic booth
  { id: 'b1', emoji: '★', pack: 'bw', label: 'Star' },
  { id: 'b2', emoji: '✦', pack: 'bw', label: 'Sparkle star' },
  { id: 'b3', emoji: '♡', pack: 'bw', label: 'Heart outline' },
  { id: 'b4', emoji: '✿', pack: 'bw', label: 'Flower' },
  { id: 'b5', emoji: '美', pack: 'bw', label: 'Beauty' },
  { id: 'b6', emoji: '✧', pack: 'bw', label: 'Sparkle' },
  { id: 'b7', emoji: '♪', pack: 'bw', label: 'Music note' },
  { id: 'b8', emoji: '○', pack: 'bw', label: 'Circle' },
  { id: 'b9', emoji: '✕', pack: 'bw', label: 'X mark' },
  { id: 'b10', emoji: '☁', pack: 'bw', label: 'Cloud' },
];

export function getStripColor(id: string): StripColorOption {
  return STRIP_COLORS.find((c) => c.id === id) ?? STRIP_COLORS[0];
}

export function stripColorToStyle(color: StripColorOption): StripStyle {
  return {
    bg: color.bg,
    border: color.border,
    text: color.text,
    accent: color.accent,
    pattern: color.pattern ?? 'solid',
  };
}

export const COUNTDOWN_SECONDS = 3;
export const PHOTO_GAP = 8;
export const STRIP_PADDING = 16;
export const STRIP_BORDER = 4;

export function getWsUrl(): string {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  if (import.meta.env.DEV) {
    return `${protocol}//${window.location.host}/ws`;
  }
  if (import.meta.env.VITE_SYNC_HOST) {
    return `${protocol}//${import.meta.env.VITE_SYNC_HOST}`;
  }
  return `${protocol}//${window.location.hostname}:3001`;
}

/** Use HTTP polling via /api/sync on Vercel (no separate WebSocket server). */
export function useSyncApi(): boolean {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return false;
  }

  // Local dev uses the WebSocket server via Vite proxy
  if (import.meta.env.DEV) return false;

  // Production: use built-in /api/sync unless a real external WS server is configured
  const wsUrl = import.meta.env.VITE_WS_URL as string | undefined;
  if (wsUrl && !wsUrl.includes(':3001') && wsUrl.startsWith('ws')) {
    return false;
  }

  return true;
}

export function getSyncApiUrl(): string {
  return '/api/sync';
}
