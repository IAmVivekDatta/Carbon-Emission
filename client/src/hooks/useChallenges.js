import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { fetchWeeklyChallenges } from '../services/carbonApi';

/**
 * Custom React hook for fetching and managing state of weekly eco-challenges.
 *
 * @returns {Object} Challenges data and event handlers
 */
export default function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [joinedChallenges, setJoinedChallenges, removeJoined] = useLocalStorage('verdant_pulse_joined_challenges', {});
  const [completedChallenges, setCompletedChallenges, removeCompleted] = useLocalStorage('verdant_pulse_completed_challenges', {});

  // Fetch challenges on load
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchWeeklyChallenges();
        if (active) setChallenges(data);
      } catch (err) {
        console.error('Error fetching challenges:', err);
      } finally {
        if (active) setLoadingChallenges(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  /**
   * Joins or leaves a weekly eco challenge.
   */
  const handleJoinChallenge = useCallback((challengeId, isJoined) => {
    setJoinedChallenges(prev => ({ ...prev, [challengeId]: isJoined }));
  }, [setJoinedChallenges]);

  /**
   * Toggles completion status of a weekly challenge, automatically joining it if not joined.
   */
  const handleToggleChallenge = useCallback((challengeId, isCompleted) => {
    setCompletedChallenges(prev => ({ ...prev, [challengeId]: isCompleted }));
    if (isCompleted && !joinedChallenges[challengeId]) {
      handleJoinChallenge(challengeId, true);
    }
  }, [joinedChallenges, setCompletedChallenges, handleJoinChallenge]);

  /**
   * Resets all joined and completed challenge logs.
   */
  const resetChallenges = useCallback(() => {
    removeJoined();
    removeCompleted();
  }, [removeJoined, removeCompleted]);

  return {
    challenges,
    loadingChallenges,
    joinedChallenges,
    completedChallenges,
    setCompletedChallenges,
    setJoinedChallenges,
    handleJoinChallenge,
    handleToggleChallenge,
    resetChallenges
  };
}
