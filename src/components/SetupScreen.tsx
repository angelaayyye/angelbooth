import type { LayoutId, LayoutOption, SessionMode, ThemeOption } from '../types';
import { LAYOUTS, THEMES } from '../constants';
import '../kstyle.css';
import { KstyleNav } from './KstyleNav';

interface SetupScreenProps {
  selectedLayout: LayoutOption;
  selectedTheme: ThemeOption;
  sessionMode: SessionMode | null;
  onLayoutSelect: (layout: LayoutOption) => void;
  onThemeSelect: (theme: ThemeOption) => void;
  onSessionModeChange: (mode: SessionMode) => void;
  onEnter: () => void;
  onBack: () => void;
}

function FramePreview({ layoutId, count }: { layoutId: LayoutId; count: number }) {
  const slots = Array.from({ length: count });
  const isGrid = layoutId.startsWith('grid');

  return (
    <div
      className="mx-auto w-14 h-16 bg-pink-50 rounded-lg p-1.5 flex flex-col gap-0.5"
      style={isGrid ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 } : undefined}
    >
      {slots.map((_, i) => (
        <div key={i} className="flex-1 bg-pink-300/80 rounded-sm min-h-[6px]" />
      ))}
    </div>
  );
}

export function SetupScreen({
  selectedLayout,
  selectedTheme,
  sessionMode,
  onLayoutSelect,
  onThemeSelect,
  onSessionModeChange,
  onEnter,
  onBack,
}: SetupScreenProps) {
  return (
    <div className="kstyle-page">
      <KstyleNav onBack={onBack} step="setup" />
      <main className="kstyle-main">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
          pick your vibe
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>
          choose a frame, theme, and how you want to shoot
        </p>

        <div className="kstyle-setup-grid">
          <div className="flex flex-col gap-8">
            <section>
              <p className="kstyle-section-label">how to shoot</p>
              <div className="kstyle-mode-row">
                <button
                  type="button"
                  className={`kstyle-btn-secondary ${sessionMode === 'solo' ? 'active' : ''}`}
                  onClick={() => onSessionModeChange('solo')}
                >
                  🤳 solo
                </button>
                <button
                  type="button"
                  className={`kstyle-btn-secondary ${sessionMode === 'remote' ? 'active' : ''}`}
                  onClick={() => onSessionModeChange('remote')}
                >
                  👯 with a friend
                </button>
              </div>
            </section>

            <section>
              <p className="kstyle-section-label">frame</p>
              <div className="kstyle-frame-grid">
                {LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    type="button"
                    className={`kstyle-frame-card ${selectedLayout.id === layout.id ? 'selected' : ''}`}
                    onClick={() => onLayoutSelect(layout)}
                  >
                    <FramePreview layoutId={layout.id} count={layout.photoCount} />
                    <p style={{ fontWeight: 700, fontSize: '0.8rem', marginTop: '0.5rem' }}>{layout.name}</p>
                    <p style={{ fontSize: '0.65rem', color: '#999' }}>{layout.photoCount} photos</p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <p className="kstyle-section-label">theme</p>
              <div className="kstyle-theme-row">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    className={`kstyle-theme-swatch ${selectedTheme.id === theme.id ? 'selected' : ''}`}
                    style={{
                      background: theme.bg,
                      borderColor: selectedTheme.id === theme.id ? '#1a1a1a' : theme.border,
                    }}
                    onClick={() => onThemeSelect(theme)}
                    title={theme.name}
                  />
                ))}
              </div>
            </section>

            <button
              type="button"
              className="kstyle-btn-primary"
              onClick={onEnter}
              disabled={!sessionMode}
              style={{ alignSelf: 'flex-start' }}
            >
              enter booth →
            </button>
          </div>

          <aside className="kstyle-card kstyle-strip-mock hidden md:flex" style={{ background: selectedTheme.bg, borderColor: selectedTheme.border, borderWidth: 3, borderStyle: 'solid' }}>
            <p className="kstyle-section-label" style={{ color: selectedTheme.text, opacity: 0.6 }}>preview</p>
            {Array.from({ length: selectedLayout.photoCount }).map((_, i) => (
              <div key={i} className="kstyle-strip-slot" style={{ borderColor: selectedTheme.border }} />
            ))}
            <p style={{ fontSize: '0.65rem', textAlign: 'center', marginTop: 'auto', color: selectedTheme.text, opacity: 0.5 }}>
              {selectedLayout.name}
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
