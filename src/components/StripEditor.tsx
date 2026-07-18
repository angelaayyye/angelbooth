import { useState } from 'react';
import type {
  CapturedPhoto,
  LayoutOption,
  PhotoFilterId,
  PlacedSticker,
  StickerDef,
  StripStyle,
} from '../types';
import { PhotoStrip } from './PhotoStrip';
import { DecoratePanel } from './DecoratePanel';
import { KstyleNav } from './KstyleNav';
import { downloadStrip } from '../utils/canvas';
import { getStripColor, stripColorToStyle } from '../constants';
import { DEFAULT_PHOTO_FILTER } from '../utils/photoFilters';
import '../kstyle.css';

interface StripEditorProps {
  layout: LayoutOption;
  photos: CapturedPhoto[];
  onBack: () => void;
  onRestart: () => void;
}

export function StripEditor({
  layout,
  photos,
  onBack,
  onRestart,
}: StripEditorProps) {
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [photoFilter, setPhotoFilter] = useState<PhotoFilterId>(DEFAULT_PHOTO_FILTER);
  const [stripColorId, setStripColorId] = useState('white');

  const stripStyle: StripStyle = stripColorToStyle(getStripColor(stripColorId));

  const addSticker = (sticker: StickerDef) => {
    const newSticker: PlacedSticker = {
      id: crypto.randomUUID(),
      stickerId: sticker.id,
      emoji: sticker.emoji,
      x: 0.5 + (Math.random() - 0.5) * 0.2,
      y: 0.5 + (Math.random() - 0.5) * 0.2,
      scale: 1,
      rotation: (Math.random() - 0.5) * 30,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedId(newSticker.id);
  };

  const moveSticker = (id: string, x: number, y: number) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x, y } : s)),
    );
  };

  const updateSelected = (updates: Partial<PlacedSticker>) => {
    if (!selectedId) return;
    setStickers((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, ...updates } : s)),
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setStickers((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  const handleDownload = async () => {
    await downloadStrip(
      layout,
      photos,
      stripStyle,
      stickers,
      `photobooth-${Date.now()}.png`,
      photoFilter,
    );
  };

  const selected = stickers.find((s) => s.id === selectedId);

  return (
    <div className="kstyle-page kstyle-editor">
      <KstyleNav step="decorate" onBack={onBack} />

      <div className="kstyle-editor-body">
        <div className="kstyle-editor-stage">
          <div className="kstyle-editor-preview">
            <PhotoStrip
              layout={layout}
              photos={photos}
              stripStyle={stripStyle}
              stickers={stickers}
              photoFilter={photoFilter}
              interactive
              selectedStickerId={selectedId}
              onStickerSelect={setSelectedId}
              onStickerMove={moveSticker}
              className="photo-strip--editor"
              compact
            />

            {selected && (
              <div className="kstyle-sticker-controls">
                <label>
                  size
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={selected.scale}
                    onChange={(e) =>
                      updateSelected({ scale: parseFloat(e.target.value) })
                    }
                  />
                </label>
                <label>
                  rotate
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={selected.rotation}
                    onChange={(e) =>
                      updateSelected({ rotation: parseInt(e.target.value) })
                    }
                  />
                </label>
                <button
                  type="button"
                  className="kstyle-btn-danger"
                  onClick={deleteSelected}
                >
                  delete
                </button>
              </div>
            )}
          </div>

          <DecoratePanel
            stripColorId={stripColorId}
            onStripColorChange={setStripColorId}
            photoFilter={photoFilter}
            onFilterChange={setPhotoFilter}
            onAddSticker={addSticker}
          />
        </div>
      </div>

      <div className="kstyle-editor-footer">
        <button type="button" className="kstyle-btn-secondary" onClick={onRestart}>
          new session
        </button>
        <button type="button" className="kstyle-btn-primary" onClick={handleDownload}>
          save strip ↓
        </button>
      </div>
    </div>
  );
}
