import React from 'react';

/**
 * Reusable ProgressBar with calming green colors and accessibility values.
 */
export default function ProgressBar({ 
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
