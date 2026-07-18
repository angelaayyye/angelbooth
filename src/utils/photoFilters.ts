import type { PhotoFilterId } from '../types';

export interface PhotoFilter {
  id: PhotoFilterId;
  name: string;
  /** CSS filter string — used for live preview and canvas export. */
  css: string;
}

/** Photobooth-style looks inspired by classic booth prints and flash photography. */
export const PHOTO_FILTERS: PhotoFilter[] = [
  { id: 'original', name: 'natural', css: 'none' },
  {
    id: 'classic',
    name: 'classic b&w',
    css: 'grayscale(100%) contrast(1.35) brightness(1.06)',
  },
  {
    id: 'vintage',
    name: 'vintage',
    css: 'sepia(0.55) contrast(1.12) brightness(0.96) saturate(0.75)',
  },
  {
    id: 'pop',
    name: 'flash pop',
    css: 'contrast(1.4) saturate(1.45) brightness(1.08)',
  },
  {
    id: 'soft',
    name: 'soft glow',
    css: 'brightness(1.14) contrast(0.86) saturate(0.82)',
  },
  {
    id: 'matte',
    name: 'matte fade',
    css: 'contrast(0.92) brightness(1.1) saturate(0.65) sepia(0.12)',
  },
  {
    id: 'noir',
    name: 'noir',
    css: 'grayscale(100%) contrast(1.65) brightness(0.88)',
  },
  {
    id: 'cool',
    name: 'cool tint',
    css: 'hue-rotate(195deg) saturate(0.85) contrast(1.15) brightness(1.04)',
  },
];

export const DEFAULT_PHOTO_FILTER: PhotoFilterId = 'original';

export function getPhotoFilterCss(id: PhotoFilterId): string {
  return PHOTO_FILTERS.find((f) => f.id === id)?.css ?? 'none';
}
