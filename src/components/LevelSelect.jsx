import React from 'react';
import { ArrowLeft, Play, Lock, Zap } from 'lucide-react';
import { levels } from '../utils/levels';

const LevelSelect = ({ onSelectLevel, onBack, unlockedLevels = [1] }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      zIndex: 10
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          padding: '36px 32px',
          background: 'rgba(10, 10, 16, 0.8)',
          borderRadius: '28px',
          border: '1px solid rgba(0, 229, 255, 0.15)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}
      >
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={onBack}
              className="neon-btn"
              style={{ padding: '8px 14px', borderRadius: '10px' }}
            >
              <ArrowLeft size={16} /> BACK
            </button>
            <h2 style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '1.5rem',
              fontWeight: '900',
              letterSpacing: '2px',
              margin: 0
            }}>
              SELECT LEVEL
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontFamily: 'var(--font-hud)' }}>
            <Zap size={14} /> 6 STAGES COMPILED
          </div>
        </header>

        {/* Level Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '20px',
          maxHeight: '380px',
          overflowY: 'auto',
          paddingRight: '6px'
        }}>
          {levels.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.id);

            return (
              <div 
                key={level.id}
                onClick={() => isUnlocked && onSelectLevel(level)}
                style={{
                  background: isUnlocked ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.3)',
                  border: isUnlocked 
                    ? '1px solid rgba(255, 255, 255, 0.06)' 
                    : '1px solid rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: isUnlocked ? 1 : 0.45
                }}
                className={isUnlocked ? "glass-card-hover" : ""}
                onMouseEnter={(e) => {
                  if (isUnlocked) {
                    e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isUnlocked) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                {/* Visual Level indicator */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-hud)',
                    fontSize: '1.25rem',
                    fontWeight: '900',
                    color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)'
                  }}>
                    STG {String(level.id).padStart(2, '0')}
                  </span>
                  
                  {isUnlocked ? (
                    <Play size={14} fill="var(--accent-cyan)" color="var(--accent-cyan)" />
                  ) : (
                    <Lock size={14} color="var(--text-muted)" />
                  )}
                </div>

                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  color: isUnlocked ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  marginBottom: '8px'
                }}>
                  {level.name}
                </h3>
                
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.4'
                }}>
                  {level.description.substring(0, 60)}...
                </p>

                {/* Subtle visual lighting indicator */}
                {isUnlocked && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
