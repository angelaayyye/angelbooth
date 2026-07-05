import { useState } from 'react';
import type {
  CapturedPhoto,
  LayoutOption,
  PlacedSticker,
  StickerDef,
  ThemeOption,
} from '../types';
import { PhotoStrip } from './PhotoStrip';
import { StickerPanel } from './StickerPanel';
import { downloadStrip } from '../utils/canvas';

interface StripEditorProps {
  layout: LayoutOption;
  photos: CapturedPhoto[];
  theme: ThemeOption;
  onBack: () => void;
  onRestart: () => void;
}

export function StripEditor({
  layout,
  photos,
  theme,
  onBack,
  onRestart,
}: StripEditorProps) {
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      theme,
      stickers,
      `photobooth-${Date.now()}.png`,
    );
  };

  const selected = stickers.find((s) => s.id === selectedId);

  return (
    <div className="strip-editor">
      <div className="editor-header">
        <button type="button" className="btn-ghost" onClick={onBack}>
          ← Retake
        </button>
        <h2 className="section-title compact">Decorate</h2>
        <button type="button" className="btn-ghost" onClick={onRestart}>
          New ↻
        </button>
      </div>

      <div className="editor-body">
        <div className="editor-preview">
          <PhotoStrip
            layout={layout}
            photos={photos}
            theme={theme}
            stickers={stickers}
            interactive
            selectedStickerId={selectedId}
            onStickerSelect={setSelectedId}
            onStickerMove={moveSticker}
          />

          {selected && (
            <div className="sticker-controls">
              <label>
                Size
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
                Rotate
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
                className="btn-danger-sm"
                onClick={deleteSelected}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <StickerPanel onAddSticker={addSticker} />
      </div>

      <div className="editor-footer">
        <button type="button" className="btn-primary btn-large" onClick={handleDownload}>
          Save Photo Strip
        </button>
      </div>
    </div>
  );
}
