import React from 'react';
import { X, HelpCircle, Zap, RefreshCw, MousePointer, ShieldAlert, Award, Radio } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 5, 8, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '36px',
          background: 'rgba(12, 12, 22, 0.95)',
          borderRadius: '28px',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 229, 255, 0.08)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={20} color="var(--accent-cyan)" />
            <h2 style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '1.25rem',
              fontWeight: '900',
              letterSpacing: '1.5px',
              margin: 0
            }}>
              MISSION BRIEFING
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

        {/* Section 1: Objective */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-hud)', letterSpacing: '1px', marginBottom: '8px' }}>
            CORE MISSION OBJECTIVE
          </h3>
          <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Guide the hyper-conductive **Metallic Core Sphere** into the green **Exit Portal** at the end of each chamber by manipulating magnetic field lines.
          </p>
        </div>

        {/* Section 2: Controls & Polarity */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-hud)', letterSpacing: '1px', marginBottom: '12px' }}>
            OPERATIONAL CONTROLS
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ color: 'var(--accent-cyan)', marginTop: '2px' }}><MousePointer size={16} /></div>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                <strong>Reposition Anchor:</strong> Move your mouse or drag your finger inside the play area. The central <strong>Magnetic Anchor</strong> follows your cursor.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ color: 'var(--accent-cyan)', marginTop: '2px' }}><Zap size={16} /></div>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                <strong>Toggle Polarity:</strong> Click/Tap anywhere on the screen (or press <strong>Spacebar</strong> / <strong>P</strong> key) to cycle through:
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{ 
                    background: 'rgba(0, 229, 255, 0.1)', 
                    border: '1px solid var(--accent-cyan)', 
                    color: 'var(--accent-cyan)',
                    padding: '3px 8px', 
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-hud)',
                    fontWeight: 'bold'
                  }}>
                    🔵 PULL (ATTRACT)
                  </span>
                  
                  <span style={{ 
                    background: 'rgba(255, 59, 48, 0.1)', 
                    border: '1px solid var(--accent-red)', 
                    color: 'var(--accent-red)',
                    padding: '3px 8px', 
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-hud)',
                    fontWeight: 'bold'
                  }}>
                    🔴 PUSH (REPEL)
                  </span>

                  <span style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    color: 'var(--text-muted)',
                    padding: '3px 8px', 
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-hud)',
                    fontWeight: 'bold'
                  }}>
                    ⚪ MAGNET OFF
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ color: 'var(--accent-cyan)', marginTop: '2px' }}><RefreshCw size={16} /></div>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                <strong>Emergency Reset:</strong> Press the <strong>R</strong> key (or click the restart stage button) to instantly reboot cores and restart the current stage from the beginning.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Chamber Elements Legend */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-hud)', letterSpacing: '1px', marginBottom: '12px' }}>
            CHAMBER LEGENDS & HAZARDS
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.03)'
          }}>
            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#32d74b', boxShadow: '0 0 6px #32d74b' }} />
              <strong>Exit Portal:</strong> Reach to win.
            </div>

            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', background: '#ff9500', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', boxShadow: '0 0 6px #ff9500' }} />
              <strong>Spikes:</strong> Vaporizes core.
            </div>

            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '3px', background: '#ff3b30', boxShadow: '0 0 6px #ff3b30' }} />
              <strong>Laser Traps:</strong> vaporizes core.
            </div>

            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ff9500' }} />
              <strong>Pressure Buttons:</strong> Opens gates.
            </div>

            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#af52de', boxShadow: '0 0 6px #af52de' }} />
              <strong>Vortex Rotator:</strong> Spins cores in circular orbital slingshots.
            </div>
          </div>
        </div>

        {/* Actions */}
        <footer style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onClose}
            className="neon-btn cyan-active"
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              fontSize: '0.85rem'
            }}
          >
            <Award size={16} /> UNDERSTOOD, LAUNCH
          </button>
        </footer>
      </div>
    </div>
  );
};

export default HelpModal;
