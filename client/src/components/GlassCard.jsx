import React from 'react';

/**
 * Reusable GlassCard component with premium style tokens.
 * Wrapped in React.memo to prevent unnecessary re-renders.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card contents
 * @param {string} [props.className=''] - Additional class names
 * @param {string} [props.padding='24px'] - Card padding style
 * @param {boolean} [props.leafCorner=false] - Whether to use the custom botanical border-radius
 * @param {React.ElementType} [props.as='div'] - Element type to render
 * @param {Object} [props.style={}] - Additional custom styles to merge
 * @returns {React.ReactElement} The styled GlassCard component
 */
function GlassCard({ 
  children, 
  className = '', 
  padding = '24px', 
  leafCorner = false,
  as: Component = 'div',
  style = {},
  ...props 
}) {
  const mergedStyle = {
    padding,
    borderRadius: leafCorner ? 'var(--radius-leaf)' : 'var(--radius-md)',
    ...style
  };

  return (
    <Component 
      className={`glass-panel ${className}`} 
      style={mergedStyle}
      {...props}
    >
      {children}
    </Component>
  );
}

export default React.memo(GlassCard);

