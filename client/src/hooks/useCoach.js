import { useState, useCallback } from 'react';
import { sendCoachMessage } from '../services/coachApi';

/**
 * Custom React hook for driving the AI Coach chat logs and question transmissions.
 *
 * @param {Object} profileData - User carbon footprint details
 * @param {Array<Object>} recommendations - Action plan checklist options
 * @returns {Object} Chat logs, loading status, and action handlers
 */
export default function useCoach(profileData, recommendations) {
  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: "Hello! I'm your AI Carbon Coach. I have analyzed your carbon profile and recommendations. Ask me anything—for instance, 'What should I prioritize first?' or 'How can I reduce my home energy impact?'",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);

  /**
   * Submits a conversational message to the AI coach.
   */
  const handleSend = useCallback(async (userQuestion) => {
    if (!userQuestion || !userQuestion.trim()) return;

    const userMsg = { sender: 'user', text: userQuestion, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await sendCoachMessage(userQuestion, profileData, recommendations);
      setMessages(prev => [...prev, { sender: 'coach', text: reply, timestamp: new Date() }]);
    } catch (err) {
      console.error('Coach Chat Error:', err);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'coach', 
          text: "I'm having a little trouble connecting to my AI core. For travel: prioritize active transit or public transit. For diet: try adding a meatless day. What else can I help with?", 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [profileData, recommendations]);

  return {
    messages,
    loading,
    handleSend
  };
}
