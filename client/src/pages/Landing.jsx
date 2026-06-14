import React from 'react';
import GlassCard from '../components/GlassCard';
import LeafDivider from '../components/LeafDivider';

/**
 * Premium Eco-themed Landing Page
 */
export default function Landing({ onStartQuiz }) {
  return (
    <main className="container section animate-fade" id="main-content">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 
          style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            marginBottom: '16px',
            fontWeight: 700,
            letterSpacing: '-1px'
          }}
        >
          Align with the Earth’s Rhythm
        </h1>
        <p 
          style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', 
            maxWidth: '700px', 
            margin: '0 auto 36px',
            color: 'var(--text-secondary)'
          }}
        >
          Verdant Pulse turns complex carbon numbers into personal, calming, and highly actionable guidance. Discover your footprint and make simple daily changes that matter.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button 
            className="btn btn-primary" 
            onClick={onStartQuiz}
            style={{ padding: '14px 32px', fontSize: '1.05rem' }}
          >
            Start Carbon Onboarding
          </button>
        </div>
      </section>

      <LeafDivider />

      {/* Feature Pillar Cards */}
      <section 
        className="grid grid-3" 
        style={{ marginTop: '40px' }}
      >
        <GlassCard leafCorner={true} padding="32px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--green-soft)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--green-primary)',
                fontWeight: 'bold',
                fontSize: '1.25rem'
              }}
            >
              01
            </div>
            <h3>Intelligent Calculation</h3>
            <p>
              Answer five simple questions about your daily commute, eating habits, energy usage, and buying patterns to map your personal footprint.
            </p>
          </div>
        </GlassCard>

        <GlassCard leafCorner={true} padding="32px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--green-soft)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--green-primary)',
                fontWeight: 'bold',
                fontSize: '1.25rem'
              }}
            >
              02
            </div>
            <h3>Personalized Action Plans</h3>
            <p>
              Get customized recommendations focusing on your highest-emission areas first. No guilt, just realistic, high-impact improvements.
            </p>
          </div>
        </GlassCard>

        <GlassCard leafCorner={true} padding="32px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--green-soft)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--green-primary)',
                fontWeight: 'bold',
                fontSize: '1.25rem'
              }}
            >
              03
            </div>
            <h3>Habit & Streak Tracking</h3>
            <p>
              Log your sustainable actions daily. Watch your completion rate grow, maintain your streak, and view long-term CO2 reductions.
            </p>
          </div>
        </GlassCard>
      </section>

      {/* Decorative botanical outline element */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '60px',
          opacity: 0.8
        }}
      >
        <svg 
          width="200" 
          height="100" 
          viewBox="0 0 200 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stem */}
          <path 
            className="leaf-draw"
            d="M20 90C60 70 100 70 180 30" 
            stroke="var(--gold-primary)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
          />
          {/* Leaves */}
          <path 
            className="leaf-draw"
            d="M60 78C60 78 75 62 82 72C89 82 70 85 70 85" 
            stroke="var(--green-light)" 
            strokeWidth="1" 
          />
          <path 
            className="leaf-draw"
            d="M100 68C100 68 118 52 122 64C126 76 108 76 108 76" 
            stroke="var(--green-light)" 
            strokeWidth="1" 
          />
          <path 
            className="leaf-draw"
            d="M140 54C140 54 162 42 162 52C162 62 146 60 146 60" 
            stroke="var(--green-light)" 
            strokeWidth="1" 
          />
        </svg>
      </div>
    </main>
  );
}
