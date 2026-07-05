export type AppStep =
  | 'welcome'
  | 'setup'
  | 'lobby'
  | 'capture'
  | 'decorate';

export type SessionMode = 'solo' | 'remote';

export type LayoutId =
  | 'strip-4'
  | 'strip-3'
  | 'strip-2'
  | 'grid-4'
  | 'grid-2'
  | 'single';

export interface LayoutOption {
  id: LayoutId;
  name: string;
  photoCount: number;
  cols: number;
  rows: number;
  aspectRatio: number;
  description: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  bg: string;
  border: string;
  accent: string;
  text: string;
}

export interface StickerDef {
  id: string;
  emoji: string;
  category: StickerCategory;
  label: string;
}

export type StickerCategory =
  | 'hearts'
  | 'cute'
  | 'stars'
  | 'text'
  | 'food'
  | 'sparkle';

export interface PlacedSticker {
  id: string;
  stickerId: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  playerId?: string;
  playerName?: string;
}

export interface RoomPlayer {
  id: string;
  name: string;
  connected: boolean;
}

export interface DuoCapturePart {
  playerId: string;
  name: string;
  dataUrl: string;
}

export interface RoomState {
  id: string;
  hostId: string;
  layoutId: string;
  themeId: string;
  phase: 'lobby' | 'capture' | 'done';
  players: RoomPlayer[];
  photos: ({ hasPhoto: boolean; isDuo?: boolean } | null)[];
  pendingCount?: number;
  currentPhotoIndex: number;
  countdown: number | null;
  countdownStartedAt: number | null;
}
