import type {
  CapturedPhoto,
  LayoutOption,
  PlacedSticker,
  PhotoFilterId,
  StripStyle,
} from '../types';
import {
  PHOTO_GAP,
  STRIP_BORDER,
  STRIP_PADDING,
} from '../constants';
import { DEFAULT_PHOTO_FILTER, getPhotoFilterCss } from './photoFilters';

const EXPORT_WIDTH = 600;

export function computeStripDimensions(layout: LayoutOption) {
  const innerWidth = EXPORT_WIDTH - STRIP_PADDING * 2 - STRIP_BORDER * 2;
  const cellWidth =
    (innerWidth - PHOTO_GAP * (layout.cols - 1)) / layout.cols;
  const cellHeight = cellWidth / layout.aspectRatio;

  const innerHeight =
    cellHeight * layout.rows + PHOTO_GAP * (layout.rows - 1);

  const totalHeight =
    innerHeight + STRIP_PADDING * 2 + STRIP_BORDER * 2 + 40;

  return { cellWidth, cellHeight, innerWidth, innerHeight, totalHeight };
}

export async function renderStripToCanvas(
  layout: LayoutOption,
  photos: CapturedPhoto[],
  stripStyle: StripStyle,
  stickers: PlacedSticker[],
  title?: string,
  photoFilter: PhotoFilterId = DEFAULT_PHOTO_FILTER,
): Promise<HTMLCanvasElement> {
  const filterCss = getPhotoFilterCss(photoFilter);
  const { cellWidth, cellHeight, innerWidth, totalHeight } =
    computeStripDimensions(layout);

  const canvas = document.createElement('canvas');
  canvas.width = EXPORT_WIDTH;
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Background
  ctx.fillStyle = stripStyle.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border frame
  ctx.strokeStyle = stripStyle.border;
  ctx.lineWidth = STRIP_BORDER;
  ctx.strokeRect(
    STRIP_BORDER / 2,
    STRIP_BORDER / 2,
    canvas.width - STRIP_BORDER,
    canvas.height - STRIP_BORDER,
  );

  const startX = STRIP_PADDING + STRIP_BORDER;
  const startY = STRIP_PADDING + STRIP_BORDER;

  // Draw photos
  for (let i = 0; i < layout.photoCount; i++) {
    const col = i % layout.cols;
    const row = Math.floor(i / layout.cols);

    const x = startX + col * (cellWidth + PHOTO_GAP);
    const y = startY + row * (cellHeight + PHOTO_GAP);

    ctx.fillStyle = '#ddd';
    ctx.fillRect(x, y, cellWidth, cellHeight);

    const photo = photos[i];
    if (photo) {
      const img = await loadImage(photo.dataUrl);
      drawCoverImage(ctx, img, x, y, cellWidth, cellHeight, filterCss);
    } else {
      ctx.fillStyle = '#ccc';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📷', x + cellWidth / 2, y + cellHeight / 2 + 8);
    }
  }

  // Title footer
  const footerY = startY + layout.rows * (cellHeight + PHOTO_GAP) - PHOTO_GAP + 12;
  ctx.fillStyle = stripStyle.text;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title || 'Photobooth', EXPORT_WIDTH / 2, footerY + 16);

  ctx.font = '11px sans-serif';
  ctx.fillStyle = stripStyle.accent;
  const dateStr = new Date().toLocaleDateString('en-US');
  ctx.fillText(dateStr, EXPORT_WIDTH / 2, footerY + 32);

  // Draw stickers (positions are 0-1 relative to strip area)
  const stripAreaTop = startY;
  const stripAreaHeight =
    layout.rows * (cellHeight + PHOTO_GAP) - PHOTO_GAP;

  for (const sticker of stickers) {
    const sx = startX + sticker.x * innerWidth;
    const sy = stripAreaTop + sticker.y * stripAreaHeight;
    const fontSize = 48 * sticker.scale;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.emoji, 0, 0);
    ctx.restore();
  }

  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  filterCss = 'none',
) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;

  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.save();
  ctx.filter = filterCss;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

export async function downloadStrip(
  layout: LayoutOption,
  photos: CapturedPhoto[],
  stripStyle: StripStyle,
  stickers: PlacedSticker[],
  filename = 'photobooth-strip.png',
  photoFilter: PhotoFilterId = DEFAULT_PHOTO_FILTER,
) {
  const canvas = await renderStripToCanvas(
    layout,
    photos,
    stripStyle,
    stickers,
    undefined,
    photoFilter,
  );
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
