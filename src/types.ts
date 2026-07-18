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
  pack: StickerPackId;
  label: string;
}

export type StickerPackId =
  | 'main'
  | 'valentines'
  | 'cute'
  | 'vibes'
  | 'food'
  | 'sparkle'
  | 'bw';

export interface StickerPack {
  id: StickerPackId;
  name: string;
  /** Short preview shown on the pack picker tile. */
  preview: string;
}

export interface StripColorOption {
  id: string;
  name: string;
  bg: string;
  border: string;
  text: string;
  accent: string;
}

export type StripStyle = Pick<ThemeOption, 'bg' | 'border' | 'text' | 'accent'>;

export interface PlacedSticker {
  id: string;
  stickerId: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type PhotoFilterId =
  | 'original'
  | 'classic'
  | 'vintage'
  | 'pop'
  | 'soft'
  | 'matte'
  | 'noir'
  | 'cool';

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
