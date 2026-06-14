import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import ProgressBar from '../components/ProgressBar';
import QuizStep1 from '../components/QuizStep1';
import QuizStep2 from '../components/QuizStep2';
import QuizStep3 from '../components/QuizStep3';
import QuizStep4 from '../components/QuizStep4';

/**
 * Multi-step onboarding quiz component decomposed into step subcomponents.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onSubmit - Submission callback to pass payload to App
 * @returns {React.ReactElement}
 */
export default function Quiz({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  
  // Form States
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
          {step === 1 && (
            <QuizStep1 
              distance={commuteDistance} 
              setDistance={setCommuteDistance} 
              type={commuteType} 
              setType={setCommuteType} 
            />
          )}

          {step === 2 && (
            <QuizStep2 
              dietType={dietType} 
              setDietType={setDietType} 
            />
          )}

          {step === 3 && (
            <QuizStep3 
              electricityBill={electricityBill} 
              setElectricityBill={setElectricityBill} 
              heatingSource={heatingSource} 
              setHeatingSource={setHeatingSource} 
            />
          )}

          {step === 4 && (
            <QuizStep4 
              shoppingFrequency={shoppingFrequency} 
              setShoppingFrequency={setShoppingFrequency} 
              recycling={recycling} 
              setRecycling={setRecycling} 
            />
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
