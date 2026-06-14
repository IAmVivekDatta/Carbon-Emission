import React, { useState, useRef, useEffect, useCallback } from 'react';
import GlassCard from './GlassCard';
import useCoach from '../hooks/useCoach';
import { COACH_SUGGESTION_CHIPS } from '../constants/ecoConstants';

/**
 * CarbonCoach - Conversational AI chat widget.
 * Communicates with the coach API via useCoach custom hook.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.profileData - The user's carbon profile
 * @param {Array<Object>} props.recommendations - Recommended action items
 * @returns {React.ReactElement}
 */
export default function CarbonCoach({ profileData, recommendations }) {
  const { messages, loading, handleSend } = useCoach(profileData, recommendations);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /**
   * Handles user submission on button click or chip selection.
   *
   * @param {string} [questionText] - Preset text from suggestion chips
   */
  const onSubmit = useCallback((questionText) => {
    const query = questionText || input.trim();
    if (!query) return;

    if (!questionText) {
      setInput('');
    }
    handleSend(query);
  }, [input, handleSend]);

  /**
   * Handles Enter key presses on the input box.
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }, [onSubmit]);

  /**
   * Updates input state value.
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

      {/* Suggestion Chips */}
      {messages.length === 1 && !loading && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          {COACH_SUGGESTION_CHIPS.map((chip, idx) => (
            <button 
              key={idx}
              onClick={() => onSubmit(chip)}
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
          onClick={() => onSubmit()}
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
