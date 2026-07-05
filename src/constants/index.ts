import type { LayoutOption, ThemeOption, StickerDef } from '../types';

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

export const STICKERS: StickerDef[] = [
  { id: 'h1', emoji: '❤️', category: 'hearts', label: 'Red heart' },
  { id: 'h2', emoji: '💕', category: 'hearts', label: 'Two hearts' },
  { id: 'h3', emoji: '💖', category: 'hearts', label: 'Sparkling heart' },
  { id: 'h4', emoji: '💗', category: 'hearts', label: 'Growing heart' },
  { id: 'h5', emoji: '💘', category: 'hearts', label: 'Heart arrow' },
  { id: 'h6', emoji: '💝', category: 'hearts', label: 'Heart box' },
  { id: 'h7', emoji: '🩷', category: 'hearts', label: 'Pink heart' },
  { id: 'h8', emoji: '💜', category: 'hearts', label: 'Purple heart' },

  { id: 'c1', emoji: '🐰', category: 'cute', label: 'Bunny' },
  { id: 'c2', emoji: '🐻', category: 'cute', label: 'Bear' },
  { id: 'c3', emoji: '🐱', category: 'cute', label: 'Cat' },
  { id: 'c4', emoji: '🐶', category: 'cute', label: 'Dog' },
  { id: 'c5', emoji: '🐼', category: 'cute', label: 'Panda' },
  { id: 'c6', emoji: '🦊', category: 'cute', label: 'Fox' },
  { id: 'c7', emoji: '🐸', category: 'cute', label: 'Frog' },
  { id: 'c8', emoji: '🐥', category: 'cute', label: 'Chick' },
  { id: 'c9', emoji: '🎀', category: 'cute', label: 'Ribbon' },
  { id: 'c10', emoji: '🌸', category: 'cute', label: 'Cherry blossom' },
  { id: 'c11', emoji: '🌷', category: 'cute', label: 'Tulip' },
  { id: 'c12', emoji: '🍀', category: 'cute', label: 'Clover' },

  { id: 's1', emoji: '⭐', category: 'stars', label: 'Star' },
  { id: 's2', emoji: '🌟', category: 'stars', label: 'Glowing star' },
  { id: 's3', emoji: '✨', category: 'stars', label: 'Sparkles' },
  { id: 's4', emoji: '💫', category: 'stars', label: 'Dizzy' },
  { id: 's5', emoji: '🌙', category: 'stars', label: 'Moon' },
  { id: 's6', emoji: '☁️', category: 'stars', label: 'Cloud' },
  { id: 's7', emoji: '🌈', category: 'stars', label: 'Rainbow' },
  { id: 's8', emoji: '☀️', category: 'stars', label: 'Sun' },

  { id: 't1', emoji: '💯', category: 'text', label: '100' },
  { id: 't2', emoji: '🔥', category: 'text', label: 'Fire' },
  { id: 't3', emoji: '👑', category: 'text', label: 'Crown' },
  { id: 't4', emoji: '💅', category: 'text', label: 'Nails' },
  { id: 't5', emoji: '😍', category: 'text', label: 'Heart eyes' },
  { id: 't6', emoji: '🥰', category: 'text', label: 'Smiling hearts' },
  { id: 't7', emoji: '😎', category: 'text', label: 'Cool' },
  { id: 't8', emoji: '🤍', category: 'text', label: 'White heart' },
  { id: 't9', emoji: '💋', category: 'text', label: 'Kiss' },
  { id: 't10', emoji: '🎉', category: 'text', label: 'Party' },

  { id: 'f1', emoji: '🧋', category: 'food', label: 'Bubble tea' },
  { id: 'f2', emoji: '🍡', category: 'food', label: 'Dango' },
  { id: 'f3', emoji: '🍰', category: 'food', label: 'Cake' },
  { id: 'f4', emoji: '🍦', category: 'food', label: 'Ice cream' },
  { id: 'f5', emoji: '🍓', category: 'food', label: 'Strawberry' },
  { id: 'f6', emoji: '🍒', category: 'food', label: 'Cherry' },
  { id: 'f7', emoji: '🍩', category: 'food', label: 'Donut' },
  { id: 'f8', emoji: '🧁', category: 'food', label: 'Cupcake' },

  { id: 'p1', emoji: '💎', category: 'sparkle', label: 'Diamond' },
  { id: 'p2', emoji: '🦋', category: 'sparkle', label: 'Butterfly' },
  { id: 'p3', emoji: '🎵', category: 'sparkle', label: 'Music' },
  { id: 'p4', emoji: '📸', category: 'sparkle', label: 'Camera' },
  { id: 'p5', emoji: '💡', category: 'sparkle', label: 'Light bulb' },
  { id: 'p6', emoji: '🎀', category: 'sparkle', label: 'Bow' },
  { id: 'p7', emoji: '🪄', category: 'sparkle', label: 'Magic wand' },
  { id: 'p8', emoji: '🫧', category: 'sparkle', label: 'Bubbles' },
];

export const STICKER_CATEGORIES = [
  { id: 'hearts' as const, label: 'Hearts' },
  { id: 'cute' as const, label: 'Cute' },
  { id: 'stars' as const, label: 'Stars' },
  { id: 'text' as const, label: 'Vibes' },
  { id: 'food' as const, label: 'Food' },
  { id: 'sparkle' as const, label: 'Sparkle' },
];

export const COUNTDOWN_SECONDS = 3;
export const PHOTO_GAP = 8;
export const STRIP_PADDING = 16;
export const STRIP_BORDER = 4;

export function getWsUrl(): string {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // In dev, route through Vite proxy so localhost and 127.0.0.1 both work
  if (import.meta.env.DEV) {
    return `${protocol}//${window.location.host}/ws`;
  }
  // Production: sync server must be hosted separately (e.g. Render)
  if (import.meta.env.VITE_SYNC_HOST) {
    return `${protocol}//${import.meta.env.VITE_SYNC_HOST}`;
  }
  return `${protocol}//${window.location.hostname}:3001`;
}
