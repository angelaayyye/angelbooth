import type { ThemeOption } from '../types';
import { THEMES } from '../constants';

interface ThemeSelectorProps {
  selected: ThemeOption;
  onSelect: (theme: ThemeOption) => void;
}

export function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  return (
    <div className="theme-selector">
      <h3 className="subsection-title">Choose a Theme</h3>
      <p className="section-desc">Pick a color scheme for your photo strip frame.</p>
      <div className="theme-grid">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`theme-card ${selected.id === theme.id ? 'active' : ''}`}
            onClick={() => onSelect(theme)}
            aria-pressed={selected.id === theme.id}
          >
            <div
              className="theme-preview"
              style={{
                background: theme.bg,
                borderColor: theme.border,
              }}
            >
              <div
                className="theme-preview-inner"
                style={{ background: theme.accent }}
              />
            </div>
            <span className="theme-label" style={{ color: theme.text }}>
              {theme.name}
            </span>
            {selected.id === theme.id && (
              <span className="theme-selected-badge">Selected</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
