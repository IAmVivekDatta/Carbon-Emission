import React, { useMemo } from 'react';
import GlassCard from './GlassCard';

/**
 * TrendChart component that visualizes emission reduction progress using SVG.
 * Wrapped in React.memo to prevent unnecessary calculations.
 *
 * @component
 * @param {Object} props
 * @param {number} props.total - Baseline emissions
 * @param {number} props.currentEmissions - Current emissions after adjustments
 * @param {number} props.benchmark - Target benchmark level
 * @returns {React.ReactElement}
 */
function TrendChart({ total, currentEmissions, benchmark }) {
  const chartWidth = 500;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const chartData = useMemo(() => {
    const weekData = [
      { label: 'Base', val: total },
      { label: 'Wk 1', val: Math.round((total * 0.98) * 10) / 10 },
      { label: 'Wk 2', val: Math.round((total * 0.96) * 10) / 10 },
      { label: 'Wk 3', val: Math.round((total * 0.94) * 10) / 10 },
      { label: 'Wk 4', val: Math.round((total * 0.92) * 10) / 10 },
      { label: 'Now',  val: currentEmissions }
    ];

    const maxVal = Math.max(...weekData.map(d => d.val), benchmark) * 1.1;
    const minVal = Math.min(...weekData.map(d => d.val)) * 0.8;

    const pts = weekData.map((d, index) => {
      const x = paddingX + (index * (chartWidth - 2 * paddingX) / (weekData.length - 1));
      const y = chartHeight - paddingY - ((d.val - minVal) * (chartHeight - 2 * paddingY) / (maxVal - minVal));
      return { x, y, ...d };
    });

    const path = pts.reduce((p, pt, i) => i === 0 ? `M ${pt.x} ${pt.y}` : `${p} L ${pt.x} ${pt.y}`, '');
    const area = `${path} L ${pts[pts.length - 1].x} ${chartHeight - paddingY} L ${pts[0].x} ${chartHeight - paddingY} Z`;
    const bmY  = chartHeight - paddingY - ((benchmark - minVal) * (chartHeight - 2 * paddingY) / (maxVal - minVal));

    return {
      pathD: path,
      areaD: area,
      points: pts,
      benchmarkY: bmY
    };
  }, [total, currentEmissions, benchmark]);

  return (
    <GlassCard leafCorner={false} padding="24px">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--green-primary)' }}>Emissions Reduction Trend</h2>
      <div style={{ width: '100%' }}>
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          style={{ width: '100%', height: 'auto' }}
          aria-label="Emissions reduction graph from baseline to current"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--green-medium)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--green-medium)" stopOpacity="0.00" />
            </linearGradient>
          </defs>
          <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="var(--border-light)" strokeWidth="1" />
          <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="var(--border-light)" strokeWidth="0.5" strokeDasharray="3" />
          <line x1={paddingX} y1={chartData.benchmarkY} x2={chartWidth - paddingX} y2={chartData.benchmarkY} stroke="var(--gold-primary)" strokeWidth="1.2" strokeDasharray="4 4" />
          <path d={chartData.areaD} fill="url(#chartGradient)" />
          <path d={chartData.pathD} fill="none" stroke="var(--green-medium)" strokeWidth="2.5" strokeLinecap="round" />
          {chartData.points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="var(--bg-primary)" stroke="var(--green-light)" strokeWidth="2" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--green-primary)">{p.val}</text>
              <text x={p.x} y={chartHeight - 8} textAnchor="middle" fontSize="9" fill="var(--text-secondary)">{p.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </GlassCard>
  );
}

export default React.memo(TrendChart);
