import React, { useState } from 'react';
import { X, Volume2, ShieldCheck, Zap, Sliders } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, onSavePhysics, initialPhysics = {} }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Custom physics constants tweaked by the geek player
  const [strength, setStrength] = useState(initialPhysics.strength || 280);
  const [bounce, setBounce] = useState(initialPhysics.bounce || 0.35);
  const [friction, setFriction] = useState(initialPhysics.friction || 0.985);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePhysics({
      strength: Number(strength),
      bounce: Number(bounce),
      friction: Number(friction),
      soundEnabled
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 5, 8, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '32px',
          background: 'rgba(12, 12, 20, 0.9)',
          borderRadius: '24px',
          border: '1px solid rgba(0, 229, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 229, 255, 0.05)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={18} color="var(--accent-cyan)" />
            <h2 style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '1.25rem',
              fontWeight: '900',
              letterSpacing: '1.5px',
              margin: 0
            }}>
              SYSTEM SETTINGS
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff3b30'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={20} />
          </button>
        </header>

        {/* Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Audio Section */}
          <div>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', letterSpacing: '1px', marginBottom: '12px' }}>
              AUDIO PREFERENCES
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '16px 20px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Volume2 size={18} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Synthesizer Audio FX</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Play real-time synthesized acoustic pulses</div>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  accentColor: 'var(--accent-cyan)'
                }}
              />
            </div>
          </div>

          {/* Physics Customizer (Geek Mode!) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', letterSpacing: '1px', margin: 0 }}>
                PHYSICS OVERRIDES (GEEK MODE)
              </h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-hud)', border: '1px solid rgba(175, 82, 222, 0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                REAL-TIME
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.04)'
            }}>
              {/* Slider 1: Magnetic anchor Force */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Magnetic Force Power</span>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-hud)', fontWeight: 'bold' }}>{strength}</span>
                </div>
                <input 
                  type="range"
                  min="150"
                  max="450"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 2: Steel sphere bounce damping */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Elastic wall Bounce</span>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-hud)', fontWeight: 'bold' }}>{bounce}</span>
                </div>
                <input 
                  type="range"
                  min="0.10"
                  max="0.80"
                  step="0.05"
                  value={bounce}
                  onChange={(e) => setBounce(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 3: Air Resistance decay */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Wall Sliding Friction</span>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-hud)', fontWeight: 'bold' }}>{friction}</span>
                </div>
                <input 
                  type="range"
                  min="0.950"
                  max="0.995"
                  step="0.001"
                  value={friction}
                  onChange={(e) => setFriction(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <footer style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-muted)',
              padding: '12px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.8rem',
              letterSpacing: '1px'
            }}
          >
            CANCEL
          </button>
          
          <button 
            onClick={handleSave}
            className="neon-btn cyan-active"
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '0.8rem'
            }}
          >
            <ShieldCheck size={16} /> SAVE CONFIG
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
