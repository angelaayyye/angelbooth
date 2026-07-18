import { useState } from 'react';
import type { PhotoFilterId, StickerDef, StickerPackId } from '../types';
import {
  STRIP_COLORS,
  STICKERS,
  STICKER_PACKS,
} from '../constants';
import { PHOTO_FILTERS } from '../utils/photoFilters';

type DecorateTab = 'colours' | 'filters' | 'stickers';

interface DecoratePanelProps {
  stripColorId: string;
  onStripColorChange: (id: string) => void;
  photoFilter: PhotoFilterId;
  onFilterChange: (id: PhotoFilterId) => void;
  onAddSticker: (sticker: StickerDef) => void;
}

const TABS: { id: DecorateTab; label: string }[] = [
  { id: 'colours', label: 'colours' },
  { id: 'filters', label: 'filters' },
  { id: 'stickers', label: 'stickers' },
];

export function DecoratePanel({
  stripColorId,
  onStripColorChange,
  photoFilter,
  onFilterChange,
  onAddSticker,
}: DecoratePanelProps) {
  const [tab, setTab] = useState<DecorateTab>('colours');
  const [stickerPack, setStickerPack] = useState<StickerPackId>('main');

  const packStickers = STICKERS.filter((s) => s.pack === stickerPack);

  return (
    <div className="kstyle-decorate-panel">
      <div className="kstyle-decorate-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="kstyle-decorate-content">
        {tab === 'colours' && (
          <div className="kstyle-colour-grid">
            {STRIP_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                className={stripColorId === color.id ? 'active' : ''}
                onClick={() => onStripColorChange(color.id)}
                title={color.name}
                style={{ background: color.bg }}
                aria-label={color.name}
              />
            ))}
          </div>
        )}

        {tab === 'filters' && (
          <div className="kstyle-filter-grid">
            {PHOTO_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={photoFilter === filter.id ? 'active' : ''}
                onClick={() => onFilterChange(filter.id)}
                title={filter.name}
              >
                <span
                  className="kstyle-filter-swatch"
                  style={{ filter: filter.css }}
                  aria-hidden
                />
                <span className="kstyle-filter-name">{filter.name}</span>
              </button>
            ))}
          </div>
        )}

        {tab === 'stickers' && (
          <>
            <div className="kstyle-pack-picker">
              {STICKER_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  className={`kstyle-pack-tile ${stickerPack === pack.id ? 'active' : ''}`}
                  onClick={() => setStickerPack(pack.id)}
                >
                  <span className="kstyle-pack-preview">{pack.preview}</span>
                  <span className="kstyle-pack-name">{pack.name}</span>
                </button>
              ))}
            </div>
            <div className="kstyle-sticker-grid">
              {packStickers.map((sticker) => (
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
          </>
        )}
      </div>
    </div>
  );
}
