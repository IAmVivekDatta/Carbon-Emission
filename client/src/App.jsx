import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';

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

      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
        setView('dashboard');
      }

      if (savedCompleted) {
        setCompletedActions(JSON.parse(savedCompleted));
      }

      const savedCompletedChallenges = localStorage.getItem('verdant_pulse_completed_challenges');
      if (savedCompletedChallenges) {
        setCompletedChallenges(JSON.parse(savedCompletedChallenges));
      }

      const savedJoinedChallenges = localStorage.getItem('verdant_pulse_joined_challenges');
      if (savedJoinedChallenges) {
        setJoinedChallenges(JSON.parse(savedJoinedChallenges));
      }

      let activeStreak = 0;
      if (savedStreak) {
        activeStreak = parseInt(savedStreak, 10) || 0;
        setStreak(activeStreak);
      }

      if (savedLastLogged) {
        setLastLoggedDate(savedLastLogged);
        
        // Check if streak has decayed (missed logging yesterday)
        const todayStr = new Date().toDateString();
        const lastDate = new Date(savedLastLogged);
        const todayDate = new Date(todayStr);
        
        // Calculate difference in days
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1 && savedLastLogged !== todayStr) {
          // Streak expired, reset to 0
          setStreak(0);
          localStorage.setItem('verdant_pulse_streak', '0');
        }
      }
    } catch (err) {
      console.error('Error hydrating localStorage:', err);
    }
  }, []);

  // 2. Handle quiz form submission to backend Express API
  const handleQuizSubmit = async (formData) => {
    setError('');
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate footprint.');
      }

      // Save to React State & LocalStorage
      setProfileData(data);
      localStorage.setItem('verdant_pulse_profile', JSON.stringify(data));
      setView('dashboard');
    } catch (err) {
      console.error('Quiz Submission Error:', err);
      setError(err.message || 'Server error. Please try again.');
    }
  };

  // 3. Handle logging actions & updating streaks
  const handleLogAction = (actionId, isLogged, savings) => {
    const updatedCompleted = {
      ...completedActions,
      [actionId]: isLogged
    };
    setCompletedActions(updatedCompleted);
    localStorage.setItem('verdant_pulse_completed', JSON.stringify(updatedCompleted));

    // Streak Logic: If logging an action and no actions were checked for today
    const todayStr = new Date().toDateString();
    
    // Check if there are any other logged actions currently active
    const activeLogs = Object.entries(updatedCompleted).filter(([_, val]) => val);
    
    if (isLogged && activeLogs.length === 1) {
      // First action logged today
      let newStreak = streak;

      if (!lastLoggedDate) {
        newStreak = 1;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastLoggedDate === yesterdayStr) {
          newStreak = streak + 1; // Consecutive days
        } else if (lastLoggedDate !== todayStr) {
          newStreak = 1; // Broke streak, restart at 1
        }
      }

      setStreak(newStreak);
      setLastLoggedDate(todayStr);
      localStorage.setItem('verdant_pulse_streak', newStreak.toString());
      localStorage.setItem('verdant_pulse_last_logged', todayStr);
    } else if (!isLogged && activeLogs.length === 0) {
      // If user unchecks ALL logged actions, we don't necessarily strip streak immediately 
      // but let's keep the streak to encourage the user.
    }
  };

  // Handle joining a weekly challenge
  const handleJoinChallenge = (challengeId, isJoined) => {
    const updated = {
      ...joinedChallenges,
      [challengeId]: isJoined
    };
    setJoinedChallenges(updated);
    localStorage.setItem('verdant_pulse_joined_challenges', JSON.stringify(updated));
  };

  // Handle toggling completion of a weekly challenge
  const handleToggleChallenge = (challengeId, isCompleted) => {
    const updated = {
      ...completedChallenges,
      [challengeId]: isCompleted
    };
    setCompletedChallenges(updated);
    localStorage.setItem('verdant_pulse_completed_challenges', JSON.stringify(updated));

    // Also toggle join state to true if they completed it
    if (isCompleted && !joinedChallenges[challengeId]) {
      handleJoinChallenge(challengeId, true);
    }
  };

  // 4. Reset User Profile & Clear LocalStorage
  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your carbon profile, logged habits, and challenges? This cannot be undone.')) {
      localStorage.removeItem('verdant_pulse_profile');
      localStorage.removeItem('verdant_pulse_streak');
      localStorage.removeItem('verdant_pulse_completed');
      localStorage.removeItem('verdant_pulse_last_logged');
      localStorage.removeItem('verdant_pulse_completed_challenges');
      localStorage.removeItem('verdant_pulse_joined_challenges');

      setProfileData(null);
      setStreak(0);
      setCompletedActions({});
      setCompletedChallenges({});
      setJoinedChallenges({});
      setLastLoggedDate(null);
      setView('landing');
    }
  };

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
