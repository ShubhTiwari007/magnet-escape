import React from 'react';
import { Play, Grid, Settings, Info, ShieldAlert } from 'lucide-react';

const MenuScreen = ({ onStartGame, onSelectLevels, onOpenSettings, onOpenHelp }) => {
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
      {/* Visual cyber branding panel */}
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '48px 32px',
          textAlign: 'center',
          background: 'rgba(10, 10, 16, 0.8)',
          borderRadius: '32px',
          border: '1px solid rgba(0, 229, 255, 0.15)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(0, 229, 255, 0.05)'
        }}
      >
        {/* Futuristic neon scanline lines */}
        <div className="scanline-pulse" />

        {/* Title */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.75rem',
            color: 'var(--accent-cyan)',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px',
            textShadow: '0 0 10px rgba(0, 229, 255, 0.4)'
          }}>
            MAGNETIC VECTOR PUZZLER
          </span>
          <h1 style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '3.4rem',
            fontWeight: '900',
            lineHeight: '1.0',
            letterSpacing: '2px',
            background: 'linear-gradient(135deg, #ffffff 0%, #a2a9b8 50%, #00e5ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 12px rgba(0, 229, 255, 0.3))',
            margin: 0
          }}>
            MAGNA<br/>SHIFT
          </h1>
        </div>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          lineHeight: '1.5',
          marginBottom: '40px',
          padding: '0 12px'
        }}>
          Control polarity to pull or push steel cores. Solve challenging vector calculations, unlock physical switches, and avoid vaporizing traps.
        </p>

        {/* Menu Buttons list */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%'
        }}>
          <button 
            onClick={onStartGame}
            className="neon-btn cyan-active"
            style={{
              fontSize: '1.05rem',
              padding: '16px',
              borderRadius: '16px'
            }}
          >
            <Play size={18} fill="currentColor" /> INITIATE ENGINE
          </button>

          <button 
            onClick={onOpenHelp}
            className="neon-btn"
            style={{
              fontSize: '0.95rem',
              padding: '14px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              color: 'var(--accent-cyan)'
            }}
          >
            <Info size={16} /> HOW TO PLAY
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <button 
              onClick={onSelectLevels}
              className="neon-btn"
              style={{ padding: '14px' }}
            >
              <Grid size={16} /> LEVELS
            </button>
            <button 
              onClick={onOpenSettings}
              className="neon-btn"
              style={{ padding: '14px' }}
            >
              <Settings size={16} /> SETTINGS
            </button>
          </div>
        </div>

        {/* Cyber bottom footer disclaimer */}
        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255, 255, 255, 0.25)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-hud)',
          letterSpacing: '1px'
        }}>
          <ShieldAlert size={12} /> SX-SYSTEM STATUS: SECURE (v1.0.0)
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;
