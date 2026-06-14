import React, { useState, useMemo, useCallback } from 'react';
import GlassCard from '../components/GlassCard';
import LeafDivider from '../components/LeafDivider';
import CarbonTwin from '../components/CarbonTwin';
import CarbonCoach from '../components/CarbonCoach';
import TrendChart from '../components/TrendChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import WeeklyChallenges from '../components/WeeklyChallenges';
import ActionPlan from '../components/ActionPlan';

// Custom Hooks
import useChallenges from '../hooks/useChallenges';
import useRecommendations from '../hooks/useRecommendations';

// Utilities
import { calculateSavings, calculateChallengeSavings, deriveImpactEquivalent } from '../utils/calculations';
import { roundToOneDecimal, formatNumber } from '../utils/formatters';

/**
 * Premium Eco-friendly Dashboard & behaviour-change platform.
 * Orchestrates subcomponents: Carbon Twin, AI Coach, Trend Chart, Category breakdown, and lists.
 * Utilizes custom hooks for network calls and logic separation.
 *
 * @component
 * @param {Object}   props
 * @param {Object}   props.profileData          - Calculated carbon profile object from the API
 * @param {Function} props.onLogAction          - Callback to log/unlog an action and update streaks
 * @param {Object}   [props.completedActions={}] - Map of actionId → logged boolean
 * @param {Object}   [props.completedChallenges={}] - Map of challengeId → completed boolean
 * @param {Function} props.onToggleChallenge    - Callback to toggle a challenge completed state
 * @param {Object}   [props.joinedChallenges={}] - Map of challengeId → joined boolean
 * @param {Function} props.onJoinChallenge      - Callback to join/leave a challenge
 * @param {number}   [props.streak=0]           - Current daily habit-logging streak count
 * @returns {React.ReactElement}
 */
export default function Dashboard({ 
  profileData, 
  onLogAction, 
  completedActions = {},
  streak = 0 
}) {
  const { categories, total, benchmark, inputs } = profileData;
  const [loggedToday, setLoggedToday] = useState(completedActions);

  // Consume custom hooks for challenges and recommendations
  const {
    challenges,
    loadingChallenges,
    joinedChallenges,
    completedChallenges,
    handleJoinChallenge,
    handleToggleChallenge
  } = useChallenges();

  const {
    recommendations,
    loadingRecs
  } = useRecommendations(categories, inputs);

  /**
   * Toggles an action's logged state locally and propagates to App state.
   */
  const handleToggleAction = useCallback((actionId, savings) => {
    const isNowLogged = !loggedToday[actionId];
    const updated = { ...loggedToday, [actionId]: isNowLogged };
    setLoggedToday(updated);
    onLogAction(actionId, isNowLogged, savings);
  }, [loggedToday, onLogAction]);

  // ── Derived savings & emissions ──────────────────────────────────────────────

  const totalSavingsLogged = useMemo(() =>
    calculateSavings(loggedToday, recommendations),
    [loggedToday, recommendations]
  );

  const totalSavingsFromChallenges = useMemo(() =>
    calculateChallengeSavings(completedChallenges, challenges),
    [completedChallenges, challenges]
  );

  const totalEmissionsSaved = useMemo(() =>
    roundToOneDecimal(totalSavingsLogged + totalSavingsFromChallenges),
    [totalSavingsLogged, totalSavingsFromChallenges]
  );

  const currentEmissions = useMemo(() =>
    Math.max(0, roundToOneDecimal(total - totalEmissionsSaved)),
    [total, totalEmissionsSaved]
  );

  const currentPercentOfBenchmark = useMemo(() =>
    Math.round((currentEmissions / benchmark) * 100),
    [currentEmissions, benchmark]
  );

  // ── Impact Story Equivalents ─────────────────────────────────────────────────

  const { carKms, treeDays, phoneCharges } = useMemo(() =>
    deriveImpactEquivalent(totalEmissionsSaved),
    [totalEmissionsSaved]
  );

  const earnedBadges = useMemo(() =>
    challenges.filter(c => completedChallenges[c.id]).map(c => c.badge),
    [challenges, completedChallenges]
  );

  // ── Smart Insight Text ───────────────────────────────────────────────────────

  const insightText = useMemo(() => {
    const maxCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    const categoryNames = {
      commute:    'commuting and travel',
      diet:       'food and culinary habits',
      homeEnergy: 'home electricity and heating',
      shopping:   'purchasing behavior',
      waste:      'waste disposal and recycling'
    };
    const leadText = `Your highest emission category is ${categoryNames[maxCategory[0]]}, representing ${Math.round((maxCategory[1] / total) * 100)}% of your profile.`;

    if (maxCategory[0] === 'commute') return `${leadText} Reducing vehicle distance or carpooling even two days a week is your most powerful lever to shrink your carbon footprint.`;
    if (maxCategory[0] === 'diet') return `${leadText} Incorporating plant-based meals can cut your agricultural footprint in half. A flexible approach to dining is key.`;
    if (maxCategory[0] === 'homeEnergy') return `${leadText} Simple household thermal modifications (like checking insulation and adjusting thermostat settings by 1°C) will deliver substantial immediate grid savings.`;
    return `${leadText} Embracing the repair of tools/clothing and composting organic food scraps will prevent methane buildup in landfills.`;
  }, [categories, total]);

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
        <CarbonTwin emissions={currentEmissions} />

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

            {/* Impact Stories */}
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
                    <span>Equivalent to charging a smartphone <strong>{formatNumber(phoneCharges)} times</strong>.</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Achievements / Badges */}
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

      {/* MID ROW: Category breakdown, Trend Chart, and AI Coach */}
      <section className="grid grid-2" style={{ marginBottom: '32px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <CategoryBreakdown categories={categories} total={total} />
          <TrendChart total={total} currentEmissions={currentEmissions} benchmark={benchmark} />
        </div>

        <CarbonCoach 
          profileData={profileData} 
          recommendations={recommendations} 
        />
      </section>

      {/* Smart Assistant Insight Box */}
      <section style={{ marginBottom: '42px' }}>
        <GlassCard padding="20px" style={{ borderLeft: '4px solid var(--gold-primary)', background: 'rgba(243, 237, 224, 0.4)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.4rem' }} role="img" aria-label="insight bulb">💡</span>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--green-primary)' }}>Smart Assistant Insight</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {insightText}
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      <LeafDivider />

      {/* BOTTOM ROW: Weekly Challenges & Action Plan */}
      <section className="grid grid-2" style={{ marginTop: '20px', alignItems: 'stretch' }}>
        <WeeklyChallenges 
          challenges={challenges}
          joinedChallenges={joinedChallenges}
          completedChallenges={completedChallenges}
          onJoinChallenge={handleJoinChallenge}
          onToggleChallenge={handleToggleChallenge}
          loadingChallenges={loadingChallenges}
        />

        <ActionPlan 
          recommendations={recommendations}
          loggedToday={loggedToday}
          onToggleAction={handleToggleAction}
          loadingRecs={loadingRecs}
        />
      </section>
    </main>
  );
}
