import type { StripPattern } from '../types';

const DOT_COLORS: Record<Exclude<StripPattern, 'solid'>, string> = {
  'dots-pink': 'rgba(255, 143, 184, 0.55)',
  'dots-red': 'rgba(229, 57, 53, 0.45)',
  'dots-blue': 'rgba(129, 212, 250, 0.65)',
  'dots-cream': 'rgba(212, 165, 116, 0.4)',
  'dots-white': 'rgba(255, 255, 255, 0.75)',
};

export function getStripPatternCss(pattern?: StripPattern): string {
  if (!pattern || pattern === 'solid') return 'none';
  const color = DOT_COLORS[pattern];
  return `radial-gradient(circle, ${color} 1.4px, transparent 1.6px)`;
}

export function getStripPatternSize(pattern?: StripPattern): string {
  if (!pattern || pattern === 'solid') return 'auto';
  return '14px 14px';
}

export function drawStripPattern(
  ctx: CanvasRenderingContext2D,
  pattern: StripPattern | undefined,
  width: number,
  height: number,
) {
  if (!pattern || pattern === 'solid') return;
  const color = DOT_COLORS[pattern];
  const step = 14;
  const radius = 1.4;
  ctx.fillStyle = color;
  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
