import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { calculateFootprint } from '../services/carbonApi';

/**
 * Custom React hook managing the user's carbon profile, active streaks, and action logs.
 *
 * @returns {Object} State and handler properties
 */
export default function useCarbonProfile() {
  const [profileData, setProfileData, removeProfile] = useLocalStorage('verdant_pulse_profile', null);
  const [streak, setStreak, removeStreak] = useLocalStorage('verdant_pulse_streak', 0);
  const [completedActions, setCompletedActions, removeCompletedActions] = useLocalStorage('verdant_pulse_completed', {});
  const [lastLoggedDate, setLastLoggedDate, removeLastLoggedDate] = useLocalStorage('verdant_pulse_last_logged', null);
  const [error, setError] = useState('');

  // Validate streak continuity on mount
  useEffect(() => {
    if (lastLoggedDate) {
      const todayStr = new Date().toDateString();
      const diffTime = Math.abs(new Date(todayStr) - new Date(lastLoggedDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1 && lastLoggedDate !== todayStr) {
        setStreak(0);
      }
    }
  }, [lastLoggedDate, setStreak]);

  /**
   * Submits the questionnaire answers to calculate the profile.
   */
  const submitQuiz = useCallback(async (formData) => {
    setError('');
    try {
      const data = await calculateFootprint(formData);
      setProfileData(data);
      return data;
    } catch (err) {
      console.error('Quiz Submission Error:', err);
      setError(err.message || 'Server error. Please try again.');
      throw err;
    }
  }, [setProfileData]);

  /**
   * Toggles habit logs and calculates streak increments.
   */
  const handleLogAction = useCallback((actionId, isLogged, savings) => {
    setCompletedActions((prev) => {
      const updated = { ...prev, [actionId]: isLogged };
      const todayStr = new Date().toDateString();
      const activeLogs = Object.entries(updated).filter(([_, val]) => val);

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
      }
      return updated;
    });
  }, [streak, lastLoggedDate, setStreak, setCompletedActions, setLastLoggedDate]);

  /**
   * Resets all carbon data, habits, and streaks from storage.
   */
  const resetProfile = useCallback(() => {
    removeProfile();
    removeStreak();
    removeCompletedActions();
    removeLastLoggedDate();
    setError('');
  }, [removeProfile, removeStreak, removeCompletedActions, removeLastLoggedDate]);

  return {
    profileData,
    setProfileData,
    streak,
    setStreak,
    completedActions,
    setCompletedActions,
    lastLoggedDate,
    error,
    setError,
    submitQuiz,
    handleLogAction,
    resetProfile
  };
}
