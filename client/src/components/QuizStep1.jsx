import React from 'react';
import { COMMUTE_TYPES } from '../constants/ecoConstants';

/**
 * Step 1 of the quiz: Commute & travel inputs.
 *
 * @component
 * @param {Object} props
 * @param {string} props.distance - Weekly commute distance in km
 * @param {Function} props.setDistance - Setter for commute distance
 * @param {string} props.type - Selected vehicle/commute type
 * @param {Function} props.setType - Setter for commute type
 * @returns {React.ReactElement}
 */
export default function QuizStep1({ distance, setDistance, type, setType }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <p>How do you travel on a weekly basis, and what is your typical mileage?</p>
      
      <div>
        <label 
          htmlFor="commute-distance" 
          style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--green-primary)' }}
        >
          Weekly Commute Distance (km)
        </label>
        <input 
          type="number" 
          id="commute-distance"
          min="0"
          max="2000"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-gold)',
            background: 'var(--bg-primary)',
            fontSize: '1rem',
            color: 'var(--text-primary)'
          }}
          required
        />
      </div>

      <div>
        <label 
          htmlFor="commute-type" 
          style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--green-primary)' }}
        >
          Primary Mode of Transportation
        </label>
        <select 
          id="commute-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
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
          {COMMUTE_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
