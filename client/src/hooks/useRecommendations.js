import { useState, useEffect } from 'react';
import { fetchRecommendations } from '../services/carbonApi';

/**
 * Custom React hook for fetching and managing recommendations list.
 *
 * @param {Object} categories - Emission category breakdown map
 * @param {Object} inputs - User questionnaire answers
 * @returns {Object} List of recommendations and loading state
 */
export default function useRecommendations(categories, inputs) {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchRecommendations(categories, inputs);
        if (active) setRecommendations(data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        if (active) setLoadingRecs(false);
      }
    }
    load();
    return () => { active = false; };
  }, [categories, inputs]);

  return {
    recommendations,
    loadingRecs
  };
}
