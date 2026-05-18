import React from 'react';
import { ArrowLeft, Heart, Info, RefreshCw, Zap } from 'lucide-react';

const GameUI = ({ 
  level, 
  lives, 
  onBackToMenu, 
  onResetLevel,
  currentLevelIndex,
  totalLevels
}) => {
  if (!level) return null;

  return (
    <div style={{
      width: '100%',
      maxWidth: '720px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative',
      zIndex: 10,
      marginBottom: '10px'
    }}>
      {/* Top Glass Panel HUD Header */}
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: 'rgba(10, 10, 16, 0.75)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 229, 255, 0.1)'
        }}
      >
        {/* Left Side: Exit Button & Level Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onBackToMenu}
            className="neon-btn"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <ArrowLeft size={14} /> EXIT
          </button>
          
          <div>
            <span style={{ 
              fontSize: '9px', 
              color: 'var(--accent-cyan)', 
              fontFamily: 'var(--font-hud)', 
              fontWeight: '900',
              letterSpacing: '1px'
            }}>
              STAGE {currentLevelIndex} OF {totalLevels}
            </span>
            <h2 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '900', 
              color: '#ffffff', 
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {level.name}
            </h2>
          </div>
        </div>

        {/* Right Side: Hearts/Lives Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Energy core lives count */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ 
              fontSize: '8px', 
              color: 'var(--text-muted)', 
              fontFamily: 'var(--font-hud)', 
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              marginBottom: '3px'
            }}>
              STABILITY CORES
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3].map((heartIndex) => {
                const isActive = heartIndex <= lives;
                return (
                  <div 
                    key={heartIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#ff3b30' : '#2c2c2e',
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(255, 59, 48, 0.75))' : 'none',
                      transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      transform: isActive ? 'scale(1)' : 'scale(0.8)'
                    }}
                  >
                    <Heart size={18} fill={isActive ? '#ff3b30' : 'none'} strokeWidth={isActive ? 0 : 2} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Level Description Tip box */}
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
          padding: '12px 20px',
          background: 'rgba(20, 20, 30, 0.4)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <div style={{ color: 'var(--accent-cyan)', marginTop: '2px' }}><Info size={16} /></div>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.85rem', 
          lineHeight: '1.4',
          margin: 0
        }}>
          <strong>TACTICAL INTEL:</strong> {level.description}
        </p>
      </div>
    </div>
  );
};

export default GameUI;
