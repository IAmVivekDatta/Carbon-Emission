import React from 'react';

/**
 * Navbar with logo, current view options, and active habit logging streak display.
 */
export default function Navbar({ currentView, setView, streak = 0, onReset }) {
  return (
    <header 
      style={{
        borderBottom: '1px solid var(--border-gold)',
        background: 'rgba(250, 247, 240, 0.85)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 0',
        transition: 'var(--transition-smooth)'
      }}
    >
      <div 
        className="container" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        {/* Brand Logo */}
        <button 
          onClick={() => setView('landing')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: 0
          }}
          aria-label="Verdant Pulse Home"
        >
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
              fill="var(--green-primary)"
              style={{ display: 'none' }} // fallback placeholder
            />
            {/* Elegant Custom Leaf SVG */}
            <path 
              d="M2 22C6 18 12 18 17 13C22 8 21 3 21 3C21 3 16 2 11 7C6 12 6 18 2 22Z" 
              fill="var(--green-primary)" 
            />
            <path 
              d="M11 7C8 10 7 14 2 22" 
              stroke="var(--gold-primary)" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
          <span 
            style={{ 
              fontFamily: 'Lora, serif', 
              fontSize: '1.4rem', 
              fontWeight: 600, 
              color: 'var(--green-primary)',
              letterSpacing: '-0.3px'
            }}
          >
            Verdant Pulse
          </span>
        </button>

        {/* Navigation Actions */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {streak > 0 && (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: 'var(--green-soft)', 
                padding: '6px 14px', 
                borderRadius: '20px',
                border: '1px solid rgba(17, 51, 34, 0.05)',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'var(--green-medium)'
              }}
              title="Daily eco-habit logging streak"
            >
              <span role="img" aria-label="streak fire">🔥</span>
              <span>{streak} Day Streak</span>
            </div>
          )}

          {currentView === 'dashboard' && (
            <button 
              className="btn btn-secondary"
              onClick={onReset}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Reset Data
            </button>
          )}

          {currentView === 'landing' && (
            <button 
              className="btn btn-primary"
              onClick={() => setView('quiz')}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Take Quiz
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
