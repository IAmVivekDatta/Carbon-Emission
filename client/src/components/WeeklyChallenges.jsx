import React from 'react';
import GlassCard from './GlassCard';

/**
 * WeeklyChallenges component displaying the active eco-challenges list.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.challenges - Available weekly challenges
 * @param {Object} props.joinedChallenges - Map of joined challenge states
 * @param {Object} props.completedChallenges - Map of completed challenge states
 * @param {Function} props.onJoinChallenge - Callback to join a challenge
 * @param {Function} props.onToggleChallenge - Callback to toggle challenge completion status
 * @param {boolean} props.loadingChallenges - Status of loading request
 * @returns {React.ReactElement}
 */
function WeeklyChallenges({
  challenges,
  joinedChallenges,
  completedChallenges,
  onJoinChallenge,
  onToggleChallenge,
  loadingChallenges
}) {
  return (
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
                            aria-label={`Undo challenge: ${challenge.title}`}
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
  );
}

export default React.memo(WeeklyChallenges);
