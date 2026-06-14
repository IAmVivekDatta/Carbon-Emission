import React from 'react';
import GlassCard from './GlassCard';

/**
 * ActionPlan component displaying recommended sustainability guidelines.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.recommendations - Emission mitigation recommendations
 * @param {Object} props.loggedToday - Logged status map of recommendation IDs
 * @param {Function} props.onToggleAction - Callback to toggle logging state
 * @param {boolean} props.loadingRecs - Fetch loading state indicator
 * @returns {React.ReactElement}
 */
function ActionPlan({
  recommendations,
  loggedToday,
  onToggleAction,
  loadingRecs
}) {
  return (
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
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{rec.reason}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    Difficulty: {rec.difficulty}
                  </span>
                  <button 
                    className={`btn ${isLogged ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onToggleAction(rec.id, rec.estimatedSavings)}
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
  );
}

export default React.memo(ActionPlan);
