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
    <div className="sticker-panel">
      <h3 className="subsection-title">Stickers</h3>

      <div className="sticker-categories">
        {STICKER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-tab ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="sticker-grid">
        {filtered.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            className="sticker-btn"
            onClick={() => onAddSticker(sticker)}
            title={sticker.label}
          >
            {sticker.emoji}
          </button>
        ))}
      </div>

      <p className="sticker-hint">Tap a sticker to add it, then drag to position</p>
    </div>
  );
}
