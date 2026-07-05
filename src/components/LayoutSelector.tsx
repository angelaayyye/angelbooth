import type { LayoutOption } from '../types';
import { LAYOUTS } from '../constants';

interface LayoutSelectorProps {
  selected: LayoutOption;
  onSelect: (layout: LayoutOption) => void;
}

function MiniPreview({ layout }: { layout: LayoutOption }) {
  const cells = Array.from({ length: layout.photoCount });
  return (
    <div
      className="mini-preview"
      style={{
        gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
        gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
      }}
    >
      {cells.map((_, i) => (
        <div key={i} className="mini-preview-cell" />
      ))}
    </div>
  );
}

export function LayoutSelector({ selected, onSelect }: LayoutSelectorProps) {
  return (
    <div className="layout-selector">
      <h2 className="section-title">Pick Your Frame</h2>
      <p className="section-desc">Choose how many photos and how they are arranged.</p>
      <div className="layout-grid">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            type="button"
            className={`layout-card ${selected.id === layout.id ? 'active' : ''}`}
            onClick={() => onSelect(layout)}
          >
            <MiniPreview layout={layout} />
            <div className="layout-info">
              <span className="layout-name">{layout.name}</span>
              <span className="layout-desc">{layout.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
