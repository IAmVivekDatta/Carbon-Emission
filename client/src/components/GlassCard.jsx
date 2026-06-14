import React from 'react';

/**
 * Reusable GlassCard component with premium style tokens
 */
export default function GlassCard({ 
  children, 
  className = '', 
  padding = '24px', 
  leafCorner = false,
  as: Component = 'div',
  ...props 
}) {
  const customStyles = {
    padding,
    borderRadius: leafCorner ? 'var(--radius-leaf)' : 'var(--radius-md)'
  };

  return (
    <Component 
      className={`glass-panel ${className}`} 
      style={customStyles}
      {...props}
    >
      {children}
    </Component>
  );
}
