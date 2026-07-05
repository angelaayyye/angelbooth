import type { SessionMode } from '../types';

interface SessionModePickerProps {
  mode: SessionMode;
  onModeChange: (mode: SessionMode) => void;
}

export function SessionModePicker({ mode, onModeChange }: SessionModePickerProps) {
  return (
    <div className="session-mode-picker">
      <h3 className="subsection-title">How do you want to shoot?</h3>
      <div className="mode-options">
        <button
          type="button"
          className={`mode-card ${mode === 'solo' ? 'active' : ''}`}
          onClick={() => onModeChange('solo')}
        >
          <span className="mode-icon">🤳</span>
          <span className="mode-name">Solo</span>
          <span className="mode-desc">Take photos on this device</span>
        </button>
        <button
          type="button"
          className={`mode-card ${mode === 'remote' ? 'active' : ''}`}
          onClick={() => onModeChange('remote')}
        >
          <span className="mode-icon">👯</span>
          <span className="mode-name">Remote Duo</span>
          <span className="mode-desc">
            Two devices, different locations, synced countdown
          </span>
        </button>
      </div>
    </div>
  );
}
