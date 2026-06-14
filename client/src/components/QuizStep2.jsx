import React from 'react';
import { DIET_OPTIONS } from '../constants/ecoConstants';

/**
 * Step 2 of the quiz: Culinary carbon footprint.
 *
 * @component
 * @param {Object} props
 * @param {string} props.dietType - Selected diet type value
 * @param {Function} props.setDietType - Setter for diet type
 * @returns {React.ReactElement}
 */
export default function QuizStep2({ dietType, setDietType }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <p>Which option best describes your general eating patterns?</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {DIET_OPTIONS.map(option => (
          <label 
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid',
              borderColor: dietType === option.value ? 'var(--gold-primary)' : 'var(--border-light)',
              backgroundColor: dietType === option.value ? 'var(--green-soft)' : 'transparent',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            <input 
              type="radio" 
              name="diet" 
              value={option.value} 
              checked={dietType === option.value}
              onChange={() => setDietType(option.value)}
              style={{ marginTop: '4px', accentColor: 'var(--green-primary)' }}
            />
            <div>
              <span style={{ display: 'block', fontWeight: '600', color: 'var(--green-primary)' }}>{option.label}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{option.desc}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
