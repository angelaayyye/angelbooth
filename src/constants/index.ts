import type { LayoutOption, ThemeOption, StickerDef, StickerPack, StripColorOption } from '../types';

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

/** Strip background colours — inspired by classic booth print palettes. */
export const STRIP_COLORS: StripColorOption[] = [
  { id: 'white', name: 'White', bg: '#ffffff', border: '#1a1a1a', text: '#111111', accent: '#444444' },
  { id: 'black', name: 'Black', bg: '#0a0a0a', border: '#ffffff', text: '#ffffff', accent: '#cccccc' },
  { id: 'blush', name: 'Blush', bg: '#fce4ec', border: '#f48fb1', text: '#880e4f', accent: '#ec407a' },
  { id: 'pink', name: 'Pink', bg: '#f8bbd0', border: '#ec407a', text: '#880e4f', accent: '#c2185b' },
  { id: 'rose', name: 'Rose', bg: '#ffcdd2', border: '#e57373', text: '#b71c1c', accent: '#d32f2f' },
  { id: 'sky', name: 'Sky', bg: '#e3f2fd', border: '#64b5f6', text: '#0d47a1', accent: '#1976d2' },
  { id: 'blue', name: 'Blue', bg: '#90caf9', border: '#1565c0', text: '#0d47a1', accent: '#1976d2' },
  { id: 'butter', name: 'Butter', bg: '#fff9c4', border: '#fbc02d', text: '#f57f17', accent: '#f9a825' },
  { id: 'lilac', name: 'Lilac', bg: '#e1bee7', border: '#8e24aa', text: '#4a148c', accent: '#7b1fa2' },
  { id: 'lavender', name: 'Lavender', bg: '#d1c4e9', border: '#5e35b1', text: '#311b92', accent: '#512da8' },
  { id: 'cream', name: 'Cream', bg: '#efdfc4', border: '#a1887f', text: '#4e342e', accent: '#795548' },
  { id: 'grey', name: 'Grey', bg: '#eeeeee', border: '#616161', text: '#212121', accent: '#424242' },
  { id: 'navy', name: 'Navy', bg: '#1a237e', border: '#7986cb', text: '#e8eaf6', accent: '#9fa8da' },
  { id: 'charcoal', name: 'Charcoal', bg: '#37474f', border: '#90a4ae', text: '#eceff1', accent: '#b0bec5' },
];

export const STICKER_PACKS: StickerPack[] = [
  { id: 'main', name: 'Main', preview: '★✨📸' },
  { id: 'valentines', name: 'Valentines', preview: '💕💋' },
  { id: 'bw', name: 'B&W Pack', preview: '★♡美' },
  { id: 'cute', name: 'Cute', preview: '🐰🌸' },
  { id: 'vibes', name: 'Vibes', preview: '🔥👑' },
  { id: 'food', name: 'Food', preview: '🧋🍰' },
  { id: 'sparkle', name: 'Sparkle', preview: '✨🦋' },
];

