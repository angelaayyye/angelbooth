import { useState } from 'react';
import type { StickerCategory, StickerDef } from '../types';
import { STICKERS, STICKER_CATEGORIES } from '../constants';

interface StickerPanelProps {
  onAddSticker: (sticker: StickerDef) => void;
}

export function StickerPanel({ onAddSticker }: StickerPanelProps) {
  const [category, setCategory] = useState<StickerCategory>('hearts');

  const filtered = STICKERS.filter((s) => s.category === category);

  return (
    <div className="kstyle-sticker-panel">
      <h3>stickers</h3>

      <div className="kstyle-sticker-categories">
        {STICKER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={category === cat.id ? 'active' : ''}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="kstyle-sticker-grid">
        {filtered.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => onAddSticker(sticker)}
            title={sticker.label}
          >
            {sticker.emoji}
          </button>
        ))}
      </div>

      <p className="kstyle-sticker-hint">tap to add, drag to move</p>
    </div>
  );
}
