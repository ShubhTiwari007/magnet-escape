import React, { useRef, useEffect, useState } from 'react';
import { 
  Vector, 
  calculateMagneticForce, 
  resolveMapCollisions, 
  testLaserIntersection 
} from '../utils/physics';
import { ParticleSystem } from '../utils/particles';
import { RefreshCw, Play, Volume2, Shield } from 'lucide-react';
import { crazyGamesSDK } from '../utils/crazyGamesSDK';

const GameCanvas = ({ 
  currentLevel, 
  onLevelComplete, 
  onGameOver, 
  onReset,
  lives,
  setLives,
  soundEnabled
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particleSystemRef = useRef(new ParticleSystem());
  
  // Game states inside the loop
  const [polarity, setPolarity] = useState('off'); // 'pull' (cyan), 'push' (red), 'off'
  const [levelState, setLevelState] = useState(null);
  const [screenShake, setScreenShake] = useState(0);
  const [showTutorialHint, setShowTutorialHint] = useState(true);

  // Keep ref to state for access in frame loop
  const stateRef = useRef({
    balls: [],
    exit: { x: 0, y: 0, radius: 24 },
    anchor: { x: 360, y: 220 },
    grid: [],
    lasers: [],
    buttons: [],
    doors: [],
    rotators: [],
    polarity: 'off',
    tileSize: 45,
    isComplete: false,
    deathTimer: null
  });

  // Stars for background (initialized once)
  const starsRef = useRef(
    Array.from({ length: 120 }, () => ({
      x: Math.random() * 720,
      y: Math.random() * 540,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005
    }))
  );

  // Motion trail for each ball
  const trailsRef = useRef({});

  // Load level configuration
  useEffect(() => {
    if (!currentLevel) return;

    const ballsCopy = currentLevel.balls.map(b => ({
      ...b,
      pos: { ...b.pos },
      vel: { ...b.vel },
      radius: b.radius,
      isDead: false
    }));

    const gridCopy = currentLevel.map.map(row => [...row]);
    const lasersCopy = currentLevel.lasers.map(l => ({ ...l, p1: { ...l.p1 }, p2: { ...l.p2 } }));
    const buttonsCopy = currentLevel.buttons.map(btn => ({ ...btn, pos: { ...btn.pos } }));
    const doorsCopy = currentLevel.doors.map(d => ({ ...d, pos: { ...d.pos }, size: { ...d.size } }));
    const rotatorsCopy = currentLevel.rotators.map(r => ({ ...r, pos: { ...r.pos } }));

    stateRef.current = {
      balls: ballsCopy,
      exit: { ...currentLevel.exit },
      anchor: { ...currentLevel.anchor },
      grid: gridCopy,
      lasers: lasersCopy,
      buttons: buttonsCopy,
      doors: doorsCopy,
      rotators: rotatorsCopy,
      polarity: 'off',
      tileSize: currentLevel.tileSize || 45,
      isComplete: false,
      deathTimer: null
    };

    // Clear trails
    trailsRef.current = {};
    ballsCopy.forEach(b => { trailsRef.current[b.id] = []; });

    setPolarity('off');
    particleSystemRef.current.clear();
    setScreenShake(0);
    setLevelState(currentLevel);
  }, [currentLevel, onReset]);

  // ─────────────────────────────────────────────────────
  // POLARITY TOGGLE
  // ─────────────────────────────────────────────────────
  const togglePolarity = () => {
    if (stateRef.current.isComplete) return;
    setPolarity(prev => {
      const next = prev === 'off' ? 'pull' : prev === 'pull' ? 'push' : 'off';
      stateRef.current.polarity = next;
      playSwitchSound(next);
      return next;
    });
  };

  const playSwitchSound = (mode) => {
    if (!soundEnabled || crazyGamesSDK.isMuted()) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (mode === 'pull') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(); osc.stop(ctx.currentTime + 0.12);
      } else if (mode === 'push') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start(); osc.stop(ctx.currentTime + 0.14);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start(); osc.stop(ctx.currentTime + 0.06);
      }
    } catch (e) {}
  };

  const playExplosionSound = () => {
    if (!soundEnabled || crazyGamesSDK.isMuted()) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      noise.start(); noise.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  const playCompleteSound = () => {
    if (!soundEnabled || crazyGamesSDK.isMuted()) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start(); osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') { e.preventDefault(); togglePolarity(); }
      if (e.code === 'KeyR')  { e.preventDefault(); onReset(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ─────────────────────────────────────────────────────
  // MAIN RENDER LOOP — PREMIUM VISUAL ENGINE
  // ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!levelState) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrameId;

    const gameLoop = () => {
      const state = stateRef.current;
      const particles = particleSystemRef.current;
      const tileSize = state.tileSize;
      const W = canvas.width;
      const H = canvas.height;
      const now = Date.now();

      // ── 1. PHYSICS UPDATE ──────────────────────────────────
      if (!state.isComplete && !state.deathTimer) {

        state.rotators.forEach(rotator => {
          rotator.angle += rotator.spinSpeed;
          if (Math.random() > 0.4) {
            const rotFluxAngle = rotator.angle + (Math.random() - 0.5) * 0.4;
            const rx = rotator.pos.x + Math.cos(rotFluxAngle) * rotator.radius;
            const ry = rotator.pos.y + Math.sin(rotFluxAngle) * rotator.radius;
            particles.addParticle(rx, ry, Math.cos(rotFluxAngle) * 2, Math.sin(rotFluxAngle) * 2, '#af52de', 1.5, 30, 'flux');
          }
        });

        state.balls.forEach(ball => {
          if (ball.isDead) return;

          ball.vel.x *= 0.985;
          ball.vel.y *= 0.985;

          const fMag = calculateMagneticForce(ball.pos, state.anchor, state.polarity, {
            strength: 280, minDist: 35, maxDist: 600
          });
          ball.vel.x += fMag.x;
          ball.vel.y += fMag.y;

          state.rotators.forEach(rotator => {
            const dist = Vector.dist(ball.pos, rotator.pos);
            if (dist < 220) {
              const dx = ball.pos.x - rotator.pos.x;
              const dy = ball.pos.y - rotator.pos.y;
              const tangentAngle = Math.atan2(dy, dx) + Math.PI / 2;
              const pullStrength = rotator.strength / (Math.max(dist, 40) * 0.05);
              ball.vel.x += Math.cos(tangentAngle) * pullStrength * 0.01;
              ball.vel.y += Math.sin(tangentAngle) * pullStrength * 0.01;
              const pullDir = Vector.normalize(Vector.sub(rotator.pos, ball.pos));
              ball.vel.x += pullDir.x * 0.03;
              ball.vel.y += pullDir.y * 0.03;
            }
          });

          ball.vel = Vector.limit(ball.vel, 12);
          resolveMapCollisions(ball, state.grid, tileSize);

          // Track motion trail
          if (!trailsRef.current[ball.id]) trailsRef.current[ball.id] = [];
          const trail = trailsRef.current[ball.id];
          trail.push({ x: ball.pos.x, y: ball.pos.y });
          if (trail.length > 10) trail.shift();

          const gridX = Math.floor(ball.pos.x / tileSize);
          const gridY = Math.floor(ball.pos.y / tileSize);
          if (
            gridY >= 0 && gridY < state.grid.length &&
            gridX >= 0 && gridX < state.grid[0].length &&
            state.grid[gridY][gridX] === 2
          ) {
            triggerCoreVaporization(ball);
            return;
          }

          state.buttons.forEach(btn => {
            const dist = Vector.dist(ball.pos, btn.pos);
            if (dist < ball.radius + btn.radius) {
              if (!btn.isPressed) {
                btn.isPressed = true;
                playSwitchSound('pull');
                const linkedDoor = state.doors.find(d => d.id === btn.targetDoorId);
                if (linkedDoor && !linkedDoor.isOpen) {
                  linkedDoor.isOpen = true;
                  state.grid[linkedDoor.gridY][linkedDoor.gridX] = 0;
                  setScreenShake(8);
                }
              }
            } else {
              if (btn.isPressed && dist > ball.radius + btn.radius + 5) {
                btn.isPressed = false;
                const linkedDoor = state.doors.find(d => d.id === btn.targetDoorId);
                if (linkedDoor && linkedDoor.isOpen) {
                  linkedDoor.isOpen = false;
                  state.grid[linkedDoor.gridY][linkedDoor.gridX] = 1;
                }
              }
            }
          });

          state.lasers.forEach(laser => {
            if (laser.active) {
              const hit = testLaserIntersection(laser.p1, laser.p2, ball.pos, ball.radius - 1);
              if (hit) triggerCoreVaporization(ball);
            }
          });

          if (state.polarity !== 'off') {
            particles.emitMagneticFlux(state.anchor, ball, state.polarity);
          }
        });

        particles.emitPortalAmbient(state.exit.x, state.exit.y, state.exit.radius);

        const allInExit = state.balls.every(ball => {
          if (ball.isDead) return false;
          return Vector.dist(ball.pos, state.exit) < state.exit.radius - 4;
        });

        if (allInExit && state.balls.length > 0) {
          state.isComplete = true;
          playCompleteSound();
          particles.emitCelebration(state.exit.x, state.exit.y);
          setScreenShake(12);
          setTimeout(() => onLevelComplete(), 1800);
        }
      }

      particles.update();
      setScreenShake(prev => Math.max(0, prev - 0.5));

      // ── 2. RENDERING ────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      ctx.save();

      // Screen shake
      if (screenShake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * screenShake,
          (Math.random() - 0.5) * screenShake
        );
      }

      // ══ BACKGROUND: Deep Space ══
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#030308');
      bgGrad.addColorStop(0.5, '#04040c');
      bgGrad.addColorStop(1, '#030308');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Nebula corner glows
      const nebulaTL = ctx.createRadialGradient(0, 0, 0, 0, 0, 220);
      nebulaTL.addColorStop(0, 'rgba(0, 229, 255, 0.06)');
      nebulaTL.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaTL;
      ctx.fillRect(0, 0, 220, 220);

      const nebulaBR = ctx.createRadialGradient(W, H, 0, W, H, 220);
      nebulaBR.addColorStop(0, 'rgba(255, 59, 48, 0.05)');
      nebulaBR.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaBR;
      ctx.fillRect(W - 220, H - 220, 220, 220);

      const nebulaTR = ctx.createRadialGradient(W, 0, 0, W, 0, 160);
      nebulaTR.addColorStop(0, 'rgba(191, 90, 242, 0.04)');
      nebulaTR.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaTR;
      ctx.fillRect(W - 160, 0, 160, 160);

      // ══ DRIFTING STARS ══
      const stars = starsRef.current;
      for (const s of stars) {
        s.pulse += s.speed;
        const a = s.alpha * (0.5 + Math.sin(s.pulse) * 0.5);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ══ TECH GRID LINES (subtle cyan) ══
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.022)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += tileSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y <= H; y += tileSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ══ MAP TILES: WALLS + SPIKES ══
      const rows = state.grid.length;
      const cols = state.grid[0] ? state.grid[0].length : 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const type = state.grid[r][c];
          const tx = c * tileSize;
          const ty = r * tileSize;

          if (type === 1) {
            // ── PREMIUM METALLIC WALL PANEL ──
            // Base dark fill
            const wallGrad = ctx.createLinearGradient(tx, ty, tx + tileSize, ty + tileSize);
            wallGrad.addColorStop(0, '#0c0e14');
            wallGrad.addColorStop(0.45, '#10121a');
            wallGrad.addColorStop(0.55, '#0e1018');
            wallGrad.addColorStop(1, '#080a10');
            ctx.fillStyle = wallGrad;
            ctx.fillRect(tx, ty, tileSize, tileSize);

            // Bevel highlight (top-left edge)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(tx, ty, tileSize, 1);
            ctx.fillRect(tx, ty, 1, tileSize);

            // Bevel shadow (bottom-right edge)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(tx, ty + tileSize - 1, tileSize, 1);
            ctx.fillRect(tx + tileSize - 1, ty, 1, tileSize);

            // Inner inset border
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
            ctx.lineWidth = 1;
            ctx.strokeRect(tx + 3, ty + 3, tileSize - 6, tileSize - 6);

            // Outer border (subtle cyan neon)
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
            ctx.lineWidth = 1;
            ctx.strokeRect(tx + 0.5, ty + 0.5, tileSize - 1, tileSize - 1);

            // Corner rivets
            const rivetPositions = [
              [tx + 5, ty + 5], [tx + tileSize - 5, ty + 5],
              [tx + 5, ty + tileSize - 5], [tx + tileSize - 5, ty + tileSize - 5]
            ];
            for (const [rx, ry] of rivetPositions) {
              const rivetGrad = ctx.createRadialGradient(rx - 0.5, ry - 0.5, 0.2, rx, ry, 2);
              rivetGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
              rivetGrad.addColorStop(1, 'rgba(0,229,255,0.06)');
              ctx.fillStyle = rivetGrad;
              ctx.beginPath();
              ctx.arc(rx, ry, 2, 0, Math.PI * 2);
              ctx.fill();
            }

          } else if (type === 2) {
            // ── PLASMA HAZARD SPIKES ──
            const spikeT = now * 0.003;
            const spikeAlpha = 0.6 + Math.sin(spikeT) * 0.3;

            // Glowing base fill
            ctx.fillStyle = `rgba(255, 59, 48, ${0.04 + Math.sin(spikeT * 1.3) * 0.02})`;
            ctx.fillRect(tx, ty, tileSize, tileSize);

            // Draw 3 plasma spike triangles
            const spikeW = tileSize / 3;
            for (let i = 0; i < 3; i++) {
              const sx = tx + i * spikeW;
              const tipY = ty + tileSize - 20 - Math.sin(spikeT + i * 1.2) * 3;

              // Outer glow
              ctx.save();
              ctx.shadowBlur = 14 + Math.sin(spikeT + i) * 5;
              ctx.shadowColor = '#ff3b30';
              ctx.fillStyle = `rgba(255, 59, 48, ${spikeAlpha * 0.6})`;
              ctx.beginPath();
              ctx.moveTo(sx, ty + tileSize);
              ctx.lineTo(sx + spikeW / 2, tipY);
              ctx.lineTo(sx + spikeW, ty + tileSize);
              ctx.closePath();
              ctx.fill();
              ctx.restore();

              // Inner bright spike
              ctx.save();
              ctx.shadowBlur = 8;
              ctx.shadowColor = '#ff9500';
              const spikeInnerGrad = ctx.createLinearGradient(sx + spikeW / 2, tipY, sx + spikeW / 2, ty + tileSize);
              spikeInnerGrad.addColorStop(0, `rgba(255, 200, 0, ${spikeAlpha})`);
              spikeInnerGrad.addColorStop(0.5, `rgba(255, 80, 0, ${spikeAlpha * 0.8})`);
              spikeInnerGrad.addColorStop(1, `rgba(255, 30, 0, ${spikeAlpha * 0.4})`);
              ctx.fillStyle = spikeInnerGrad;
              ctx.lineWidth = 1.5;
              ctx.strokeStyle = `rgba(255, 180, 0, ${spikeAlpha})`;
              ctx.beginPath();
              ctx.moveTo(sx + 2, ty + tileSize);
              ctx.lineTo(sx + spikeW / 2, tipY + 2);
              ctx.lineTo(sx + spikeW - 2, ty + tileSize);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              ctx.restore();
            }

            // Danger warning line at base
            ctx.strokeStyle = `rgba(255, 59, 48, ${spikeAlpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(tx, ty + tileSize - 1);
            ctx.lineTo(tx + tileSize, ty + tileSize - 1);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // ══ PRESSURE SWITCHES ══
      state.buttons.forEach(btn => {
        const btnT = now * 0.004;
        ctx.save();
        const btnColor = btn.isPressed ? '#32d74b' : '#ff9500';
        const btnGlow = btn.isPressed ? 'rgba(50, 215, 75, 0.6)' : 'rgba(255, 149, 0, 0.6)';

        ctx.shadowBlur = 16 + Math.sin(btnT) * 5;
        ctx.shadowColor = btnGlow;

        const btnGrad = ctx.createRadialGradient(
          btn.pos.x - btn.radius * 0.3, btn.pos.y - btn.radius * 0.3, 1,
          btn.pos.x, btn.pos.y, btn.radius
        );
        btnGrad.addColorStop(0, btn.isPressed ? '#80ffaa' : '#ffcc44');
        btnGrad.addColorStop(0.5, btnColor);
        btnGrad.addColorStop(1, btn.isPressed ? '#1a5c28' : '#6b3a00');
        ctx.fillStyle = btnGrad;
        ctx.beginPath();
        ctx.arc(btn.pos.x, btn.pos.y, btn.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Outer pulse ring
        ctx.globalAlpha = 0.3 + Math.sin(btnT * 1.5) * 0.2;
        ctx.strokeStyle = btnColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(btn.pos.x, btn.pos.y, btn.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // ══ SLIDING DOORS ══
      state.doors.forEach(door => {
        if (!door.isOpen) {
          ctx.save();
          const doorT = now * 0.003;
          ctx.shadowBlur = 12 + Math.sin(doorT) * 4;
          ctx.shadowColor = 'rgba(255, 149, 0, 0.7)';

          const doorGrad = ctx.createLinearGradient(
            door.pos.x - door.size.w / 2, 0,
            door.pos.x + door.size.w / 2, 0
          );
          doorGrad.addColorStop(0, '#6b3a00');
          doorGrad.addColorStop(0.3, '#ff9500');
          doorGrad.addColorStop(0.7, '#ff9500');
          doorGrad.addColorStop(1, '#6b3a00');
          ctx.fillStyle = doorGrad;
          ctx.fillRect(door.pos.x - door.size.w / 2, door.pos.y - door.size.h / 2, door.size.w, door.size.h);

          ctx.strokeStyle = 'rgba(255, 200, 100, 0.6)';
          ctx.lineWidth = 1;
          ctx.strokeRect(door.pos.x - door.size.w / 2 + 2, door.pos.y - door.size.h / 2 + 2, door.size.w - 4, door.size.h - 4);
          ctx.restore();
        }
      });

      // ══ ROTATING MAGNETS ══
      state.rotators.forEach(rot => {
        ctx.save();
        ctx.translate(rot.pos.x, rot.pos.y);
        ctx.rotate(rot.angle);

        // Outer glow ring
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#af52de';
        ctx.strokeStyle = 'rgba(175, 82, 222, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, rot.radius + 8, 0, Math.PI * 2);
        ctx.stroke();

        // Core gradient
        const rotGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, rot.radius);
        rotGrad.addColorStop(0, '#d480ff');
        rotGrad.addColorStop(0.4, '#af52de');
        rotGrad.addColorStop(1, '#06060a');
        ctx.fillStyle = rotGrad;
        ctx.beginPath();
        ctx.arc(0, 0, rot.radius, 0, Math.PI * 2);
        ctx.fill();

        // Magnetic arms
        ctx.strokeStyle = 'rgba(175, 82, 222, 0.8)';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#af52de';
        ctx.beginPath();
        ctx.moveTo(-rot.radius, 0);
        ctx.lineTo(rot.radius, 0);
        ctx.stroke();

        // North pole (cyan)
        const northGrad = ctx.createRadialGradient(rot.radius, 0, 0, rot.radius, 0, 10);
        northGrad.addColorStop(0, '#ffffff');
        northGrad.addColorStop(0.3, '#00e5ff');
        northGrad.addColorStop(1, '#004455');
        ctx.fillStyle = northGrad;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(rot.radius, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // South pole (red)
        const southGrad = ctx.createRadialGradient(-rot.radius, 0, 0, -rot.radius, 0, 10);
        southGrad.addColorStop(0, '#ffffff');
        southGrad.addColorStop(0.3, '#ff3b30');
        southGrad.addColorStop(1, '#440008');
        ctx.fillStyle = southGrad;
        ctx.shadowColor = '#ff3b30';
        ctx.beginPath();
        ctx.arc(-rot.radius, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 59, 48, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      });

      // ══ EXIT PORTAL — SPECTACULAR ══
      {
        const ex = state.exit.x, ey = state.exit.y, er = state.exit.radius;
        const pT = now * 0.0035;

        ctx.save();

        // Outer glow rings (expanding)
        for (let i = 0; i < 3; i++) {
          const ringPhase = (pT + i * 0.8) % (Math.PI * 2);
          const ringR = er * (1.1 + i * 0.4 + Math.sin(ringPhase) * 0.2);
          const ringAlpha = 0.15 * (1 - i * 0.3) * (0.5 + Math.sin(pT + i) * 0.5);
          ctx.strokeStyle = `rgba(50, 215, 75, ${ringAlpha})`;
          ctx.lineWidth = 1.5 - i * 0.4;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#32d74b';
          ctx.beginPath();
          ctx.arc(ex, ey, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Swirling spiral segments
        for (let arm = 0; arm < 4; arm++) {
          const armAngle = pT * 1.8 + (arm / 4) * Math.PI * 2;
          for (let seg = 0; seg < 8; seg++) {
            const segR = er * 0.15 + (seg / 8) * er * 0.75;
            const segA = armAngle + seg * 0.35;
            const x1 = ex + Math.cos(segA) * segR;
            const y1 = ey + Math.sin(segA) * segR;
            const x2 = ex + Math.cos(segA + 0.3) * (segR + er * 0.12);
            const y2 = ey + Math.sin(segA + 0.3) * (segR + er * 0.12);
            const segAlpha = (1 - seg / 8) * 0.6;
            ctx.strokeStyle = `rgba(50, 215, 75, ${segAlpha})`;
            ctx.lineWidth = 2 - seg * 0.2;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#32d74b';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        // Core radial gradient
        const portalGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, er);
        portalGrad.addColorStop(0, '#ffffff');
        portalGrad.addColorStop(0.15, 'rgba(180, 255, 200, 0.95)');
        portalGrad.addColorStop(0.4, 'rgba(50, 215, 75, 0.65)');
        portalGrad.addColorStop(0.75, 'rgba(20, 140, 50, 0.2)');
        portalGrad.addColorStop(1, 'rgba(10, 60, 20, 0)');
        ctx.shadowBlur = 24;
        ctx.shadowColor = '#32d74b';
        ctx.fillStyle = portalGrad;
        ctx.beginPath();
        ctx.arc(ex, ey, er, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing inner ring
        const innerR = er * (0.45 + Math.sin(pT * 2.2) * 0.08);
        ctx.strokeStyle = 'rgba(120, 255, 160, 0.7)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(ex, ey, innerR, 0, Math.PI * 2);
        ctx.stroke();

        // EXIT label
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#32d74b';
        ctx.fillStyle = 'rgba(50, 215, 75, 0.9)';
        ctx.font = `bold 8px 'Orbitron', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('EXIT', ex, ey + er + 12);

        ctx.restore();
      }

      // ══ ACTIVE LASERS ══
      state.lasers.forEach(laser => {
        if (!laser.active) return;
        const laserT = now * 0.006;
        ctx.save();
        const lColor = laser.color || '#ff9500';

        // Outer glow
        ctx.strokeStyle = lColor;
        ctx.lineWidth = 6;
        ctx.globalAlpha = 0.2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = lColor;
        ctx.beginPath();
        ctx.moveTo(laser.p1.x, laser.p1.y);
        ctx.lineTo(laser.p2.x, laser.p2.y);
        ctx.stroke();

        // Core bright line
        ctx.globalAlpha = 0.9 + Math.sin(laserT) * 0.1;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(laser.p1.x, laser.p1.y);
        ctx.lineTo(laser.p2.x, laser.p2.y);
        ctx.stroke();

        // Emitter nodes
        for (const pt of [laser.p1, laser.p2]) {
          const nodeGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 8);
          nodeGrad.addColorStop(0, '#ffffff');
          nodeGrad.addColorStop(0.4, lColor);
          nodeGrad.addColorStop(1, 'transparent');
          ctx.globalAlpha = 1;
          ctx.fillStyle = nodeGrad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // ══ MAGNETIC CONNECTION LINE (double-helix ripple) ══
      if (state.polarity !== 'off' && !state.isComplete) {
        state.balls.forEach(ball => {
          if (ball.isDead) return;
          const ax = state.anchor.x, ay = state.anchor.y;
          const bx = ball.pos.x, by = ball.pos.y;
          const pColor = state.polarity === 'pull' ? '#00e5ff' : '#ff3b30';
          const pColorAlt = state.polarity === 'pull' ? '#0088aa' : '#aa1a10';
          const lineT = now * 0.006;

          // Calculate line direction and perpendicular
          const dx = bx - ax, dy = by - ay;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 1) return;
          const ux = dx / len, uy = dy / len;
          const px = -uy, py = ux; // perpendicular

          const segments = 20;
          const amplitude = 6;

          ctx.save();

          // Strand 1
          ctx.beginPath();
          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const wx = ax + dx * t;
            const wy = ay + dy * t;
            const wave = Math.sin(t * Math.PI * 4 - lineT * 3) * amplitude;
            const x = wx + px * wave;
            const y = wy + py * wave;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = pColor;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 10;
          ctx.shadowColor = pColor;
          ctx.globalAlpha = 0.5 + Math.sin(lineT * 2) * 0.2;
          ctx.stroke();

          // Strand 2 (opposite phase)
          ctx.beginPath();
          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const wx = ax + dx * t;
            const wy = ay + dy * t;
            const wave = Math.sin(t * Math.PI * 4 - lineT * 3 + Math.PI) * amplitude;
            const x = wx + px * wave;
            const y = wy + py * wave;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = pColorAlt;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.35 + Math.sin(lineT * 2 + 1) * 0.15;
          ctx.stroke();

          ctx.restore();
        });
      }

      // ══ MOTION TRAILS ══
      state.balls.forEach(ball => {
        if (ball.isDead) return;
        const trail = trailsRef.current[ball.id] || [];
        for (let i = 0; i < trail.length - 1; i++) {
          const alpha = (i / trail.length) * 0.3;
          const r = ball.radius * (i / trail.length) * 0.7;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = state.polarity === 'pull' ? '#00e5ff' : state.polarity === 'push' ? '#ff3b30' : 'rgba(180, 190, 210, 0.8)';
          ctx.beginPath();
          ctx.arc(trail[i].x, trail[i].y, Math.max(r, 1), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // ══ STEEL BALLS — ULTRA CHROME ══
      state.balls.forEach(ball => {
        if (ball.isDead) return;
        const ballT = now * 0.004;

        ctx.save();

        // Polarity ripple rings expanding outward
        if (state.polarity !== 'off') {
          const rippleCount = 3;
          for (let i = 0; i < rippleCount; i++) {
            const ripplePhase = ((ballT + i * (Math.PI * 2 / rippleCount)) % (Math.PI * 2));
            const rippleR = ball.radius + (ripplePhase / (Math.PI * 2)) * 20;
            const rippleAlpha = (1 - ripplePhase / (Math.PI * 2)) * 0.35;
            const rColor = state.polarity === 'pull' ? '#00e5ff' : '#ff3b30';
            ctx.strokeStyle = rColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = rippleAlpha;
            ctx.shadowBlur = 6;
            ctx.shadowColor = rColor;
            ctx.beginPath();
            ctx.arc(ball.pos.x, ball.pos.y, rippleR, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

        // Main chrome sphere
        ctx.shadowBlur = 18;
        ctx.shadowColor = state.polarity !== 'off'
          ? (state.polarity === 'pull' ? 'rgba(0, 229, 255, 0.3)' : 'rgba(255, 59, 48, 0.3)')
          : 'rgba(150, 170, 200, 0.15)';

        const ballGrad = ctx.createRadialGradient(
          ball.pos.x - ball.radius * 0.38, ball.pos.y - ball.radius * 0.38, ball.radius * 0.04,
          ball.pos.x, ball.pos.y, ball.radius
        );
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.18, '#e0e8f5');
        ballGrad.addColorStop(0.45, '#9aa5bc');
        ballGrad.addColorStop(0.75, '#3d4455');
        ballGrad.addColorStop(0.92, '#1c202c');
        ballGrad.addColorStop(1, '#0d0f14');
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Animated specular highlight (moving spot)
        const specAngle = ballT * 1.5;
        const specX = ball.pos.x - ball.radius * 0.3 + Math.cos(specAngle) * ball.radius * 0.15;
        const specY = ball.pos.y - ball.radius * 0.3 + Math.sin(specAngle) * ball.radius * 0.15;
        const specGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, ball.radius * 0.45);
        specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
        specGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.15)');
        specGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Polarity ring
        const ringColor = state.polarity === 'pull' ? '#00e5ff' : state.polarity === 'push' ? '#ff3b30' : 'rgba(200, 210, 230, 0.2)';
        ctx.strokeStyle = ringColor;
        ctx.shadowColor = ringColor;
        ctx.shadowBlur = state.polarity !== 'off' ? 14 : 3;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(ball.pos.x, ball.pos.y, ball.radius - 1.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      });

      // ══ MAGNETIC ANCHOR — FUTURISTIC DEVICE ══
      {
        const ax = state.anchor.x, ay = state.anchor.y;
        const pColor = state.polarity === 'pull' ? '#00e5ff' : state.polarity === 'push' ? '#ff3b30' : 'rgba(180, 200, 240, 0.5)';
        const pColorRgb = state.polarity === 'pull' ? '0, 229, 255' : state.polarity === 'push' ? '255, 59, 48' : '180, 200, 240';
        const ancT = now * 0.003;
        const isActive = state.polarity !== 'off';

        ctx.save();

        // Outer field rings (rotating at different speeds)
        if (isActive) {
          for (let ring = 0; ring < 3; ring++) {
            const rSpeed = (ring + 1) * 0.012;
            const rRadius = 28 + ring * 10;
            const rAlpha = (0.25 - ring * 0.07) * (0.6 + Math.sin(ancT * 2) * 0.4);

            ctx.save();
            ctx.translate(ax, ay);
            ctx.rotate(ancT * rSpeed * 60);

            ctx.strokeStyle = `rgba(${pColorRgb}, ${rAlpha})`;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 8;
            ctx.shadowColor = pColor;

            // Dashed rotating ring
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.arc(0, 0, rRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
          }

          // Magnetic field lines radiating outward
          for (let i = 0; i < 8; i++) {
            const lineAngle = (i / 8) * Math.PI * 2 + ancT * 0.5;
            const lineLen = 35 + Math.sin(ancT * 2 + i) * 8;
            ctx.save();
            ctx.globalAlpha = 0.15 + Math.sin(ancT + i * 0.8) * 0.1;
            ctx.strokeStyle = pColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax + Math.cos(lineAngle) * 22, ay + Math.sin(lineAngle) * 22);
            ctx.lineTo(ax + Math.cos(lineAngle) * (22 + lineLen), ay + Math.sin(lineAngle) * (22 + lineLen));
            ctx.stroke();
            ctx.restore();
          }
        }

        // Device body gradient
        const anchorGrad = ctx.createRadialGradient(ax - 7, ay - 7, 1, ax, ay, 22);
        anchorGrad.addColorStop(0, '#ffffff');
        anchorGrad.addColorStop(0.2, isActive ? pColor : 'rgba(220, 230, 255, 0.9)');
        anchorGrad.addColorStop(0.6, isActive ? `rgba(${pColorRgb}, 0.4)` : 'rgba(60, 70, 100, 0.5)');
        anchorGrad.addColorStop(0.9, 'rgba(10, 10, 22, 0.9)');
        anchorGrad.addColorStop(1, 'rgba(5, 5, 12, 1)');

        ctx.shadowBlur = isActive ? 28 : 12;
        ctx.shadowColor = isActive ? pColor : 'rgba(150, 180, 255, 0.3)';
        ctx.fillStyle = anchorGrad;
        ctx.beginPath();
        ctx.arc(ax, ay, 22, 0, Math.PI * 2);
        ctx.fill();

        // Device outer ring
        ctx.strokeStyle = pColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ax, ay, 22, 0, Math.PI * 2);
        ctx.stroke();

        // Cardinal direction N/S/E/W markers when active
        if (isActive) {
          const markers = [
            { label: 'N', angle: -Math.PI / 2 },
            { label: 'S', angle: Math.PI / 2 },
            { label: 'E', angle: 0 },
            { label: 'W', angle: Math.PI }
          ];
          for (const m of markers) {
            const mx = ax + Math.cos(m.angle) * 32;
            const my = ay + Math.sin(m.angle) * 32;
            ctx.save();
            ctx.globalAlpha = 0.55;
            ctx.fillStyle = pColor;
            ctx.font = `bold 7px 'Orbitron', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(m.label, mx, my);
            ctx.restore();
          }
        }

        // Central cross detail
        ctx.strokeStyle = `rgba(${pColorRgb}, 0.6)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax - 8, ay); ctx.lineTo(ax + 8, ay);
        ctx.moveTo(ax, ay - 8); ctx.lineTo(ax, ay + 8);
        ctx.stroke();

        // Inner pulsing core dot
        const coreR = 4 + Math.sin(ancT * 3) * 1.5;
        const coreGrad = ctx.createRadialGradient(ax, ay, 0, ax, ay, coreR);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(1, pColor);
        ctx.fillStyle = coreGrad;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ax, ay, coreR, 0, Math.PI * 2);
        ctx.fill();

        // Floating scope bracket (pulsing)
        const scopeR = 27 + Math.sin(ancT * 1.5) * 4;
        ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(ax, ay, scopeR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // ══ PARTICLE ENGINE ══
      particles.draw(ctx);

      // ══ HUD OVERLAY (drawn on canvas) ══
      {
        const totalLevels = 20;
        const levelNum = String(currentLevel?.id || 1).padStart(2, '0');
        const totalStr = String(totalLevels).padStart(2, '0');

        // Top-left: SECTOR indicator
        ctx.save();
        ctx.font = `bold 11px 'Orbitron', monospace`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00e5ff';
        ctx.fillStyle = 'rgba(0, 229, 255, 0.85)';
        ctx.fillText(`SECTOR ${levelNum}/${totalStr}`, 14, 18);
        ctx.restore();

        // Top-right: Lives as glowing orbs
        {
          const maxLives = 3;
          const orbR = 7;
          const orbSpacing = 18;
          const startX = W - 14 - (maxLives - 1) * orbSpacing;

          for (let i = 0; i < maxLives; i++) {
            const orbX = startX + i * orbSpacing;
            const isAlive = i < lives;
            ctx.save();
            ctx.shadowBlur = isAlive ? 14 : 4;
            ctx.shadowColor = isAlive ? '#00e5ff' : 'rgba(100, 100, 120, 0.4)';

            if (isAlive) {
              const orbGrad = ctx.createRadialGradient(orbX - 2, 14, 0, orbX, 18, orbR);
              orbGrad.addColorStop(0, '#ffffff');
              orbGrad.addColorStop(0.4, '#00e5ff');
              orbGrad.addColorStop(1, '#004466');
              ctx.fillStyle = orbGrad;
            } else {
              ctx.fillStyle = 'rgba(30, 35, 50, 0.8)';
            }

            ctx.beginPath();
            ctx.arc(orbX, 18, orbR, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = isAlive ? 'rgba(0, 229, 255, 0.6)' : 'rgba(80, 90, 110, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Bottom-center: Polarity state indicator
        {
          const hudW = 160, hudH = 28;
          const hudX = W / 2 - hudW / 2;
          const hudY = H - 36;

          ctx.save();
          ctx.fillStyle = 'rgba(4, 6, 14, 0.75)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.lineWidth = 1;
          roundRect(ctx, hudX, hudY, hudW, hudH, 8);
          ctx.fill();
          ctx.stroke();

          // Three polarity bars
          const barW = 36, barH = 10, barGap = 8;
          const totalBarsW = 3 * barW + 2 * barGap;
          const bx = W / 2 - totalBarsW / 2;
          const by = hudY + (hudH - barH) / 2;

          const states = ['pull', 'off', 'push'];
          const stateColors = { pull: '#00e5ff', off: 'rgba(255,255,255,0.15)', push: '#ff3b30' };

          for (let i = 0; i < 3; i++) {
            const barX = bx + i * (barW + barGap);
            const s = states[i];
            const isActive = polarity === s;
            const barColor = stateColors[s];

            ctx.fillStyle = isActive ? barColor : 'rgba(255, 255, 255, 0.05)';
            ctx.shadowBlur = isActive ? 10 : 0;
            ctx.shadowColor = barColor;
            roundRect(ctx, barX, by, barW, barH, 4);
            ctx.fill();

            // Label inside bar
            ctx.shadowBlur = 0;
            ctx.font = `bold 6px 'Orbitron', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isActive ? (s === 'off' ? 'rgba(255,255,255,0.6)' : '#ffffff') : 'rgba(255,255,255,0.18)';
            ctx.fillText(s.toUpperCase(), barX + barW / 2, by + barH / 2);
          }

          ctx.restore();
        }
      }

      ctx.restore(); // End screen shake context

      animFrameId = requestAnimationFrame(gameLoop);
    };

    animFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [levelState, polarity, screenShake]);

  // Helper: rounded rectangle
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ─────────────────────────────────────────────────────
  // CORE VAPORIZATION (Ball hit hazard)
  // ─────────────────────────────────────────────────────
  const triggerCoreVaporization = (ball) => {
    if (stateRef.current.deathTimer || ball.isDead) return;
    ball.isDead = true;
    ball.vel = Vector.create(0, 0);
    particleSystemRef.current.emitExplosion(ball.pos.x, ball.pos.y, '#ff3b30', 45);
    playExplosionSound();
    setScreenShake(20);

    stateRef.current.deathTimer = setTimeout(() => {
      stateRef.current.deathTimer = null;
      const remainingLives = lives - 1;
      setLives(remainingLives);
      if (remainingLives <= 0) {
        onGameOver();
      } else {
        const matchOrig = currentLevel.balls.find(b => b.id === ball.id);
        if (matchOrig) {
          ball.pos = { ...matchOrig.pos };
          ball.vel = { x: 0, y: 0 };
          ball.isDead = false;
        }
        stateRef.current.buttons.forEach(btn => btn.isPressed = false);
        stateRef.current.doors.forEach(door => {
          door.isOpen = false;
          stateRef.current.grid[door.gridY][door.gridX] = 1;
        });
        particleSystemRef.current.clear();
      }
    }, 850);
  };

  // Mouse Movement tracker
  const handleMouseMove = (e) => {
    if (stateRef.current.isComplete) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    stateRef.current.anchor.x = Math.max(22, Math.min(x, canvas.width - 22));
    stateRef.current.anchor.y = Math.max(22, Math.min(y, canvas.height - 22));
    if (showTutorialHint) setShowTutorialHint(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          padding: '3px',
          borderRadius: '22px',
          background: 'rgba(6, 6, 14, 0.85)',
          overflow: 'hidden',
          border: `1px solid ${
            polarity === 'pull' ? 'rgba(0, 229, 255, 0.3)' :
            polarity === 'push' ? 'rgba(255, 59, 48, 0.3)' :
            'rgba(0, 229, 255, 0.12)'
          }`,
          boxShadow: `
            0 0 60px rgba(0, 0, 0, 0.8),
            0 0 ${polarity !== 'off' ? '40px' : '10px'} ${
              polarity === 'pull' ? 'rgba(0, 229, 255, 0.12)' :
              polarity === 'push' ? 'rgba(255, 59, 48, 0.12)' :
              'rgba(0, 229, 255, 0.04)'
            },
            inset 0 1px 0 rgba(255, 255, 255, 0.06)
          `,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <canvas
          ref={canvasRef}
          width={720}
          height={540}
          onMouseMove={handleMouseMove}
          onClick={togglePolarity}
          style={{
            display: 'block',
            borderRadius: '20px',
            background: '#030308',
            cursor: 'none',
            maxWidth: '100%',
            height: 'auto'
          }}
        />

        {/* Tutorial Hint Overlay */}
        {showTutorialHint && currentLevel?.id === 1 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(4, 6, 16, 0.92)',
            border: '1px solid rgba(0, 229, 255, 0.35)',
            borderRadius: '16px',
            padding: '22px 30px',
            textAlign: 'center',
            pointerEvents: 'none',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.8), 0 0 30px rgba(0, 229, 255, 0.1)'
          }}>
            <h4 style={{
              fontFamily: 'var(--font-hud)',
              color: '#00e5ff',
              fontSize: '13px',
              marginBottom: '10px',
              letterSpacing: '2px',
              textShadow: '0 0 10px rgba(0,229,255,0.5)'
            }}>⟐ HOW TO PLAY</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', lineHeight: '1.7' }}>
              1. Move mouse → drag <span style={{ color: '#00e5ff' }}>Magnetic Anchor</span><br/>
              2. Click / <strong>SPACE</strong> → toggle polarity:<br/>
              <span style={{ color: '#00e5ff' }}>◈ PULL</span> → <span style={{ color: '#ff3b30' }}>◈ PUSH</span> → OFF<br/>
              3. Press <strong>R</strong> to restart sector
            </p>
          </div>
        )}

        {/* Bottom polarity indicator */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          background: 'rgba(4, 6, 14, 0.8)',
          backdropFilter: 'blur(12px)',
          padding: '6px 18px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          pointerEvents: 'none',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '10px',
            fontFamily: 'var(--font-hud)',
            fontWeight: '700',
            color: polarity === 'pull' ? '#00e5ff' : polarity === 'push' ? '#ff3b30' : '#4a4a5a',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            textShadow: polarity !== 'off' ? `0 0 8px ${polarity === 'pull' ? '#00e5ff' : '#ff3b30'}` : 'none',
            transition: 'all 0.3s ease'
          }}>
            {polarity === 'pull' ? '◈ PULL ACTIVE' : polarity === 'push' ? '◈ PUSH ACTIVE' : '○ STANDBY'}
          </div>
        </div>
      </div>

      {/* Controller bar below canvas */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        gap: '20px',
        width: '100%',
        maxWidth: '720px',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          color: 'rgba(255,255,255,0.18)',
          fontSize: '11px',
          fontFamily: 'var(--font-hud)',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Volume2 size={13} />
          <span>WEB AUDIO ENGINE</span>
        </div>
        <button
          onClick={onReset}
          className="neon-btn"
          style={{ padding: '8px 16px', fontSize: '10px', borderRadius: '10px', gap: '6px' }}
        >
          <RefreshCw size={12} /> RESTART SECTOR (R)
        </button>
      </div>
    </div>
  );
};

export default GameCanvas;
