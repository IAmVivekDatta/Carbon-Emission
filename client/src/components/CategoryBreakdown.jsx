import React from 'react';
import GlassCard from './GlassCard';
import ProgressBar from './ProgressBar';

/**
 * CategoryBreakdown component showing carbon emissions per category.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.categories - Categories emissions map
 * @param {number} props.total - Baseline emissions
 * @returns {React.ReactElement}
 */
function CategoryBreakdown({ categories, total }) {
  const categoryItems = [
    { emoji: '🚘', label: 'Commute & Travel', value: categories.commute },
    { emoji: '🥗', label: 'Diet & Food',      value: categories.diet },
    { emoji: '⚡', label: 'Home Energy',       value: categories.homeEnergy },
    { emoji: '🛍️', label: 'Shopping & Consumables', value: categories.shopping },
    { emoji: '🗑️', label: 'Waste & Compost',  value: categories.waste }
  ];

  return (
    <GlassCard leafCorner={false} padding="24px">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--green-primary)' }}>Emissions by Category</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categoryItems.map(({ emoji, label, value }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
              <span>{emoji} {label}</span>
              <span style={{ fontWeight: '600' }}>{value} kg</span>
            </div>
            <ProgressBar value={value} max={total} height="6px" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default React.memo(CategoryBreakdown);
