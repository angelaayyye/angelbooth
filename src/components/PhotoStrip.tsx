import type { LayoutOption, ThemeOption, CapturedPhoto, PlacedSticker } from '../types';
import { PHOTO_GAP, STRIP_PADDING, STRIP_BORDER } from '../constants';

interface PhotoStripProps {
  layout: LayoutOption;
  photos: (CapturedPhoto | undefined)[];
  theme: ThemeOption;
  stickers?: PlacedSticker[];
  interactive?: boolean;
  selectedStickerId?: string | null;
  onStickerSelect?: (id: string | null) => void;
  onStickerMove?: (id: string, x: number, y: number) => void;
  highlightSlot?: number | null;
  slotLabels?: (string | null)[];
  className?: string;
}

export function PhotoStrip({
  layout,
  photos,
  theme,
  stickers = [],
  interactive = false,
  selectedStickerId,
  onStickerSelect,
  onStickerMove,
  highlightSlot = null,
  slotLabels = [],
  className = '',
}: PhotoStripProps) {
  const handleStickerPointerDown = (
    e: React.PointerEvent,
    stickerId: string,
  ) => {
    if (!interactive || !onStickerMove) return;
    e.stopPropagation();
    e.preventDefault();
    onStickerSelect?.(stickerId);

    const overlay = (e.currentTarget as HTMLElement).closest('.sticker-overlay');
    if (!overlay) return;

    const rect = overlay.getBoundingClientRect();

    const onMove = (ev: PointerEvent) => {
      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
      onStickerMove(stickerId, x, y);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      className={`photo-strip ${className}`}
      style={{
        background: theme.bg,
        border: `${STRIP_BORDER}px solid ${theme.border}`,
      }}
      onClick={() => interactive && onStickerSelect?.(null)}
    >
      <div
        className="photo-grid"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
          gap: `${PHOTO_GAP}px`,
          padding: `${STRIP_PADDING}px`,
        }}
      >
        {Array.from({ length: layout.photoCount }).map((_, i) => (
          <div
            key={i}
            className={`photo-cell ${highlightSlot === i ? 'highlight' : ''}`}
            style={{ aspectRatio: `${layout.aspectRatio}` }}
          >
            {photos[i] ? (
              <img src={photos[i].dataUrl} alt={`Photo ${i + 1}`} />
            ) : (
              <div className="photo-placeholder">
                {slotLabels[i] ? (
                  <span className="slot-label">{slotLabels[i]}</span>
                ) : (
                  '📷'
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sticker-overlay">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className={`placed-sticker ${selectedStickerId === sticker.id ? 'selected' : ''}`}
            style={{
              left: `${sticker.x * 100}%`,
              top: `${sticker.y * 100}%`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
              pointerEvents: interactive ? 'auto' : 'none',
            }}
            onPointerDown={(e) => handleStickerPointerDown(e, sticker.id)}
            onClick={(e) => e.stopPropagation()}
          >
            {sticker.emoji}
          </div>
        ))}
      </div>

      <div className="strip-footer" style={{ color: theme.text }}>
        <div className="strip-footer-title">Photobooth</div>
        <div className="strip-footer-date" style={{ color: theme.accent }}>
          {new Date().toLocaleDateString('en-US')}
        </div>
      </div>
    </div>
  );
}
