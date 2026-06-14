import React from 'react';
import { ELECTRICITY_BILLS, HEATING_SOURCES } from '../constants/ecoConstants';

/**
 * Step 3 of the quiz: Home energy options.
 *
 * @component
 * @param {Object} props
 * @param {string} props.electricityBill - Monthly bill level
 * @param {Function} props.setElectricityBill - Setter for monthly bill level
 * @param {string} props.heatingSource - Heating source option
 * @param {Function} props.setHeatingSource - Setter for heating source
 * @returns {React.ReactElement}
 */
export default function QuizStep3({ 
  electricityBill, 
  setElectricityBill, 
  heatingSource, 
  setHeatingSource 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <p>Tell us about your home electricity bills and heating sources.</p>

      <div>
        <label 
          htmlFor="electricity-bill" 
          style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--green-primary)' }}
        >
          Estimated Monthly Electricity Bill
        </label>
        <select 
          id="electricity-bill"
          value={electricityBill}
          onChange={(e) => setElectricityBill(e.target.value)}
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
          {ELECTRICITY_BILLS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label 
          htmlFor="heating-source" 
          style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--green-primary)' }}
        >
          Main Home Heating & Cooling Source
        </label>
        <select 
          id="heating-source"
          value={heatingSource}
          onChange={(e) => setHeatingSource(e.target.value)}
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
          {HEATING_SOURCES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