export const STICKERS: StickerDef[] = [
  // Main — classic booth favourites
  { id: 'm1', emoji: '⭐', pack: 'main', label: 'Star' },
  { id: 'm2', emoji: '✨', pack: 'main', label: 'Sparkles' },
  { id: 'm3', emoji: '📸', pack: 'main', label: 'Camera' },
  { id: 'm4', emoji: '❤️', pack: 'main', label: 'Heart' },
  { id: 'm5', emoji: '🌟', pack: 'main', label: 'Glowing star' },
  { id: 'm6', emoji: '💫', pack: 'main', label: 'Dizzy' },
  { id: 'm7', emoji: '🎀', pack: 'main', label: 'Ribbon' },
  { id: 'm8', emoji: '👑', pack: 'main', label: 'Crown' },
  { id: 'm9', emoji: '😍', pack: 'main', label: 'Heart eyes' },
  { id: 'm10', emoji: '🌸', pack: 'main', label: 'Cherry blossom' },

  // Valentines
  { id: 'v1', emoji: '💕', pack: 'valentines', label: 'Two hearts' },
  { id: 'v2', emoji: '💖', pack: 'valentines', label: 'Sparkling heart' },
  { id: 'v3', emoji: '💗', pack: 'valentines', label: 'Growing heart' },
  { id: 'v4', emoji: '💘', pack: 'valentines', label: 'Heart arrow' },
  { id: 'v5', emoji: '💝', pack: 'valentines', label: 'Heart box' },
  { id: 'v6', emoji: '🩷', pack: 'valentines', label: 'Pink heart' },
  { id: 'v7', emoji: '💜', pack: 'valentines', label: 'Purple heart' },
  { id: 'v8', emoji: '🤍', pack: 'valentines', label: 'White heart' },
  { id: 'v9', emoji: '💋', pack: 'valentines', label: 'Kiss' },
  { id: 'v10', emoji: '🥰', pack: 'valentines', label: 'Smiling hearts' },
  { id: 'v11', emoji: '♥', pack: 'valentines', label: 'Heart suit' },
  { id: 'v12', emoji: '💑', pack: 'valentines', label: 'Couple' },

  // B&W — monochrome symbols like classic booth overlays
  { id: 'b1', emoji: '★', pack: 'bw', label: 'Star' },
  { id: 'b2', emoji: '✦', pack: 'bw', label: 'Sparkle star' },
  { id: 'b3', emoji: '♡', pack: 'bw', label: 'Heart outline' },
  { id: 'b4', emoji: '✿', pack: 'bw', label: 'Flower' },
  { id: 'b5', emoji: '美', pack: 'bw', label: 'Beauty' },
  { id: 'b6', emoji: '✧', pack: 'bw', label: 'Sparkle' },
  { id: 'b7', emoji: '◇', pack: 'bw', label: 'Diamond' },
  { id: 'b8', emoji: '○', pack: 'bw', label: 'Circle' },
  { id: 'b9', emoji: '▪', pack: 'bw', label: 'Square' },
  { id: 'b10', emoji: '✕', pack: 'bw', label: 'X mark' },
  { id: 'b11', emoji: '♪', pack: 'bw', label: 'Music note' },
  { id: 'b12', emoji: '✎', pack: 'bw', label: 'Pencil' },

  // Cute
  { id: 'c1', emoji: '🐰', pack: 'cute', label: 'Bunny' },
  { id: 'c2', emoji: '🐻', pack: 'cute', label: 'Bear' },
  { id: 'c3', emoji: '🐱', pack: 'cute', label: 'Cat' },
  { id: 'c4', emoji: '🐶', pack: 'cute', label: 'Dog' },
  { id: 'c5', emoji: '🐼', pack: 'cute', label: 'Panda' },
  { id: 'c6', emoji: '🦊', pack: 'cute', label: 'Fox' },
  { id: 'c7', emoji: '🐸', pack: 'cute', label: 'Frog' },
  { id: 'c8', emoji: '🐥', pack: 'cute', label: 'Chick' },
  { id: 'c9', emoji: '🌷', pack: 'cute', label: 'Tulip' },
  { id: 'c10', emoji: '🍀', pack: 'cute', label: 'Clover' },
  { id: 'c11', emoji: '🐾', pack: 'cute', label: 'Paw prints' },
  { id: 'c12', emoji: '🌺', pack: 'cute', label: 'Hibiscus' },

  // Vibes
  { id: 't1', emoji: '💯', pack: 'vibes', label: '100' },
  { id: 't2', emoji: '🔥', pack: 'vibes', label: 'Fire' },
  { id: 't3', emoji: '💅', pack: 'vibes', label: 'Nails' },
  { id: 't4', emoji: '😎', pack: 'vibes', label: 'Cool' },
  { id: 't5', emoji: '🎉', pack: 'vibes', label: 'Party' },
  { id: 't6', emoji: '🤩', pack: 'vibes', label: 'Star eyes' },
  { id: 't7', emoji: '🙌', pack: 'vibes', label: 'Hands up' },
  { id: 't8', emoji: '🫶', pack: 'vibes', label: 'Heart hands' },

  // Food
  { id: 'f1', emoji: '🧋', pack: 'food', label: 'Bubble tea' },
  { id: 'f2', emoji: '🍡', pack: 'food', label: 'Dango' },
  { id: 'f3', emoji: '🍰', pack: 'food', label: 'Cake' },
  { id: 'f4', emoji: '🍦', pack: 'food', label: 'Ice cream' },
  { id: 'f5', emoji: '🍓', pack: 'food', label: 'Strawberry' },
  { id: 'f6', emoji: '🍒', pack: 'food', label: 'Cherry' },
  { id: 'f7', emoji: '🍩', pack: 'food', label: 'Donut' },
  { id: 'f8', emoji: '🧁', pack: 'food', label: 'Cupcake' },

  // Sparkle
  { id: 'p1', emoji: '💎', pack: 'sparkle', label: 'Diamond' },
  { id: 'p2', emoji: '🦋', pack: 'sparkle', label: 'Butterfly' },
  { id: 'p3', emoji: '🎵', pack: 'sparkle', label: 'Music' },
  { id: 'p4', emoji: '💡', pack: 'sparkle', label: 'Light bulb' },
  { id: 'p5', emoji: '🪄', pack: 'sparkle', label: 'Magic wand' },
  { id: 'p6', emoji: '🫧', pack: 'sparkle', label: 'Bubbles' },
  { id: 'p7', emoji: '🌙', pack: 'sparkle', label: 'Moon' },
  { id: 'p8', emoji: '🌈', pack: 'sparkle', label: 'Rainbow' },
  { id: 'p9', emoji: '☁️', pack: 'sparkle', label: 'Cloud' },
  { id: 'p10', emoji: '☀️', pack: 'sparkle', label: 'Sun' },
];

export function getStripColor(id: string): StripColorOption {
  return STRIP_COLORS.find((c) => c.id === id) ?? STRIP_COLORS[0];
}

export function stripColorToStyle(color: StripColorOption) {
  return {
    bg: color.bg,
    border: color.border,
    text: color.text,
    accent: color.accent,
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
