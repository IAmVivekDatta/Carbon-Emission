import React, { useState, useRef, useEffect, useCallback } from 'react';
import GlassCard from './GlassCard';

/**
 * Static suggestion chips — defined outside the component to prevent
 * garbage-collection/re-allocation overhead on every render.
 * @type {string[]}
 */
const SUGGESTION_CHIPS = [
  "What should I change first?",
  "How can I cut my food footprint?",
  "Tips for lowering energy bills",
  "Explain my recycling impact"
];

/**
 * CarbonCoach - Conversational AI chat widget.
 * Communicates with the backend /api/chat endpoint.
 * Falls back gracefully to offline rule-based responses when AI is unavailable.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.profileData - The user's full carbon profile with categories, total, and benchmark
 * @param {Array}  props.recommendations - List of current action recommendations for the user
 * @returns {React.ReactElement}
 */
export default function CarbonCoach({ profileData, recommendations }) {
  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: "Hello! I'm your AI Carbon Coach. I have analyzed your carbon profile and recommendations. Ask me anything—for instance, 'What should I prioritize first?' or 'How can I reduce my home energy impact?'",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /**
   * Sends a user question to the AI Carbon Coach API endpoint.
   * Falls back to an inline error message if the request fails.
   * @param {string} [questionText] - Optional pre-filled question text (from suggestion chips)
   */
  const handleSend = useCallback(async (questionText) => {
    const query = questionText || input.trim();
    if (!query) return;

    if (!questionText) {
      setInput('');
    }

    const userMsg = { sender: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: query,
          profileData,
          recommendations
        })
      });

      const data = await response.json();
      
      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { sender: 'coach', text: data.reply, timestamp: new Date() }]);
      } else {
        throw new Error(data.error || 'Coach is offline.');
      }
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
  }, [input, profileData, recommendations]);

  /**
   * Handles Enter key press in the text input to submit a question.
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  /**
   * Updates the input field state on every change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  return (
    <GlassCard padding="24px" leafCorner={true} style={{ display: 'flex', flexDirection: 'column', height: '420px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
        <span style={{ fontSize: '1.4rem' }} role="img" aria-label="AI Coach avatar">🧠</span>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--green-primary)' }}>AI Carbon Coach</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Personalized conversational advisor</span>
        </div>
      </div>

      {/* Messages Window */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          marginBottom: '14px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          paddingRight: '4px'
        }}
        role="log"
        aria-label="Coach chat log"
        aria-live="polite"
      >
        {messages.map((msg, index) => {
          const isCoach = msg.sender === 'coach';
          return (
            <div 
              key={index} 
              style={{
                alignSelf: isCoach ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: isCoach ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                backgroundColor: isCoach ? 'var(--green-soft)' : 'var(--gold-light)',
                border: isCoach ? '1px solid rgba(17, 51, 34, 0.05)' : '1px solid var(--border-gold)',
                fontSize: '0.9rem',
                lineHeight: 1.45,
                color: 'var(--text-primary)'
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {loading && (
          <div 
            style={{ 
              alignSelf: 'flex-start',
              padding: '12px 16px',
              borderRadius: '16px 16px 16px 4px',
              backgroundColor: 'var(--green-soft)',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}
            aria-live="polite"
            aria-label="Coach is thinking"
          >
            Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips — shown only before first user message */}
      {messages.length === 1 && !loading && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          {SUGGESTION_CHIPS.map((chip, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(chip)}
              className="btn btn-secondary"
              style={{ 
                padding: '6px 12px', 
                fontSize: '0.75rem', 
                borderRadius: '16px', 
                borderColor: 'var(--border-gold)' 
              }}
              type="button"
              aria-label={`Ask: ${chip}`}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          placeholder="Ask a question..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={loading}
          aria-label="Coach chat message text input"
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: '1px solid var(--border-gold)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem'
          }}
        />
        <button 
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="btn btn-primary"
          style={{ 
            borderRadius: '50%', 
            width: '42px', 
            height: '42px', 
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Send message"
        >
          ➔
        </button>
      </div>
    </GlassCard>
  );
}
