import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      <div className="splash">
        <svg
          style={{
            width: 56, height: 56,
            color: 'var(--accent)',
            animation: 'spokes-spin 1s linear infinite',
            filter: 'drop-shadow(0 0 12px var(--accent))',
          }}
          viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`@keyframes spokes-spin { to { transform: rotate(360deg); } }`}</style>
          <path
            d="M12 2V6M16.2 7.8L19.1 4.9M18 12H22M16.2 16.2L19.1 19.1M12 18V22M4.9 19.1L7.8 16.2M2 12H6M4.9 4.9L7.8 7.8"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{
            fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px',
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            DealHunt
          </span>
          <span style={{
            fontSize: '0.8rem', color: 'var(--text-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500,
          }}>
            Hunt Smarter. Save Better.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent)', opacity: 0.3,
                animation: `dot-blink 1.2s ${delay}s infinite`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes dot-blink {
            0%, 80%, 100% { opacity: 0.3; }
            40% { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
