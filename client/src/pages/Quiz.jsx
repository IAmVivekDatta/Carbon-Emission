import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import ProgressBar from '../components/ProgressBar';

/**
 * Multi-step onboarding quiz component
 */
export default function Quiz({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  
  // Form State
  const [commuteDistance, setCommuteDistance] = useState('50');
  const [commuteType, setCommuteType] = useState('petrol');
  const [dietType, setDietType] = useState('low-meat');
  const [electricityBill, setElectricityBill] = useState('medium');
  const [heatingSource, setHeatingSource] = useState('electricity');
  const [shoppingFrequency, setShoppingFrequency] = useState('moderate');
  const [recycling, setRecycling] = useState('partial');

  const totalSteps = 4;

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    // Step-specific validation
    if (step === 1) {
      const dist = parseFloat(commuteDistance);
      if (isNaN(dist) || dist < 0) {
        setError('Please enter a valid weekly distance (0 or more).');
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit form
      const payload = {
        commute: {
          distance: parseFloat(commuteDistance),
          type: commuteType
        },
        diet: {
          type: dietType
        },
        homeEnergy: {
          electricityBill,
          heatingSource
        },
        shopping: {
          frequency: shoppingFrequency
        },
        waste: {
          recycling
        }
      };
      onSubmit(payload);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setError('');
      setStep(step - 1);
    }
  };

  return (
    <main className="container section animate-fade" style={{ maxWidth: '650px' }}>
      <GlassCard leafCorner={true} padding="40px">
        {/* Progress Header */}
        <div style={{ marginBottom: '32px' }}>
          <span 
            style={{ 
              fontSize: '0.85rem', 
              fontWeight: '600', 
              color: 'var(--gold-primary)', 
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'block',
              marginBottom: '6px'
            }}
          >
            Step {step} of {totalSteps}
          </span>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
            {step === 1 && "Your Travel Carbon footprint"}
            {step === 2 && "Your Culinary Carbon footprint"}
            {step === 3 && "Your Home Energy Profile"}
            {step === 4 && "Your Consumption & Waste"}
          </h2>
          <ProgressBar value={step - 1} max={totalSteps - 1} height="6px" />
        </div>

        {error && (
          <div 
            style={{ 
              backgroundColor: '#FDF2F2', 
              border: '1px solid #F8B4B4', 
              color: '#9B1C1C', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleNext}>
          {/* STEP 1: COMMUTE */}
          {step === 1 && (
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
                  value={commuteDistance}
                  onChange={(e) => setCommuteDistance(e.target.value)}
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
                  value={commuteType}
                  onChange={(e) => setCommuteType(e.target.value)}
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
                  <option value="petrol">Gasoline / Petrol Car</option>
                  <option value="diesel">Diesel Car</option>
                  <option value="electric">Electric Vehicle (EV)</option>
                  <option value="public">Public Transport (Train/Bus)</option>
                  <option value="active">Active Transit (Biking/Walking)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: DIET */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <p>Which option best describes your general eating patterns?</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { value: 'heavy-meat', label: 'Meat-Loving', desc: 'Frequent beef, lamb, and pork meals' },
                  { value: 'low-meat', label: 'Flexitarian / Low-Meat', desc: 'Mostly poultry, fish, and vegetarian meals' },
                  { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat, but eats eggs and dairy products' },
                  { value: 'vegan', label: 'Vegan', desc: 'Strictly plant-based nutrition' }
                ].map(option => (
                  <label 
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: dietType === option.value ? 'var(--gold-primary)' : 'var(--border-light)',
                      backgroundColor: dietType === option.value ? 'var(--green-soft)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="diet" 
                      value={option.value} 
                      checked={dietType === option.value}
                      onChange={() => setDietType(option.value)}
                      style={{ marginTop: '4px', accentColor: 'var(--green-primary)' }}
                    />
                    <div>
                      <span style={{ display: 'block', fontWeight: '600', color: 'var(--green-primary)' }}>{option.label}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{option.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: HOME ENERGY */}
          {step === 3 && (
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
                  <option value="low">Low (Under $50 / ~150 kWh)</option>
                  <option value="medium">Medium ($50 - $120 / ~350 kWh)</option>
                  <option value="high">High (Over $120 / ~700 kWh)</option>
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
                  <option value="electricity">Electric Heat Pump / AC</option>
                  <option value="gas">Natural Gas Furnace</option>
                  <option value="solar">Solar Energy / Geothermal / None</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: CONSUMPTION & WASTE */}
          {step === 4 && (
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
                  <option value="minimalist">Minimalist (Buy only essentials, second-hand first)</option>
                  <option value="moderate">Average (Moderate buy-new rates)</option>
                  <option value="frequent">Frequent (Buy new items weekly)</option>
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
                  <option value="full">Full recycling & organic waste composting</option>
                  <option value="partial">Recycle basic items (paper, plastic)</option>
                  <option value="none">No sorting or recycling</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-light)'
            }}
          >
            {step > 1 ? (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleBack}
              >
                Back
              </button>
            ) : (
              <div /> // placeholder for alignment
            )}
            
            <button 
              type="submit" 
              className="btn btn-gold"
            >
              {step === totalSteps ? "Generate Profile" : "Continue"}
            </button>
          </div>
        </form>
      </GlassCard>
    </main>
  );
}
