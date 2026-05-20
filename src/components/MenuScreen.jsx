import React, { useRef, useEffect, useState } from 'react';

const MenuScreen = ({ onStartGame, onSelectLevels, onOpenSettings, onOpenHelp }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [glowPhase, setGlowPhase] = useState(0);

  // ── Canvas Starfield + Magnetic rings animation ──────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      spd: Math.random() * 0.00008 + 0.00003,
      pulse: Math.random() * Math.PI * 2,
      color: ['#ffffff', '#00e5ff', '#ff3b30', '#bf5af2'][Math.floor(Math.random() * 4)]
    }));

    // Magnetic field rings (emanating from center)
    const rings = Array.from({ length: 5 }, (_, i) => ({
      phase: (i / 5) * Math.PI * 2,
      speed: 0.008 + i * 0.003,
      baseR: 60 + i * 20,
      maxR: 280
    }));

    let t = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H * 0.38;

      ctx.clearRect(0, 0, W, H);

      // Deep space background
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, H / 2, Math.max(W, H) * 0.8);
      bgGrad.addColorStop(0, 'rgba(8, 8, 24, 0.98)');
      bgGrad.addColorStop(0.4, 'rgba(4, 4, 12, 0.98)');
      bgGrad.addColorStop(1, 'rgba(2, 2, 8, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Nebula glow behind logo
      const nebula1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      nebula1.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
      nebula1.addColorStop(0.5, 'rgba(0, 229, 255, 0.03)');
      nebula1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, W, H);

      const nebula2 = ctx.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, 220);
      nebula2.addColorStop(0, 'rgba(255, 59, 48, 0.05)');
      nebula2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, W, H);

      const nebula3 = ctx.createRadialGradient(W * 0.1, H * 0.6, 0, W * 0.1, H * 0.6, 180);
      nebula3.addColorStop(0, 'rgba(191, 90, 242, 0.04)');
      nebula3.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula3;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (const s of stars) {
        s.pulse += s.spd * 60;
        const alpha = 0.45 + Math.sin(s.pulse) * 0.45;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Magnetic force rings emanating from logo center
      t += 0.018;
      for (const ring of rings) {
        ring.phase += ring.speed;
        const progress = (Math.sin(ring.phase) * 0.5 + 0.5);
        const r = ring.baseR + progress * (ring.maxR - ring.baseR);
        const alpha = (1 - progress) * 0.35;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00e5ff';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Complementary red ring slightly offset
        ctx.save();
        ctx.globalAlpha = alpha * 0.5;
        ctx.strokeStyle = '#ff3b30';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Rotating field lines
      for (let i = 0; i < 8; i++) {
        const angle = t * 0.5 + (i / 8) * Math.PI * 2;
        const innerR = 40;
        const outerR = 120 + Math.sin(t + i) * 20;
        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * outerR;
        const y2 = cy + Math.sin(angle) * outerR;

        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = i % 2 === 0 ? '#00e5ff' : '#ff3b30';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Glow phase for title pulse
  useEffect(() => {
    const id = setInterval(() => setGlowPhase(p => p + 0.05), 50);
    return () => clearInterval(id);
  }, []);

  const titleGlow = 0.5 + Math.sin(glowPhase) * 0.5;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      zIndex: 10
    }}>
      {/* Full-screen canvas background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Main content panel */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '540px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0'
      }}>
        {/* === TITLE BLOCK === */}
        <div style={{
          textAlign: 'center',
          marginBottom: '28px'
        }}>
          {/* Subtitle above */}
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.65rem',
            letterSpacing: '6px',
            color: 'rgba(0, 229, 255, 0.7)',
            textTransform: 'uppercase',
            marginBottom: '10px',
            textShadow: '0 0 12px rgba(0, 229, 255, 0.4)'
          }}>
            ◈ MAGNETIC VECTOR PUZZLER ◈
          </div>

          {/* MAGNASHIFT title */}
          <h1 style={{
            fontFamily: 'var(--font-hud)',
            fontSize: 'clamp(3rem, 8vw, 4.5rem)',
            fontWeight: '900',
            lineHeight: '1',
            letterSpacing: '4px',
            background: `linear-gradient(135deg, #ffffff 0%, #a8d8ff 30%, #00e5ff 60%, #00a8cc 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 0 ${8 + titleGlow * 14}px rgba(0, 229, 255, ${0.4 + titleGlow * 0.35})) drop-shadow(0 2px 8px rgba(0,0,0,0.8))`,
            margin: 0,
            userSelect: 'none'
          }}>
            MAGNA<span style={{
              background: 'linear-gradient(135deg, #00e5ff 0%, #ffffff 50%, #ff3b30 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>SHIFT</span>
          </h1>

          {/* MAGNET ESCAPE subtitle */}
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.78rem',
            fontWeight: '500',
            letterSpacing: '8px',
            color: 'rgba(255, 255, 255, 0.55)',
            textTransform: 'uppercase',
            marginTop: '8px',
            textShadow: '0 0 8px rgba(0,229,255,0.2)'
          }}>
            MAGNET&nbsp;&nbsp;ESCAPE
          </div>
        </div>

        {/* === FEATURE BADGES === */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '28px'
        }}>
          <span className="feature-badge cyan">⬡ 20 LEVELS</span>
          <span className="feature-badge red">⚡ PHYSICS ENGINE</span>
          <span className="feature-badge green">♪ WEB AUDIO</span>
          <span className="feature-badge purple">✦ HD PARTICLES</span>
        </div>

        {/* === GLASS PANEL === */}
        <div className="glass-panel" style={{
          width: '100%',
          padding: '32px 28px 28px',
          borderColor: 'rgba(0, 229, 255, 0.2)',
          boxShadow: `
            0 25px 70px rgba(0,0,0,0.8),
            0 0 0 1px rgba(0, 229, 255, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 0 60px rgba(0, 229, 255, ${0.04 + titleGlow * 0.05})
          `
        }}>
          {/* Scan pulse */}
          <div className="scanline-pulse" />

          {/* Polarity indicator orbs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '24px',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #66f3ff 0%, #00e5ff 40%, #004455 100%)',
                boxShadow: `0 0 ${12 + titleGlow * 10}px rgba(0, 229, 255, ${0.6 + titleGlow * 0.3}), 0 0 4px #00e5ff inset`,
                border: '2px solid rgba(0, 229, 255, 0.6)'
              }} />
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.52rem', color: '#00e5ff', letterSpacing: '2px' }}>PULL</span>
            </div>

            <div style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '2px'
            }}>⟷</div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #ff9d98 0%, #ff3b30 40%, #440008 100%)',
                boxShadow: `0 0 ${12 + titleGlow * 8}px rgba(255, 59, 48, ${0.5 + titleGlow * 0.3}), 0 0 4px #ff3b30 inset`,
                border: '2px solid rgba(255, 59, 48, 0.6)'
              }} />
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.52rem', color: '#ff3b30', letterSpacing: '2px' }}>PUSH</span>
            </div>
          </div>

          {/* Description */}
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            textAlign: 'center',
            marginBottom: '28px',
            padding: '0 4px',
            fontFamily: 'var(--font-body)'
          }}>
            Toggle magnetic polarity to attract or repel steel cores through 20 sectors of increasingly complex physics puzzles.
          </p>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent)',
            marginBottom: '24px'
          }} />

          {/* Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%'
          }}>
            {/* START button */}
            <button
              onClick={onStartGame}
              className="neon-btn cyan-active"
              style={{
                fontSize: '1rem',
                padding: '18px',
                borderRadius: '14px',
                letterSpacing: '3px',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '1.2em' }}>▶</span>
              INITIATE SEQUENCE
            </button>

            {/* HOW TO PLAY */}
            <button
              onClick={onOpenHelp}
              className="neon-btn"
              style={{
                fontSize: '0.82rem',
                padding: '14px',
                borderRadius: '12px',
                width: '100%',
                borderColor: 'rgba(0, 229, 255, 0.25)',
                color: 'rgba(0, 229, 255, 0.8)'
              }}
            >
              <span>◎</span>
              HOW TO PLAY
            </button>

            {/* LEVELS + SETTINGS row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <button
                onClick={onSelectLevels}
                className="neon-btn"
                style={{ padding: '13px', fontSize: '0.78rem', borderRadius: '12px' }}
              >
                <span>⊞</span>
                SECTORS
              </button>
              <button
                onClick={onOpenSettings}
                className="neon-btn"
                style={{ padding: '13px', fontSize: '0.78rem', borderRadius: '12px' }}
              >
                <span>⚙</span>
                SETTINGS
              </button>
            </div>
          </div>
        </div>

        {/* === BOTTOM STATUS BAR === */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 4px'
        }}>
          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.55rem',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}>
            SX-CORE v1.0.0
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#32d74b',
              boxShadow: '0 0 6px #32d74b',
              animation: 'pulseCyan 2s ease-in-out infinite'
            }} />
            <span style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.55rem',
              color: 'rgba(50, 215, 75, 0.7)',
              letterSpacing: '1.5px'
            }}>SYSTEM ONLINE</span>
          </div>

          <div style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.55rem',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}>
            20 SECTORS
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;
