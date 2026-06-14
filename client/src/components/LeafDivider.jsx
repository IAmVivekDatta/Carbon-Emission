import React from 'react';

/**
 * Reusable decorative LeafDivider component drawing fine gold/green lines.
 */
export default function LeafDivider({ color = 'var(--gold-primary)', width = '100%', className = '' }) {
  return (
    <div className={`flex justify-center items-center py-6 ${className}`} style={{ width, margin: '0 auto' }}>
      <svg 
        width="120" 
        height="24" 
        viewBox="0 0 120 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Leaf stems and center outline */}
        <path 
          d="M10 12C25 12 40 12 60 12C80 12 95 12 110 12" 
          stroke={color} 
          strokeWidth="1" 
          strokeLinecap="round"
        />
        {/* Leaf shapes */}
        <path 
          d="M60 12C60 12 52 4 48 12C44 20 40 12 40 12" 
          stroke={color} 
          strokeWidth="1" 
          strokeLinejoin="round"
        />
        <path 
          d="M60 12C60 12 68 4 72 12C76 20 80 12 80 12" 
          stroke={color} 
          strokeWidth="1" 
          strokeLinejoin="round"
        />
        {/* Small gold bud */}
        <circle cx="60" cy="12" r="3" fill="var(--gold-primary)" />
      </svg>
    </div>
  );
}
