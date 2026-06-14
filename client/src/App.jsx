import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';

// Lazy-load page components to reduce initial bundle size
// Each page is split into a separate chunk by Vite
const Landing = lazy(() => import('./pages/Landing'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

/**
 * Lightweight loading spinner shown during lazy-loaded page transitions.
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
 * Root application component managing global state and view routing.
 * Uses useCallback to memoize all event handlers and prevent child re-renders.
 * Pages are lazy-loaded for reduced initial bundle size.
 *
 * @returns {React.ReactElement}
 */
export default function App() {
  const [view, setView] = useState('landing');
  const [profileData, setProfileData] = useState(null);
  const [streak, setStreak] = useState(0);
  const [completedActions, setCompletedActions] = useState({});
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [joinedChallenges, setJoinedChallenges] = useState({});
  const [lastLoggedDate, setLastLoggedDate] = useState(null);
  const [error, setError] = useState('');

  // 1. On Mount: Hydrate state from LocalStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('verdant_pulse_profile');
      const savedStreak = localStorage.getItem('verdant_pulse_streak');
      const savedCompleted = localStorage.getItem('verdant_pulse_completed');
      const savedLastLogged = localStorage.getItem('verdant_pulse_last_logged');
      const savedCompletedChallenges = localStorage.getItem('verdant_pulse_completed_challenges');
      const savedJoinedChallenges = localStorage.getItem('verdant_pulse_joined_challenges');

      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
        setView('dashboard');
      }
      if (savedCompleted) setCompletedActions(JSON.parse(savedCompleted));
      if (savedCompletedChallenges) setCompletedChallenges(JSON.parse(savedCompletedChallenges));
      if (savedJoinedChallenges) setJoinedChallenges(JSON.parse(savedJoinedChallenges));

      let activeStreak = 0;
      if (savedStreak) {
        activeStreak = parseInt(savedStreak, 10) || 0;
        setStreak(activeStreak);
      }

      if (savedLastLogged) {
        setLastLoggedDate(savedLastLogged);
        const todayStr = new Date().toDateString();
        const diffTime = Math.abs(new Date(todayStr) - new Date(savedLastLogged));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1 && savedLastLogged !== todayStr) {
          setStreak(0);
          localStorage.setItem('verdant_pulse_streak', '0');
        }
      }
    } catch (err) {
      console.error('Error hydrating localStorage:', err);
    }
  }, []);

  /**
   * Submits quiz form data to the backend and saves the calculated carbon profile.
   * @param {Object} formData - The quiz questionnaire answers
   */
  const handleQuizSubmit = useCallback(async (formData) => {
    setError('');
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to calculate footprint.');
      setProfileData(data);
      localStorage.setItem('verdant_pulse_profile', JSON.stringify(data));
      setView('dashboard');
    } catch (err) {
      console.error('Quiz Submission Error:', err);
      setError(err.message || 'Server error. Please try again.');
    }
  }, []);

  /**
   * Logs or un-logs an action and updates the daily streak accordingly.
   * @param {string} actionId - Unique ID of the action
   * @param {boolean} isLogged - Whether the action is being logged (true) or un-logged (false)
   * @param {number} savings - Estimated CO2 savings in kg for this action
   */
  const handleLogAction = useCallback((actionId, isLogged, savings) => {
    const updatedCompleted = { ...completedActions, [actionId]: isLogged };
    setCompletedActions(updatedCompleted);
    localStorage.setItem('verdant_pulse_completed', JSON.stringify(updatedCompleted));

    const todayStr = new Date().toDateString();
    const activeLogs = Object.entries(updatedCompleted).filter(([_, val]) => val);

    if (isLogged && activeLogs.length === 1) {
      let newStreak = streak;
      if (!lastLoggedDate) {
        newStreak = 1;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        if (lastLoggedDate === yesterdayStr) {
          newStreak = streak + 1;
        } else if (lastLoggedDate !== todayStr) {
          newStreak = 1;
        }
      }
      setStreak(newStreak);
      setLastLoggedDate(todayStr);
      localStorage.setItem('verdant_pulse_streak', newStreak.toString());
      localStorage.setItem('verdant_pulse_last_logged', todayStr);
    }
  }, [completedActions, streak, lastLoggedDate]);

  /**
   * Joins or leaves a weekly eco challenge.
   * @param {string} challengeId - The challenge identifier
   * @param {boolean} isJoined - Whether the user is joining (true) or leaving (false)
   */
  const handleJoinChallenge = useCallback((challengeId, isJoined) => {
    const updated = { ...joinedChallenges, [challengeId]: isJoined };
    setJoinedChallenges(updated);
    localStorage.setItem('verdant_pulse_joined_challenges', JSON.stringify(updated));
  }, [joinedChallenges]);

  /**
   * Toggles the completion state of a weekly eco challenge.
   * Automatically joins the challenge when marked complete.
   * @param {string} challengeId - The challenge identifier
   * @param {boolean} isCompleted - Whether the challenge is being completed (true) or undone (false)
   */
  const handleToggleChallenge = useCallback((challengeId, isCompleted) => {
    const updated = { ...completedChallenges, [challengeId]: isCompleted };
    setCompletedChallenges(updated);
    localStorage.setItem('verdant_pulse_completed_challenges', JSON.stringify(updated));
    if (isCompleted && !joinedChallenges[challengeId]) {
      handleJoinChallenge(challengeId, true);
    }
  }, [completedChallenges, joinedChallenges, handleJoinChallenge]);

  /**
   * Clears all profile data, streaks, and challenge states after user confirmation.
   */
  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your carbon profile, logged habits, and challenges? This cannot be undone.')) {
      ['verdant_pulse_profile', 'verdant_pulse_streak', 'verdant_pulse_completed',
       'verdant_pulse_last_logged', 'verdant_pulse_completed_challenges', 'verdant_pulse_joined_challenges']
        .forEach(key => localStorage.removeItem(key));
      setProfileData(null);
      setStreak(0);
      setCompletedActions({});
      setCompletedChallenges({});
      setJoinedChallenges({});
      setLastLoggedDate(null);
      setView('landing');
    }
  }, []);

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
