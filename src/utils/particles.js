// High-Performance Cyberpunk Neon Particle System for MagnaShift

export class Particle {
  constructor(x, y, vx, vy, color, size, life, type = 'spark') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.type = type; // 'spark', 'flux', 'dust', 'celebrate'
    this.alpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Slight air friction
    this.vx *= 0.98;
    this.vy *= 0.98;

    this.life--;
    this.alpha = Math.max(0, this.life / this.maxLife);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    
    // Add custom neon bloom rendering
    ctx.shadowBlur = this.size * 2;
    ctx.shadowColor = this.color;

    ctx.beginPath();
    if (this.type === 'flux') {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    } else if (this.type === 'dust') {
      // Small squares for cyber laser dust
      ctx.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    } else {
      // standard circular spark
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  addParticle(x, y, vx, vy, color, size, life, type) {
    this.particles.push(new Particle(x, y, vx, vy, color, size, life, type));
  }

  /**
   * Adds an explosion burst when the core ball hits spikes or lasers
   */
  emitExplosion(x, y, color = '#ff9500', count = 35) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 2 + Math.random() * 4;
      const life = 20 + Math.floor(Math.random() * 30);
      
      this.addParticle(x, y, vx, vy, color, size, life, 'spark');
    }
  }

  /**
   * Adds wave particles along the magnetic field line between anchor and ball
   */
  emitMagneticFlux(anchor, ball, polarity) {
    if (polarity === 'off') return;

    // Calculate distance and direction
    const dx = ball.pos.x - anchor.x;
    const dy = ball.pos.y - anchor.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 10) return;

    // Generate random point along the field line to spawn particle
    const t = Math.random();
    
    // Magnetic particle colors based on active mode
    const color = polarity === 'pull' ? '#00e5ff' : '#ff3b30';
    const size = 1.5 + Math.random() * 2;
    const life = 25 + Math.floor(Math.random() * 15);

    // Direction vector
    const ndx = dx / dist;
    const ndy = dy / dist;

    // In pull, particles flow from core toward the anchor
    // In push, particles flow from anchor toward the core
    let spawnX, spawnY;
    let vx, vy;
    
    if (polarity === 'pull') {
      // Spawn closer to core and float toward anchor
      spawnX = ball.pos.x - ndx * (t * dist * 0.8);
      spawnY = ball.pos.y - ndy * (t * dist * 0.8);
      
      // Velocity vector points toward anchor
      vx = -ndx * (2 + Math.random() * 2);
      vy = -ndy * (2 + Math.random() * 2);
    } else {
      // Spawn closer to anchor and float toward core
      spawnX = anchor.x + ndx * (t * dist * 0.8);
      spawnY = anchor.y + ndy * (t * dist * 0.8);
      
      // Velocity vector points toward core
      vx = ndx * (3 + Math.random() * 3);
      vy = ndy * (3 + Math.random() * 3);
    }

    // Add slight noise perpendicular to field line to simulate waves
    const perpX = -ndy;
    const perpY = ndx;
    const noise = (Math.random() - 0.5) * 1.5;
    vx += perpX * noise;
    vy += perpY * noise;

    this.addParticle(spawnX, spawnY, vx, vy, color, size, life, 'flux');
  }

  /**
   * Constant ambient particles rotating around the green exit portal
   */
  emitPortalAmbient(exitX, exitY, exitRadius) {
    if (Math.random() > 0.3) return; // Cap spawn rate to maintain performance

    const angle = Math.random() * Math.PI * 2;
    const dist = exitRadius + 5 + Math.random() * 15;
    const spawnX = exitX + Math.cos(angle) * dist;
    const spawnY = exitY + Math.sin(angle) * dist;

    // Orbital tangent velocity
    const speed = 0.5 + Math.random() * 1;
    const vx = -Math.sin(angle) * speed - Math.cos(angle) * 0.3; // Orbit + pull inward
    const vy = Math.cos(angle) * speed - Math.sin(angle) * 0.3;

    const color = '#32d74b';
    const size = 1 + Math.random() * 2;
    const life = 35 + Math.floor(Math.random() * 25);

    this.addParticle(spawnX, spawnY, vx, vy, color, size, life, 'flux');
  }

  /**
   * Massive neon explosion celebrating a level completion
   */
  emitCelebration(x, y) {
    const colors = ['#32d74b', '#00e5ff', '#af52de', '#ffffd0'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 2 + Math.random() * 3.5;
      const life = 50 + Math.floor(Math.random() * 40);

      this.addParticle(x, y, vx, vy, color, size, life, 'celebrate');
    }
  }

  /**
   * Update all particle physics states and filter dead particles
   */
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Draw all active particles
   */
  draw(ctx) {
    for (const p of this.particles) {
      p.draw(ctx);
    }
  }

  clear() {
    this.particles = [];
  }
}
