interface KstyleNavProps {
  onBack?: () => void;
  step?: string;
  dark?: boolean;
}

export function KstyleNav({ onBack, step, dark }: KstyleNavProps) {
  return (
    <header className={`kstyle-nav ${dark ? 'dark' : ''}`} style={dark ? { background: 'rgba(15,15,15,0.9)', borderColor: 'rgba(255,255,255,0.08)' } : undefined}>
      <div className="kstyle-nav-inner">
        {onBack ? (
          <button type="button" className="kstyle-nav-back" onClick={onBack} style={dark ? { color: 'rgba(255,255,255,0.7)' } : undefined}>
            ← back
          </button>
        ) : (
          <div style={{ width: 60 }} />
        )}
        <span className="kstyle-logo" style={dark ? { color: 'white' } : undefined}>
          angelbooth
        </span>
        {step ? (
          <span className="kstyle-nav-step">{step}</span>
        ) : (
          <div className="kstyle-nav-links hidden sm:flex">
            <span>capture</span>
            <span>duo</span>
          </div>
        )}
      </div>
    </header>
  );
}
