import React, { useRef, useEffect, useState } from 'react';
import { 
  Vector, 
  calculateMagneticForce, 
  resolveMapCollisions, 
  testLaserIntersection 
} from '../utils/physics';
import { ParticleSystem } from '../utils/particles';
import { RefreshCw, Play, Volume2, Shield } from 'lucide-react';

const GameCanvas = ({ 
  currentLevel, 
  onLevelComplete, 
  onGameOver, 
  onReset,
  lives,
  setLives
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

  // Load level configuration
  useEffect(() => {
    if (!currentLevel) return;

    // Deep copy balls and grids to allow reset
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

    setPolarity('off');
    particleSystemRef.current.clear();
    setScreenShake(0);
    setLevelState(currentLevel);
  }, [currentLevel, onReset]);

  // Handle Polarity Switch Inputs (Mouse & Spacebar)
  const togglePolarity = () => {
    if (stateRef.current.isComplete) return;

    setPolarity(prev => {
      const next = prev === 'off' ? 'pull' : prev === 'pull' ? 'push' : 'off';
      stateRef.current.polarity = next;
      
      // Play a tactile retro switch sound effect using Web Audio API
      playSwitchSound(next);
      return next;
    });
  };

  const playSwitchSound = (mode) => {
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
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (mode === 'push') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.14);
      } else {
        // Mode OFF click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  const playExplosionSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Custom brown-noise buffer generator
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  const playCompleteSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePolarity();
      }
      if (e.code === 'KeyR') {
        e.preventDefault();
        onReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Loop
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

      // 1. UPDATE PHYSICS
      if (!state.isComplete && !state.deathTimer) {
        
        // Update Rotating Magnets (Level 5 Vortex)
        state.rotators.forEach(rotator => {
          rotator.angle += rotator.spinSpeed;
          
          // Draw ambient magnetic fields on rotating anchor
          if (Math.random() > 0.4) {
            const rotFluxAngle = rotator.angle + (Math.random() - 0.5) * 0.4;
            const rx = rotator.pos.x + Math.cos(rotFluxAngle) * rotator.radius;
            const ry = rotator.pos.y + Math.sin(rotFluxAngle) * rotator.radius;
            particles.addParticle(rx, ry, Math.cos(rotFluxAngle) * 2, Math.sin(rotFluxAngle) * 2, '#af52de', 1.5, 30, 'flux');
          }
        });

        // Loop over core metal spheres
        state.balls.forEach(ball => {
          if (ball.isDead) return;

          // Apply air friction / rolling resistance
          ball.vel.x *= 0.985;
          ball.vel.y *= 0.985;

          // A: Calculate Active Player Magnetic Force
          const fMag = calculateMagneticForce(ball.pos, state.anchor, state.polarity, {
            strength: 280,
            minDist: 35,
            maxDist: 600
          });

          ball.vel.x += fMag.x;
          ball.vel.y += fMag.y;

          // B: Calculate Orbit rotators force (Level 5)
          state.rotators.forEach(rotator => {
            const dist = Vector.dist(ball.pos, rotator.pos);
            if (dist < 220) {
              const dx = ball.pos.x - rotator.pos.x;
              const dy = ball.pos.y - rotator.pos.y;
              
              // Dynamic force angle: rotates the sphere in a orbit!
              const tangentAngle = Math.atan2(dy, dx) + Math.PI/2;
              const pullStrength = rotator.strength / (Math.max(dist, 40) * 0.05);
              
              ball.vel.x += Math.cos(tangentAngle) * pullStrength * 0.01;
              ball.vel.y += Math.sin(tangentAngle) * pullStrength * 0.01;
              
              // Core pull toward center
              const pullDir = Vector.normalize(Vector.sub(rotator.pos, ball.pos));
              ball.vel.x += pullDir.x * 0.03;
              ball.vel.y += pullDir.y * 0.03;
            }
          });

          // Limit speed to prevent clipping bugs through solid grids
          ball.vel = Vector.limit(ball.vel, 12);

          // C: Run sliding wall grid collisions
          resolveMapCollisions(ball, state.grid, tileSize);

          // D: Check Spike Hazard intersection (grid element = 2)
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

          // E: Check Button Pressure Plate triggers
          state.buttons.forEach(btn => {
            const dist = Vector.dist(ball.pos, btn.pos);
            if (dist < ball.radius + btn.radius) {
              if (!btn.isPressed) {
                btn.isPressed = true;
                playSwitchSound('pull'); // Tap sound
                
                // Slide open linked gate (Open door is removed from physical wall grid!)
                const linkedDoor = state.doors.find(d => d.id === btn.targetDoorId);
                if (linkedDoor && !linkedDoor.isOpen) {
                  linkedDoor.isOpen = true;
                  // Remove door solid from map grid matrix
                  state.grid[linkedDoor.gridY][linkedDoor.gridX] = 0;
                  setScreenShake(8);
                }
              }
            } else {
              // Press plate releases if ball moves off
              if (btn.isPressed && dist > ball.radius + btn.radius + 5) {
                btn.isPressed = false;
                const linkedDoor = state.doors.find(d => d.id === btn.targetDoorId);
                if (linkedDoor && linkedDoor.isOpen) {
                  linkedDoor.isOpen = false;
                  state.grid[linkedDoor.gridY][linkedDoor.gridX] = 1; // Solid again!
                }
              }
            }
          });

          // F: Check Laser beam intersects
          state.lasers.forEach(laser => {
            if (laser.active) {
              const hit = testLaserIntersection(laser.p1, laser.p2, ball.pos, ball.radius - 1);
              if (hit) {
                triggerCoreVaporization(ball);
              }
            }
          });

          // G: Magnet particle generator
          if (state.polarity !== 'off') {
            particles.emitMagneticFlux(state.anchor, ball, state.polarity);
          }
        });

        // Ambient exit portal swirling green vortex
        particles.emitPortalAmbient(state.exit.x, state.exit.y, state.exit.radius);

        // H: Win Condition Check (All cores inside exit portal)
        const allInExit = state.balls.every(ball => {
          if (ball.isDead) return false;
          const distToExit = Vector.dist(ball.pos, state.exit);
          return distToExit < state.exit.radius - 4;
        });

        if (allInExit && state.balls.length > 0) {
          state.isComplete = true;
          playCompleteSound();
          particles.emitCelebration(state.exit.x, state.exit.y);
          setScreenShake(12);

          // Transition delay to next level
          setTimeout(() => {
            onLevelComplete();
          }, 1800);
        }
      }

      particles.update();

      // Screen shake decay
      setScreenShake(prev => Math.max(0, prev - 0.5));

      // 2. RENDERING CANVAS
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      
      // Apply screenshake transform offsets
      if (screenShake > 0) {
        const dx = (Math.random() - 0.5) * screenShake;
        const dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
      }

      // Draw Grid Background lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Map Grid blocks & spikes
      const rowsCount = state.grid.length;
      const colsCount = state.grid[0] ? state.grid[0].length : 0;

      for (let r = 0; r < rowsCount; r++) {
        for (let c = 0; c < colsCount; c++) {
          const type = state.grid[r][c];
          const tx = c * tileSize;
          const ty = r * tileSize;

          if (type === 1) {
            // Render Solid futuristic neon cyberpunk wall
            ctx.fillStyle = '#0f1016';
            ctx.fillRect(tx, ty, tileSize, tileSize);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            ctx.strokeRect(tx + 2, ty + 2, tileSize - 4, tileSize - 4);
            
            // Neon accent border edges
            ctx.strokeStyle = '#1a2233';
            ctx.lineWidth = 2;
            ctx.strokeRect(tx, ty, tileSize, tileSize);
          } else if (type === 2) {
            // Render beautiful orange neon spikes hazard
            ctx.fillStyle = 'rgba(255, 149, 0, 0.05)';
            ctx.fillRect(tx, ty, tileSize, tileSize);

            ctx.strokeStyle = '#ff9500';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#ff9500';
            
            const spikeW = tileSize / 3;
            for (let i = 0; i < 3; i++) {
              ctx.beginPath();
              // Spike triangles pointing upwards
              ctx.moveTo(tx + i * spikeW, ty + tileSize);
              ctx.lineTo(tx + i * spikeW + spikeW / 2, ty + tileSize - 18);
              ctx.lineTo(tx + (i + 1) * spikeW, ty + tileSize);
              ctx.closePath();
              ctx.stroke();
              
              ctx.fillStyle = 'rgba(255, 149, 0, 0.4)';
              ctx.fill();
            }
            ctx.shadowBlur = 0; // reset
          }
        }
      }

      // Draw Pressure switches
      state.buttons.forEach(btn => {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = btn.isPressed ? '#32d74b' : '#ff9500';
        
        ctx.fillStyle = btn.isPressed ? '#32d74b' : '#ff9500';
        ctx.beginPath();
        ctx.arc(btn.pos.x, btn.pos.y, btn.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
      });

      // Draw sliding doors
      state.doors.forEach(door => {
        if (!door.isOpen) {
          ctx.fillStyle = '#ff9500';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ff9500';
          ctx.fillRect(door.pos.x - door.size.w/2, door.pos.y - door.size.h/2, door.size.w, door.size.h);
          
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1;
          ctx.strokeRect(door.pos.x - door.size.w/2 + 2, door.pos.y - door.size.h/2 + 2, door.size.w - 4, door.size.h - 4);
          ctx.shadowBlur = 0;
        }
      });

      // Draw static rotating magnets (Level 5 Vortex)
      state.rotators.forEach(rot => {
        ctx.save();
        ctx.translate(rot.pos.x, rot.pos.y);
        ctx.rotate(rot.angle);
        
        // Inner rotor core
        const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, rot.radius);
        grad.addColorStop(0, '#af52de');
        grad.addColorStop(1, '#06060a');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, rot.radius, 0, Math.PI*2);
        ctx.fill();

        // Crossbar magnetic wings
        ctx.strokeStyle = 'rgba(175, 82, 222, 0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-rot.radius, 0);
        ctx.lineTo(rot.radius, 0);
        ctx.stroke();

        ctx.strokeStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(rot.radius, 0, 8, 0, Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = '#00e5ff';
        ctx.fill();

        ctx.strokeStyle = '#ff3b30';
        ctx.beginPath();
        ctx.arc(-rot.radius, 0, 8, 0, Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = '#ff3b30';
        ctx.fill();

        ctx.restore();
      });

      // Draw Exit Portal Green vortex
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#32d74b';
      
      const portalGrad = ctx.createRadialGradient(
        state.exit.x, state.exit.y, 4,
        state.exit.x, state.exit.y, state.exit.radius
      );
      portalGrad.addColorStop(0, '#ffffff');
      portalGrad.addColorStop(0.3, 'rgba(50, 215, 75, 0.8)');
      portalGrad.addColorStop(0.7, 'rgba(50, 215, 75, 0.25)');
      portalGrad.addColorStop(1, 'rgba(50, 215, 75, 0)');
      
      ctx.fillStyle = portalGrad;
      ctx.beginPath();
      ctx.arc(state.exit.x, state.exit.y, state.exit.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Portal spinning rings
      const portalTime = Date.now() * 0.0045;
      ctx.strokeStyle = 'rgba(50, 215, 75, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(state.exit.x, state.exit.y, state.exit.radius * (0.5 + Math.sin(portalTime) * 0.1), 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // Draw Active Lasers hazards
      state.lasers.forEach(laser => {
        if (laser.active) {
          ctx.save();
          ctx.strokeStyle = laser.color || '#ff9500';
          ctx.lineWidth = 3;
          ctx.shadowBlur = 12;
          ctx.shadowColor = laser.color || '#ff9500';
          
          ctx.beginPath();
          ctx.moveTo(laser.p1.x, laser.p1.y);
          ctx.lineTo(laser.p2.x, laser.p2.y);
          ctx.stroke();
          
          // Draw emitter cores at terminals
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(laser.p1.x, laser.p1.y, 5, 0, Math.PI * 2);
          ctx.arc(laser.p2.x, laser.p2.y, 5, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      });

      // Draw Active Magnetic Waves (Connection line between anchor and cores)
      if (state.polarity !== 'off' && !state.isComplete) {
        state.balls.forEach(ball => {
          if (ball.isDead) return;

          ctx.save();
          const pColor = state.polarity === 'pull' ? '#00e5ff' : '#ff3b30';
          
          // Glowing connection line
          ctx.strokeStyle = pColor;
          ctx.shadowColor = pColor;
          ctx.shadowBlur = 8;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.25 + Math.sin(Date.now() * 0.01) * 0.15;
          
          ctx.beginPath();
          ctx.moveTo(state.anchor.x, state.anchor.y);
          ctx.lineTo(ball.pos.x, ball.pos.y);
          ctx.stroke();
          ctx.restore();
        });
      }

      // Draw Core metallic balls (Steel cores)
      state.balls.forEach(ball => {
        if (ball.isDead) return;

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';

        // Brushed chrome metallic circle gradient
        const ballGrad = ctx.createRadialGradient(
          ball.pos.x - ball.radius * 0.35, ball.pos.y - ball.radius * 0.35, ball.radius * 0.05,
          ball.pos.x, ball.pos.y, ball.radius
        );
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.4, '#a2a9b8');
        ballGrad.addColorStop(0.8, '#434a57');
        ballGrad.addColorStop(1, '#1b1d22');
        
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Neon core status ring (indicates attraction/repulsion is active)
        ctx.strokeStyle = state.polarity === 'pull' ? '#00e5ff' : state.polarity === 'push' ? '#ff3b30' : 'rgba(255, 255, 255, 0.15)';
        ctx.shadowBlur = state.polarity !== 'off' ? 10 : 0;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ball.pos.x, ball.pos.y, ball.radius - 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      });

      // Draw Magnetic Anchor (Device operated by player)
      ctx.save();
      const anchorColor = state.polarity === 'pull' ? '#00e5ff' : state.polarity === 'push' ? '#ff3b30' : 'rgba(255,255,255,0.4)';
      ctx.shadowBlur = state.polarity !== 'off' ? 24 : 10;
      ctx.shadowColor = anchorColor;
      
      // Glass shield body
      const anchorGrad = ctx.createRadialGradient(
        state.anchor.x, state.anchor.y, 2,
        state.anchor.x, state.anchor.y, 20
      );
      anchorGrad.addColorStop(0, '#ffffff');
      anchorGrad.addColorStop(0.3, anchorColor);
      anchorGrad.addColorStop(0.9, 'rgba(12, 12, 22, 0.85)');
      anchorGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');

      ctx.fillStyle = anchorGrad;
      ctx.beginPath();
      ctx.arc(state.anchor.x, state.anchor.y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Outer carbon shell rings
      ctx.strokeStyle = anchorColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(state.anchor.x, state.anchor.y, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Floating outer scope brackets
      const pulseScope = 25 + Math.sin(Date.now() * 0.0075) * 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(state.anchor.x, state.anchor.y, pulseScope, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // Render Active Sparks Particle engine
      particles.draw(ctx);

      ctx.restore();

      animFrameId = requestAnimationFrame(gameLoop);
    };

    animFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [levelState, polarity, screenShake]);

  // Handles metallic ball hitting hazards (spikes, lasers)
  const triggerCoreVaporization = (ball) => {
    if (stateRef.current.deathTimer || ball.isDead) return;

    ball.isDead = true;
    ball.vel = Vector.create(0, 0);

    // 1. Particle explosion
    particleSystemRef.current.emitExplosion(ball.pos.x, ball.pos.y, '#ff3b30', 45);
    playExplosionSound();
    setScreenShake(20);

    // 2. Set death delay
    stateRef.current.deathTimer = setTimeout(() => {
      stateRef.current.deathTimer = null;
      
      const remainingLives = lives - 1;
      setLives(remainingLives);

      if (remainingLives <= 0) {
        onGameOver();
      } else {
        // Respawn ball at original coordinates
        const matchOrig = currentLevel.balls.find(b => b.id === ball.id);
        if (matchOrig) {
          ball.pos = { ...matchOrig.pos };
          ball.vel = { x: 0, y: 0 };
          ball.isDead = false;
        }
        
        // Reset sliding doors and switches
        stateRef.current.buttons.forEach(btn => btn.isPressed = false);
        stateRef.current.doors.forEach(door => {
          door.isOpen = false;
          // Put door barrier back into grid
          stateRef.current.grid[door.gridY][door.gridX] = 1;
        });

        // Vaporize particle clearing
        particleSystemRef.current.clear();
      }
    }, 850);
  };

  // Mouse Movement tracker to set anchor pos
  const handleMouseMove = (e) => {
    if (stateRef.current.isComplete) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Compute exact relative canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Clamp inside play margins
    stateRef.current.anchor.x = Math.max(22, Math.min(x, canvas.width - 22));
    stateRef.current.anchor.y = Math.max(22, Math.min(y, canvas.height - 22));
    
    if (showTutorialHint) {
      setShowTutorialHint(false);
    }
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
        padding: '24px',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          padding: '4px',
          borderRadius: '24px',
          background: 'rgba(10, 10, 15, 0.7)',
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(0, 229, 255, 0.05)',
          border: '1px solid rgba(0, 229, 255, 0.15)'
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
            background: '#040407',
            cursor: 'none', // Custom pointer is rendered inside canvas!
            maxWidth: '100%',
            height: 'auto'
          }}
        />

        {/* Swipe Polarity Hover Bar indicator */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(10px)',
          padding: '8px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.05)',
          pointerEvents: 'none'
        }}>
          <div style={{ 
            fontSize: '11px', 
            fontFamily: 'var(--font-hud)', 
            fontWeight: '900', 
            color: polarity === 'pull' ? '#00e5ff' : polarity === 'push' ? '#ff3b30' : '#8e8e93',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textShadow: polarity !== 'off' ? `0 0 6px ${polarity === 'pull' ? '#00e5ff' : '#ff3b30'}` : 'none'
          }}>
            MAGNET STATE: {polarity}
          </div>
        </div>

        {showTutorialHint && currentLevel?.id === 1 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '16px',
            padding: '20px 30px',
            textAlign: 'center',
            pointerEvents: 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            <h4 style={{ fontFamily: 'var(--font-hud)', color: '#00e5ff', fontSize: '16px', marginBottom: '8px' }}>HOW TO PLAY</h4>
            <p style={{ color: 'white', fontSize: '13px', lineHeight: '1.4' }}>
              1. Move your mouse to drag the <strong>Magnetic Anchor</strong>.<br/>
              2. Left-Click (or press <strong>SPACE</strong>) to toggle polarities:<br/>
              <span style={{ color: '#00e5ff' }}>PULL (Cyan)</span> &rarr; <span style={{ color: '#ff3b30' }}>PUSH (Red)</span> &rarr; OFF<br/>
              3. Press <strong>R</strong> to restart level anytime.
            </p>
          </div>
        )}
      </div>

      {/* Controller Buttons below Canvas */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        gap: '24px',
        width: '100%',
        maxWidth: '720px',
        justifyContent: 'space-between'
      }}>
        <div style={{ color: '#8e8e93', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={16} /> Web Audio Synced Synthesizer
        </div>
        <button 
          onClick={onReset}
          className="neon-btn"
          style={{ padding: '8px 16px', fontSize: '11px', borderRadius: '10px' }}
        >
          <RefreshCw size={14} /> Restart Stage (R)
        </button>
      </div>
    </div>
  );
};

export default GameCanvas;
