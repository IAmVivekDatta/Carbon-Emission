import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import LeafDivider from '../components/LeafDivider';
import ProgressBar from '../components/ProgressBar';
import CarbonTwin from '../components/CarbonTwin';
import CarbonCoach from '../components/CarbonCoach';

/**
 * Premium Eco-friendly Dashboard & behavior change platform.
 * Integrates Carbon Twin, AI Coach, Weekly Challenges, and Impact Stories.
 */
export default function Dashboard({ 
  profileData, 
  onLogAction, 
  completedActions = {}, 
  completedChallenges = {},
  onToggleChallenge,
  joinedChallenges = {},
  onJoinChallenge,
  streak = 0 
}) {
  const { categories, total, benchmark, percentageOfBenchmark, inputs } = profileData;
  const [recommendations, setRecommendations] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loggedToday, setLoggedToday] = useState(completedActions);

  // Fetch recommendations from API
  useEffect(() => {
    async function fetchRecs() {
      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categories, inputs })
        });
        const data = await response.json();
        if (response.ok && data.recommendations) {
          setRecommendations(data.recommendations);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoadingRecs(false);
      }
    }
    fetchRecs();
  }, [categories, inputs]);

  // Fetch weekly challenges from API
  useEffect(() => {
    async function fetchChallenges() {
      try {
        const response = await fetch('/api/challenges');
        const data = await response.json();
        if (response.ok && data.challenges) {
          setChallenges(data.challenges);
        }
      } catch (err) {
        console.error('Error fetching challenges:', err);
      } finally {
        setLoadingChallenges(false);
      }
    }
    fetchChallenges();
  }, []);

  // Handle local action logging toggles
  const handleToggleAction = (actionId, savings) => {
    const isNowLogged = !loggedToday[actionId];
    const updated = {
      ...loggedToday,
      [actionId]: isNowLogged
    };
    setLoggedToday(updated);
    onLogAction(actionId, isNowLogged, savings);
  };

  // 1. Calculate savings from actions
  const totalSavingsLogged = Object.entries(loggedToday)
    .filter(([_, logged]) => logged)
    .reduce((sum, [id]) => {
      const rec = recommendations.find(r => r.id === id);
      return sum + (rec ? rec.estimatedSavings : 0);
    }, 0);

  // 2. Calculate savings from challenges
  const totalSavingsFromChallenges = Object.entries(completedChallenges)
    .filter(([_, completed]) => completed)
    .reduce((sum, [id]) => {
      const chal = challenges.find(c => c.id === id);
      return sum + (chal ? chal.co2Savings : 0);
    }, 0);

  const totalEmissionsSaved = Math.round((totalSavingsLogged + totalSavingsFromChallenges) * 10) / 10;
  const currentEmissions = Math.max(0, Math.round((total - totalEmissionsSaved) * 10) / 10);
  const currentPercentOfBenchmark = Math.round((currentEmissions / benchmark) * 100);

  // 3. Impact Stories Translation (Feature 4)
  const carKms = Math.round(totalEmissionsSaved * 5.88 * 10) / 10;
  const treeDays = Math.round(totalEmissionsSaved * 16.5);
  const phoneCharges = Math.round(totalEmissionsSaved * 120);

  // 4. Earned Achievements / Badges
  const earnedBadges = challenges
    .filter(c => completedChallenges[c.id])
    .map(c => c.badge);

  // 5. Smart Insights
  const getInsightText = () => {
    const maxCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    const categoryNames = {
      commute: 'commuting and travel',
      diet: 'food and culinary habits',
      homeEnergy: 'home electricity and heating',
      shopping: 'purchasing behavior',
      waste: 'waste disposal and recycling'
    };

    const leadText = `Your highest emission category is ${categoryNames[maxCategory[0]]}, representing ${Math.round((maxCategory[1]/total)*100)}% of your profile.`;
    
    if (maxCategory[0] === 'commute') {
      return `${leadText} Reducing vehicle distance or carpooling even two days a week is your most powerful lever to shrink your carbon footprint.`;
    }
    if (maxCategory[0] === 'diet') {
      return `${leadText} Incorporating plant-based meals can cut your agricultural footprint in half. A flexible approach to dining is key.`;
    }
    if (maxCategory[0] === 'homeEnergy') {
      return `${leadText} Simple household thermal modifications (like checking insulation and adjusting thermostat settings by 1°C) will deliver substantial immediate grid savings.`;
    }
    return `${leadText} Embracing the repair of tools/clothing and composting organic food scraps will prevent methane buildup in landfills.`;
  };

  // 6. Trend line coordinates mapping
  const weekData = [
    { label: 'Base', val: total },
    { label: 'Wk 1', val: Math.round((total * 0.98) * 10) / 10 },
    { label: 'Wk 2', val: Math.round((total * 0.96) * 10) / 10 },
    { label: 'Wk 3', val: Math.round((total * 0.94) * 10) / 10 },
    { label: 'Wk 4', val: Math.round((total * 0.92) * 10) / 10 },
    { label: 'Now', val: currentEmissions }
  ];

  const chartWidth = 500;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const maxVal = Math.max(...weekData.map(d => d.val), benchmark) * 1.1;
  const minVal = Math.min(...weekData.map(d => d.val)) * 0.8;

  const points = weekData.map((d, index) => {
    const x = paddingX + (index * (chartWidth - 2 * paddingX) / (weekData.length - 1));
    const y = chartHeight - paddingY - ((d.val - minVal) * (chartHeight - 2 * paddingY) / (maxVal - minVal));
    return { x, y, ...d };
  });

  const pathD = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;
  const benchmarkY = chartHeight - paddingY - ((benchmark - minVal) * (chartHeight - 2 * paddingY) / (maxVal - minVal));

  return (
    <main className="container section animate-fade" id="main-content" style={{ padding: '40px 24px' }}>
      {/* Brand & Introduction */}
      <section style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: '700', color: 'var(--green-primary)', fontFamily: 'Lora, serif' }}>Your Verdant Pulse</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          Observe your Carbon Twin, log daily improvements, join weekly challenges, and chat with your AI Carbon Coach.
        </p>
      </section>

      {/* TOP ROW: Carbon Twin Visual Ecosystem & Core Stats Card */}
      <section className="grid grid-2" style={{ marginBottom: '32px', alignItems: 'stretch' }}>
        {/* Visual Nature Carbon Twin */}
        <CarbonTwin emissions={currentEmissions} />

        {/* Global Carbon & Impact Translation Metrics */}
        <GlassCard leafCorner={true} padding="30px" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Emissions Balance
              </span>
              {totalEmissionsSaved > 0 && (
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--green-soft)', color: 'var(--green-medium)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                  -{totalEmissionsSaved} kg saved this month
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: '700', color: 'var(--green-primary)' }}>{currentEmissions}</span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: '500' }}>kg CO₂/mo</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '16px' }}>
              Target benchmark: {benchmark} kg/mo. You are emitting <strong>{currentPercentOfBenchmark}%</strong> of the target.
            </p>

            {/* Impact Stories equivalents (Feature 4) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--green-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Real-World Impact
              </h4>
              {totalEmissionsSaved === 0 ? (
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  Log actions or complete challenges below to see your footprint translate into environmental stories.
                </p>
              ) : (
                <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
                  <li style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>🌳</span>
                    <span>Equivalent to 1 mature tree absorbing CO₂ for <strong>{treeDays} days</strong>.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>🚘</span>
                    <span>Equivalent to avoiding a <strong>{carKms} km</strong> gasoline car drive.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>🔌</span>
                    <span>Equivalent to charging a smartphone <strong>{phoneCharges.toLocaleString()} times</strong>.</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Achievements / Badges indicator (Feature 3) */}
          {earnedBadges.length > 0 && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--gold-hover)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                🏆 Earned Challenge Achievements
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {earnedBadges.map((badge, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      fontSize: '0.8rem', 
                      backgroundColor: 'var(--bg-primary)', 
                      border: '1px solid var(--border-gold)',
                      padding: '4px 10px', 
                      borderRadius: '16px', 
                      fontWeight: '500' 
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </section>

      {/* MID ROW: Category breakdown, SVGs chart, and AI Carbon Coach */}
      <section className="grid grid-2" style={{ marginBottom: '32px', alignItems: 'stretch' }}>
        {/* Left Side: Calculations Breakdown & Custom SVG line graph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Categories Progress Bars */}
          <GlassCard leafCorner={false} padding="24px">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--green-primary)' }}>Emissions by Category</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>🚘 Commute & Travel</span>
                  <span style={{ fontWeight: '600' }}>{categories.commute} kg</span>
                </div>
                <ProgressBar value={categories.commute} max={total} height="6px" />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>🥗 Diet & Food</span>
                  <span style={{ fontWeight: '600' }}>{categories.diet} kg</span>
                </div>
                <ProgressBar value={categories.diet} max={total} height="6px" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>⚡ Home Energy</span>
                  <span style={{ fontWeight: '600' }}>{categories.homeEnergy} kg</span>
                </div>
                <ProgressBar value={categories.homeEnergy} max={total} height="6px" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>🛍️ Shopping & Consumables</span>
                  <span style={{ fontWeight: '600' }}>{categories.shopping} kg</span>
                </div>
                <ProgressBar value={categories.shopping} max={total} height="6px" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>🗑️ Waste & Compost</span>
                  <span style={{ fontWeight: '600' }}>{categories.waste} kg</span>
                </div>
                <ProgressBar value={categories.waste} max={total} height="6px" />
              </div>
            </div>
          </GlassCard>

          {/* SVG Trend Chart */}
          <GlassCard leafCorner={false} padding="24px">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--green-primary)' }}>Emissions Reduction Trend</h2>
            <div style={{ width: '100%' }}>
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                style={{ width: '100%', height: 'auto' }}
                aria-label="Emissions reduction graph from baseline to current"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--green-medium)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--green-medium)" stopOpacity="0.00" />
                  </linearGradient>
                </defs>
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="var(--border-light)" strokeWidth="1" />
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="var(--border-light)" strokeWidth="0.5" strokeDasharray="3" />
                <line x1={paddingX} y1={benchmarkY} x2={chartWidth - paddingX} y2={benchmarkY} stroke="var(--gold-primary)" strokeWidth="1.2" strokeDasharray="4 4" />
                
                <path d={areaD} fill="url(#chartGradient)" />
                <path d={pathD} fill="none" stroke="var(--green-medium)" strokeWidth="2.5" strokeLinecap="round" />

                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="var(--bg-primary)" stroke="var(--green-light)" strokeWidth="2" />
                    <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--green-primary)">{p.val}</text>
                    <text x={p.x} y={chartHeight - 8} textAnchor="middle" fontSize="9" fill="var(--text-secondary)">{p.label}</text>
                  </g>
                ))}
              </svg>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: AI Carbon Coach Panel (Feature 2) */}
        <CarbonCoach 
          profileData={profileData} 
          recommendations={recommendations} 
        />
      </section>

      {/* Assistant Nudge / Insight Box */}
      <section style={{ marginBottom: '42px' }}>
        <GlassCard padding="20px" style={{ borderLeft: '4px solid var(--gold-primary)', background: 'rgba(243, 237, 224, 0.4)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.4rem' }} role="img" aria-label="insight bulb">💡</span>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--green-primary)' }}>Smart Assistant Insight</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {getInsightText()}
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      <LeafDivider />

      {/* BOTTOM ROW: Weekly Challenges & Action Plan Suggestions */}
      <section className="grid grid-2" style={{ marginTop: '20px', alignItems: 'stretch' }}>
        
        {/* Left Side: Weekly Challenges Component (Feature 3) */}
        <GlassCard leafCorner={true} padding="30px">
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--green-primary)' }}>Weekly Eco Challenges</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Join focused tasks to build green habits and earn trophy achievements.
            </p>
          </div>

          {loadingChallenges ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading challenges...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {challenges.map((challenge) => {
                const isJoined = !!joinedChallenges[challenge.id];
                const isCompleted = !!completedChallenges[challenge.id];
                return (
                  <div 
                    key={challenge.id}
                    style={{
                      border: '1px solid',
                      borderColor: isCompleted ? 'var(--green-light)' : isJoined ? 'var(--gold-primary)' : 'var(--border-light)',
                      backgroundColor: isCompleted ? 'rgba(232, 239, 234, 0.4)' : isJoined ? 'rgba(243, 237, 224, 0.2)' : 'transparent',
                      padding: '16px',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', color: 'var(--green-primary)' }}>
                          {challenge.title} <span style={{ fontSize: '0.9rem' }}>{challenge.badge.split(' ')[0]}</span>
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                          {challenge.description}
                        </p>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--green-medium)', whiteSpace: 'nowrap' }}>
                        -{challenge.co2Savings} kg
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        Difficulty: {challenge.difficulty}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!isJoined ? (
                          <button 
                            className="btn btn-secondary"
                            onClick={() => onJoinChallenge(challenge.id, true)}
                            style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                            aria-label={`Join challenge: ${challenge.title}`}
                          >
                            Join Challenge
                          </button>
                        ) : (
                          <>
                            <button 
                              className={`btn ${isCompleted ? 'btn-primary' : 'btn-gold'}`}
                              onClick={() => onToggleChallenge(challenge.id, !isCompleted)}
                              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                              aria-label={`${isCompleted ? 'Mark incomplete' : 'Complete'} challenge: ${challenge.title}`}
                            >
                              {isCompleted ? '✓ Completed' : 'Complete'}
                            </button>
                            {isCompleted && (
                              <button 
                                className="btn btn-text"
                                onClick={() => onToggleChallenge(challenge.id, false)}
                                style={{ padding: '2px 4px', fontSize: '0.75rem' }}
                              >
                                Undo
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Right Side: Action Plan Recommendations */}
        <GlassCard leafCorner={true} padding="30px">
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--green-primary)' }}>Customized Action Plan</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Implement the top recommendations suggested for your largest footprint categories.
            </p>
          </div>

          {loadingRecs ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Assembling action checklist...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recommendations.map((rec) => {
                const isLogged = !!loggedToday[rec.id];
                return (
                  <div 
                    key={rec.id}
                    style={{
                      border: '1px solid var(--border-light)',
                      borderLeft: isLogged ? '4px solid var(--green-light)' : '1px solid var(--border-gold)',
                      backgroundColor: isLogged ? 'rgba(232, 239, 234, 0.3)' : 'transparent',
                      padding: '16px',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1rem', color: isLogged ? 'var(--text-secondary)' : 'var(--green-primary)', textDecoration: isLogged ? 'line-through' : 'none' }}>
                        {rec.title}
                      </h3>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--green-medium)', whiteSpace: 'nowrap' }}>
                        -{rec.estimatedSavings} kg
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {rec.reason}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        Difficulty: {rec.difficulty}
                      </span>
                      <button 
                        className={`btn ${isLogged ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleToggleAction(rec.id, rec.estimatedSavings)}
                        style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                        aria-label={`${isLogged ? 'Undo logging' : 'Log'} action: ${rec.title}`}
                      >
                        {isLogged ? '✓ Logged' : rec.actionVerb || 'Log Action'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </section>
    </main>
  );
}
