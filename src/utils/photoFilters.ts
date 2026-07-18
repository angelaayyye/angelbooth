import type { PhotoFilterId } from '../types';

export interface PhotoFilter {
  id: PhotoFilterId;
  name: string;
  /** CSS filter string — used for live preview and canvas export. */
  css: string;
}

/** Classic booth filters — flash pop plus sepia, b&w, and glow. */
export const PHOTO_FILTERS: PhotoFilter[] = [
  {
    id: 'pop',
    name: 'flash pop',
    css: 'contrast(1.4) saturate(1.45) brightness(1.08)',
  },
  {
    id: 'sepia',
    name: 'sepia',
    css: 'sepia(0.9) contrast(1.05) brightness(0.98) saturate(0.85)',
  },
  {
    id: 'bw',
    name: 'black & white',
    css: 'grayscale(100%) contrast(1.15) brightness(1.04)',
  },
  {
    id: 'glow',
    name: 'glow',
    css: 'brightness(1.28) contrast(0.78) saturate(0.88)',
  },
];

export const DEFAULT_PHOTO_FILTER: PhotoFilterId = 'pop';

export function getPhotoFilterCss(id: PhotoFilterId): string {
  return PHOTO_FILTERS.find((f) => f.id === id)?.css ?? PHOTO_FILTERS[0].css;
}
