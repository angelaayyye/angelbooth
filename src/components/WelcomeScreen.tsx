import '../kstyle.css';
import { KstyleNav } from './KstyleNav';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="kstyle-page">
      <KstyleNav />
      <section className="kstyle-hero">
        <div className="kstyle-hero-star">✦</div>
        <h1 className="kstyle-hero-title">
          capture your <em>angel</em> moment
        </h1>
        <p className="kstyle-hero-sub">
          K-style photo strips in your browser. Pick a frame, snap with friends or solo,
          decorate, and download — just like a real photobooth.
        </p>
        <button type="button" className="kstyle-btn-primary" onClick={onStart}>
          start booth
          <span aria-hidden>→</span>
        </button>
        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#aaa', letterSpacing: '0.05em' }}>
          free · no account · camera required
        </p>
      </section>
    </div>
  );
}
