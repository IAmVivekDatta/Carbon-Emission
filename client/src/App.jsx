import React, { useState, useCallback, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import useCarbonProfile from './hooks/useCarbonProfile';
import useChallenges from './hooks/useChallenges';

// Lazy-load page components to reduce initial bundle size
const Landing = lazy(() => import('./pages/Landing'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

/**
 * Lightweight loading spinner shown during lazy-loaded page transitions.
 *
 * @returns {React.ReactElement}
 */
function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        color: 'var(--text-secondary)',
        fontSize: '1rem'
      }}
      aria-live="polite"
      aria-label="Loading page content"
    >
      <span>Loading...</span>
    </div>
  );
}

/**
 * Root application component managing global state, routing, and custom hooks.
 *
 * @returns {React.ReactElement}
 */
export default function App() {
  // Global router state
  const [view, setView] = useState(() => {
    return localStorage.getItem('verdant_pulse_profile') ? 'dashboard' : 'landing';
  });

  // Leverage custom hooks for State & Side effects isolation
  const {
    profileData,
    streak,
    completedActions,
    error,
    submitQuiz,
    handleLogAction,
    resetProfile
  } = useCarbonProfile();

  const {
    joinedChallenges,
    completedChallenges,
    handleJoinChallenge,
    handleToggleChallenge,
    resetChallenges
  } = useChallenges();

  /**
   * Submits the quiz responses to calculate carbon emissions.
   *
   * @param {Object} formData - Questionnaire input answers
   */
  const handleQuizSubmit = useCallback(async (formData) => {
    try {
      await submitQuiz(formData);
      setView('dashboard');
    } catch (err) {
      // Handled inside submitQuiz hook
    }
  }, [submitQuiz]);

  /**
   * Resets all carbon data, streaks, and challenges and returns to landing.
   */
  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your carbon profile, logged habits, and challenges? This cannot be undone.')) {
      resetProfile();
      resetChallenges();
      setView('landing');
    }
  }, [resetProfile, resetChallenges]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <Navbar 
        currentView={view} 
        setView={setView} 
        streak={streak} 
        onReset={handleReset} 
      />

      {error && (
        <div 
          className="container" 
          role="alert"
          style={{ 
            marginTop: '20px', 
            backgroundColor: '#FDF2F2', 
            border: '1px solid #F8B4B4', 
            color: '#9B1C1C', 
            padding: '12px 16px', 
            borderRadius: '8px' 
          }}
        >
          {error}
        </div>
      )}

      <Suspense fallback={<PageLoader />}>
        {view === 'landing' && (
          <Landing onStartQuiz={() => setView('quiz')} />
        )}

        {view === 'quiz' && (
          <Quiz onSubmit={handleQuizSubmit} />
        )}

        {view === 'dashboard' && profileData && (
          <Dashboard 
            profileData={profileData} 
            onLogAction={handleLogAction} 
            completedActions={completedActions}
            completedChallenges={completedChallenges}
            onToggleChallenge={handleToggleChallenge}
            joinedChallenges={joinedChallenges}
            onJoinChallenge={handleJoinChallenge}
            streak={streak}
          />
        )}
      </Suspense>

      <footer 
        style={{ 
          marginTop: 'auto', 
          padding: '40px 0 20px', 
          textAlign: 'center', 
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--border-light)'
        }}
      >
        <div className="container">
          <p>© {new Date().getFullYear()} Verdant Pulse. Crafted with care for a sustainable future.</p>
        </div>
      </footer>
    </>
  );
}
