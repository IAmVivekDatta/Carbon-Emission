import React from 'react';

/**
 * Reusable, accessible ProgressBar with calming green colors.
 * Wrapped in React.memo to prevent re-renders unless value/max changes.
 *
 * @component
 * @param {Object} props
 * @param {number} [props.value=0] - Current value
 * @param {number} [props.max=100] - Maximum value
 * @param {string} [props.height='8px'] - Bar height in CSS units
 * @param {boolean} [props.showPercentage=false] - Whether to show percentage label
 * @param {string} [props.label=''] - Accessible label text
 * @returns {React.ReactElement}
 */
function ProgressBar({ 
  value = 0, 
  max = 100, 
  height = '8px', 
  showPercentage = false,
  label = ''
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
          <span style={{ fontWeight: '500', color: 'var(--green-primary)' }}>{label}</span>
          {showPercentage && <span style={{ fontWeight: '600', color: 'var(--gold-primary)' }}>{percentage}%</span>}
        </div>
      )}
      <div 
        style={{ 
          width: '100%', 
          height, 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: '10px', 
          overflow: 'hidden',
          border: '1px solid rgba(17, 51, 34, 0.05)'
        }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label || "Progress bar"}
      >
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            backgroundColor: 'var(--green-medium)', 
            borderRadius: '10px',
            transition: 'width 0.4s ease-in-out'
          }} 
        />
      </div>
    </div>
  );
}

export default React.memo(ProgressBar);
