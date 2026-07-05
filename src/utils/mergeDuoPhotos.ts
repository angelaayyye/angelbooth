import type { DuoCapturePart } from '../types';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
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

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/** Merge two portraits side-by-side into one 3:4 photo slot. */
export async function mergeDuoPhotos(parts: DuoCapturePart[]): Promise<string> {
  if (parts.length < 2) {
    return parts[0]?.dataUrl ?? '';
  }

  const width = 900;
  const height = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas');

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, width, height);

  const halfW = width / 2;
  const [left, right] = await Promise.all([
    loadImage(parts[0].dataUrl),
    loadImage(parts[1].dataUrl),
  ]);

  drawCover(ctx, left, 0, 0, halfW, height);
  drawCover(ctx, right, halfW, 0, halfW, height);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(halfW - 2, 0, 4, height);

  return canvas.toDataURL('image/jpeg', 0.92);
}

export async function mergeAllDuoSlots(
  slots: (DuoCapturePart[] | null)[],
): Promise<(string | null)[]> {
  return Promise.all(
    slots.map(async (parts) => {
      if (!parts || parts.length === 0) return null;
      if (parts.length === 1) return parts[0].dataUrl;
      return mergeDuoPhotos(parts);
    }),
  );
}
