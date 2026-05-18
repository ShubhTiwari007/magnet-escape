import React, { useEffect, useState } from 'react';
import { Radio, Loader2, ShieldCheck } from 'lucide-react';

const AdBreakScreen = ({ onAdComplete }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // 3-second automatic ad break simulation
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onAdComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAdComplete]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      zIndex: 10000
    }}>
      {/* Background Cyber elements */}
      <div className="grid-overlay" />
      <div className="scanlines" />

      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '48px 36px',
          textAlign: 'center',
          background: 'rgba(10, 10, 16, 0.9)',
          borderRadius: '28px',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 229, 255, 0.08)'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--accent-cyan)',
          filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))',
          marginBottom: '28px'
        }}>
          <Radio size={48} className="spin-slow" />
        </div>

        <span style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '0.75rem',
          color: 'var(--accent-cyan)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '10px'
        }}>
          TELEMETRY SYNCHRONIZATION
        </span>

        <h2 style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '1.8rem',
          fontWeight: '900',
          letterSpacing: '1px',
          color: 'white',
          marginBottom: '16px'
        }}>
          AD BREAK ACTIVE
        </h2>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          marginBottom: '36px',
          padding: '0 12px'
        }}>
          CrazyGames SDK Slot triggered. Actual ads will be loaded at this placeholder by the portal script integration.
        </p>

        {/* Circular Progress countdown */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '10px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-hud)'
          }}>
            <Loader2 size={14} className="spin" /> RESUMING GAMEPLAY IN {countdown}S...
          </div>
          
          {/* Progress bar container */}
          <div style={{
            width: '180px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(countdown / 3) * 100}%`,
              height: '100%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 8px var(--accent-cyan)',
              transition: 'width 1s linear'
            }} />
          </div>
        </div>

        {/* Developer Integration Tag */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(50, 215, 75, 0.5)',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-hud)',
          letterSpacing: '0.5px'
        }}>
          <ShieldCheck size={12} /> DEV NOTE: BIND `crazygames.SDK.gameplayAd()` HERE
        </div>
      </div>
    </div>
  );
};

export default AdBreakScreen;
