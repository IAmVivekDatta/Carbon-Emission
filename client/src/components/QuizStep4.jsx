import React from 'react';
import { SHOPPING_FREQUENCIES, RECYCLING_LEVELS } from '../constants/ecoConstants';

/**
 * Step 4 of the quiz: Waste & Shopping habits.
 *
 * @component
 * @param {Object} props
 * @param {string} props.shoppingFrequency - Shopping frequency option
 * @param {Function} props.setShoppingFrequency - Setter for shopping frequency
 * @param {string} props.recycling - Recycling level option
 * @param {Function} props.setRecycling - Setter for recycling level
 * @returns {React.ReactElement}
 */
export default function QuizStep4({ 
  shoppingFrequency, 
  setShoppingFrequency, 
  recycling, 
  setRecycling 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <p>How often do you make non-essential purchases, and do you recycle?</p>

      <div>
        <label 
          htmlFor="shopping-frequency" 
          style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--green-primary)' }}
        >
          Shopping Habits (Clothes, tech, items)
        </label>
        <select 
          id="shopping-frequency"
          value={shoppingFrequency}
          onChange={(e) => setShoppingFrequency(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-gold)',
            background: 'var(--bg-primary)',
            fontSize: '1rem',
            color: 'var(--text-primary)'
          }}
        >
          {SHOPPING_FREQUENCIES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label 
          htmlFor="recycling-level" 
          style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--green-primary)' }}
        >
          Recycling & Composting
        </label>
        <select 
          id="recycling-level"
          value={recycling}
          onChange={(e) => setRecycling(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-gold)',
            background: 'var(--bg-primary)',
            fontSize: '1rem',
            color: 'var(--text-primary)'
          }}
        >
          {RECYCLING_LEVELS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
