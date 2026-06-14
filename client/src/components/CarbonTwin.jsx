import React, { useMemo } from 'react';

/**
 * CarbonTwin - A visual nature ecosystem reflecting the user's carbon score.
 * Wrapped in React.memo to prevent expensive SVG redraws unless emissions value changes.
 * Uses useMemo to derive visual parameters only when state changes.
 *
 * Emission states:
 * - Low  (≤ 350 kg/mo): Vibrant green landscape, clean sky, flowing river, birds, bright sun.
 * - Medium (351–700 kg/mo): Hazy warm sky, fewer trees, calmer river, fewer birds, dim sun.
 * - High (> 700 kg/mo): Grey sky, bare dry trees, murky stagnant river, no birds, obscured sun.
 *
 * @component
 * @param {Object} props
 * @param {number} [props.emissions=400] - Monthly CO2e emissions in kg
 * @returns {React.ReactElement}
 */
function CarbonTwin({ emissions = 400 }) {
  // Derive state threshold — only recalculate when emissions changes
  const state = useMemo(() => {
    if (emissions <= 350) return 'low';
    if (emissions <= 700) return 'medium';
    return 'high';
  }, [emissions]);

  // Define visual parameters based on state — memoised to prevent object allocation on every render
  const { currentSky, currentRiver } = useMemo(() => {
    const skyGradients = {
      low:    { start: '#D0EBFD', end: '#A2D2FF', sun: '#F9D030' },
      medium: { start: '#FDF7E7', end: '#E3D7B5', sun: '#E8CA65' },
      high:   { start: '#EAE8E4', end: '#CAC6BF', sun: '#B8B3A8' }
    };
    const riverColors = {
      low:    { fill: '#3A86C8', ripple: '#60A5FA' },
      medium: { fill: '#5C7E8D', ripple: '#8DA9C4' },
      high:   { fill: '#7C817D', ripple: '#9BA19D' }
    };
    return {
      currentSky: skyGradients[state],
      currentRiver: riverColors[state]
    };
  }, [state]);

  // Memoize the state badge label
  const stateBadge = useMemo(() => {
    if (state === 'low') return { label: '🌿 Vibrant & Balanced', bg: '#EBFDF2', color: '#128C4A' };
    if (state === 'medium') return { label: '⛅ Moderate Load', bg: '#FEF9EC', color: '#B07D10' };
    return { label: '⚠️ Heavy Burden', bg: '#FDF2F2', color: '#9B1C1C' };
  }, [state]);

  return (
    <div 
      style={{ 
        width: '100%', 
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-gold)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--bg-card)',
        padding: '20px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--green-primary)' }}>Your Carbon Twin</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            A real-time reflection of your lifestyle's ecological balance.
          </p>
        </div>
        
        <span 
          style={{ 
            fontSize: '0.75rem', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            padding: '4px 10px', 
            borderRadius: '20px',
            backgroundColor: stateBadge.bg,
            color: stateBadge.color,
            border: '1px solid currentColor'
          }}
        >
          {stateBadge.label}
        </span>
      </div>

      {/* SVG Canvas */}
      <svg 
        viewBox="0 0 500 220" 
        style={{ 
          width: '100%', 
          height: 'auto', 
          borderRadius: '8px', 
          backgroundColor: currentSky.start,
          transition: 'background-color 0.8s ease'
        }}
        aria-label={`Carbon Twin showing a ${state} emission landscape`}
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={currentSky.start} />
            <stop offset="100%" stopColor={currentSky.end} />
          </linearGradient>
          
          <linearGradient id="hillsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={state === 'low' ? '#8FBC8F' : state === 'medium' ? '#C2B895' : '#9F9A93'} />
            <stop offset="100%" stopColor={state === 'low' ? '#2E8B57' : state === 'medium' ? '#7A6F4D' : '#635E57'} />
          </linearGradient>

          {/* Shimmer animations */}
          <style>
            {`
              @keyframes floatBird {
                0% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(-4px) translateX(10px); }
                100% { transform: translateY(0px) translateX(0px); }
              }
              @keyframes wave {
                0% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: -20; }
              }
              .bird-1 { animation: floatBird 4s ease-in-out infinite; }
              .bird-2 { animation: floatBird 5s ease-in-out infinite 1.5s; }
              .wave-ripple { animation: wave 3s linear infinite; stroke-dasharray: 8 6; }
            `}
          </style>
        </defs>

        {/* Sky Background */}
        <rect width="500" height="220" fill="url(#skyGrad)" style={{ transition: 'fill 0.8s ease' }} />

        {/* Sun */}
        <circle 
          cx="420" 
          cy="50" 
          r={state === 'low' ? '24' : state === 'medium' ? '20' : '16'} 
          fill={currentSky.sun} 
          opacity={state === 'high' ? '0.4' : '0.9'}
          style={{ transition: 'r 0.8s, fill 0.8s, opacity 0.8s' }} 
        />
        {state === 'low' && (
          <circle cx="420" cy="50" r="32" fill="#F9D030" opacity="0.18" />
        )}

        {/* Clouds / Haze */}
        {state === 'medium' && (
          <path d="M50 40 Q80 30 110 40 T170 40 Q200 45 220 55 T280 50 L280 70 L50 70 Z" fill="#FFFFFF" opacity="0.4" />
        )}
        {state === 'high' && (
          <rect width="500" height="80" fill="#888888" opacity="0.15" />
        )}

        {/* Birds in flight */}
        {state === 'low' && (
          <g fill="none" stroke="var(--green-medium)" strokeWidth="1.5" strokeLinecap="round">
            <path className="bird-1" d="M120 45 Q125 40 130 45 Q135 40 140 45" />
            <path className="bird-2" d="M160 30 Q164 26 168 30 Q172 26 176 30" />
            <path className="bird-1" d="M80 35 Q83 31 86 35 Q89 31 92 35" />
          </g>
        )}
        {state === 'medium' && (
          <g fill="none" stroke="#7A6F4D" strokeWidth="1" strokeLinecap="round">
            <path className="bird-2" d="M150 40 Q153 37 156 40 Q159 37 162 40" />
          </g>
        )}

        {/* Background Hills */}
        <path d="M-50 170 Q100 110 250 160 T550 150 L550 220 L-50 220 Z" fill="url(#hillsGrad)" style={{ transition: 'fill 0.8s ease' }} />
        
        {/* River */}
        <path 
          d="M180 155 Q200 170 210 185 T230 220 L275 220 Q250 185 240 170 T200 155 Z" 
          fill={currentRiver.fill} 
          style={{ transition: 'fill 0.8s ease' }} 
        />
        <path 
          d="M192 162 Q210 176 220 190 T240 220" 
          fill="none" 
          stroke={currentRiver.ripple} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          className="wave-ripple" 
        />

        {/* Tree Renderings */}
        {state === 'low' && (
          <g>
            <rect x="50" y="130" width="6" height="30" fill="#5C4033" />
            <path d="M30 135 L53 95 L76 135 Z" fill="#228B22" />
            <path d="M35 115 L53 80 L71 115 Z" fill="#2E8B57" />
            <path d="M40 95 L53 65 L66 95 Z" fill="#3CB371" />

            <rect x="110" y="145" width="4" height="20" fill="#5C4033" />
            <path d="M95 148 L112 120 L129 148 Z" fill="#1C4D35" />
            <path d="M100 132 L112 110 L124 132 Z" fill="#2A6C4A" />

            <rect x="330" y="135" width="6" height="30" fill="#5C4033" />
            <path d="M305 140 L333 100 L361 140 Z" fill="#2E8B57" />
            <path d="M312 120 L333 85 L354 120 Z" fill="#3CB371" />
            <circle cx="350" cy="115" r="3" fill="var(--gold-primary)" />

            <rect x="420" y="140" width="5" height="25" fill="#5C4033" />
            <path d="M400 144 L422.5 110 L445 144 Z" fill="#1E4620" />
            <path d="M407 125 L422.5 98 L438 125 Z" fill="#228B22" />
          </g>
        )}

        {state === 'medium' && (
          <g>
            <rect x="60" y="135" width="5" height="25" fill="#7A6F4D" />
            <path d="M45 140 L62.5 105 L80 140 Z" fill="#5B7E58" />
            <path d="M50 120 L62.5 90 L75 120 Z" fill="#789675" />

            <rect x="350" y="135" width="5" height="25" fill="#7A6F4D" />
            <path d="M330 140 L352.5 110 L375 140 Z" fill="#5E6850" />
            <path d="M352 125 L365 115" stroke="#7A6F4D" strokeWidth="1.5" />
            <path d="M352 130 L340 122" stroke="#7A6F4D" strokeWidth="1.5" />
          </g>
        )}

        {state === 'high' && (
          <g>
            <path d="M70 160 L70 115" stroke="#555" strokeWidth="3" strokeLinecap="round" />
            <path d="M70 140 L55 125" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            <path d="M70 130 L85 118" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            <path d="M85 118 L90 108" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M55 125 L50 128" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />

            <path d="M370 155 L370 110" stroke="#555" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M370 135 L382 122" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M370 128 L358 116" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}

        {/* Small flowers / rocks on forest ground */}
        {state === 'low' && (
          <g fill="var(--gold-primary)">
            <circle cx="90" cy="180" r="2" />
            <circle cx="94" cy="182" r="1.5" />
            <circle cx="310" cy="175" r="2" />
            <circle cx="390" cy="185" r="2" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default React.memo(CarbonTwin);
