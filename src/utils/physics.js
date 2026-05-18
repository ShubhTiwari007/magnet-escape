// Custom 2D Vector and Kinematics Physics Engine for MagnaShift

export const Vector = {
  create: (x = 0, y = 0) => ({ x, y }),
  
  add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),
  
  sub: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),
  
  mult: (v, n) => ({ x: v.x * n, y: v.y * n }),
  
  div: (v, n) => (n !== 0 ? { x: v.x / n, y: v.y / n } : { x: 0, y: 0 }),
  
  mag: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
  
  dist: (v1, v2) => Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2),
  
  normalize: (v) => {
    const m = Math.sqrt(v.x * v.x + v.y * v.y);
    return m !== 0 ? { x: v.x / m, y: v.y / m } : { x: 0, y: 0 };
  },
  
  dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y,
  
  limit: (v, max) => {
    const m = Math.sqrt(v.x * v.x + v.y * v.y);
    if (m > max) {
      return { x: (v.x / m) * max, y: (v.y / m) * max };
    }
    return { ...v };
  }
};

/**
 * Calculates the magnetic force exerted on a steel core ball by a magnet source.
 * @param {Object} ballPos - {x, y} coordinates of the steel core.
 * @param {Object} magnetPos - {x, y} coordinates of the magnetic anchor.
 * @param {string} polarity - 'pull' (cyan attract) or 'push' (red repel) or 'off'
 * @param {Object} config - Custom physics parameters.
 */
export function calculateMagneticForce(ballPos, magnetPos, polarity, config = {}) {
  if (polarity === 'off') return Vector.create(0, 0);

  const {
    strength = 280,   // Base strength multiplier
    minDist = 35,     // Safe threshold to prevent division by zero / infinite forces
    maxDist = 600     // Maximum range of magnetic attraction
  } = config;

  const d = Vector.dist(ballPos, magnetPos);
  
  // If the object is outside magnetic range, no force is exerted
  if (d > maxDist || d < 2) return Vector.create(0, 0);

  // Direction vector
  let dir = Vector.sub(magnetPos, ballPos);
  
  // Force decays with square of distance: F = G * m1 * m2 / r^2
  // We use clamping to ensure smooth gameplay (not launching ball at speed of light when close)
  const clampedDist = Math.max(d, minDist);
  const forceMagnitude = strength / (clampedDist * clampedDist * 0.003);

  // Normalize direction vector
  dir = Vector.normalize(dir);

  if (polarity === 'pull') {
    return Vector.mult(dir, forceMagnitude);
  } else if (polarity === 'push') {
    return Vector.mult(dir, -forceMagnitude * 1.1); // Repelling is slightly more springy
  }

  return Vector.create(0, 0);
}

/**
 * Resolves collisons of a spherical core with solid grid tiles.
 * Employs Axis-Separated Swept collisions for perfect wall-sliding.
 */
export function resolveMapCollisions(ball, mapGrid, tileSize) {
  const radius = ball.radius;
  const bounce = 0.35; // Damping factor on impact (metal-on-wall elastic reflection)
  const friction = 0.985; // Air resistance and rolling friction

  // 1. Move along X axis and check collisions
  ball.pos.x += ball.vel.x;
  
  // Grid coordinates surrounding the ball
  let startCol = Math.floor((ball.pos.x - radius) / tileSize);
  let endCol = Math.floor((ball.pos.x + radius) / tileSize);
  let startRow = Math.floor((ball.pos.y - radius) / tileSize);
  let endRow = Math.floor((ball.pos.y + radius) / tileSize);

  // Clamp within grid boundaries
  const rowsCount = mapGrid.length;
  const colsCount = mapGrid[0] ? mapGrid[0].length : 0;

  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      if (r >= 0 && r < rowsCount && c >= 0 && c < colsCount) {
        if (mapGrid[r][c] === 1) { // 1 represents a Solid Wall
          const tileLeft = c * tileSize;
          const tileRight = tileLeft + tileSize;
          const tileTop = r * tileSize;
          const tileBottom = tileTop + tileSize;

          // Closest point on tile bounding box to circle center
          const closestX = Math.max(tileLeft, Math.min(ball.pos.x, tileRight));
          const closestY = Math.max(tileTop, Math.min(ball.pos.y, tileBottom));

          const distX = ball.pos.x - closestX;
          const distY = ball.pos.y - closestY;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < radius && distance > 0) {
            // Push out along X
            const overlap = radius - distance;
            const normX = distX / distance;
            
            // Only push X if normal points horizontally
            if (Math.abs(normX) > 0.7) {
              ball.pos.x += normX * overlap;
              ball.vel.x = -ball.vel.x * bounce;
              ball.vel.y *= friction; // Wall scrape friction
            }
          }
        }
      }
    }
  }

  // 2. Move along Y axis and check collisions
  ball.pos.y += ball.vel.y;
  
  startCol = Math.floor((ball.pos.x - radius) / tileSize);
  endCol = Math.floor((ball.pos.x + radius) / tileSize);
  startRow = Math.floor((ball.pos.y - radius) / tileSize);
  endRow = Math.floor((ball.pos.y + radius) / tileSize);

  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      if (r >= 0 && r < rowsCount && c >= 0 && c < colsCount) {
        if (mapGrid[r][c] === 1) {
          const tileLeft = c * tileSize;
          const tileRight = tileLeft + tileSize;
          const tileTop = r * tileSize;
          const tileBottom = tileTop + tileSize;

          const closestX = Math.max(tileLeft, Math.min(ball.pos.x, tileRight));
          const closestY = Math.max(tileTop, Math.min(ball.pos.y, tileBottom));

          const distX = ball.pos.x - closestX;
          const distY = ball.pos.y - closestY;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < radius && distance > 0) {
            const overlap = radius - distance;
            const normY = distY / distance;

            // Only push Y if normal points vertically
            if (Math.abs(normY) > 0.7) {
              ball.pos.y += normY * overlap;
              ball.vel.y = -ball.vel.y * bounce;
              ball.vel.x *= friction;
            }
          }
        }
      }
    }
  }

  // Keep inside screen boundaries
  const screenW = colsCount * tileSize;
  const screenH = rowsCount * tileSize;

  if (ball.pos.x - radius < 0) {
    ball.pos.x = radius;
    ball.vel.x = -ball.vel.x * bounce;
  } else if (ball.pos.x + radius > screenW) {
    ball.pos.x = screenW - radius;
    ball.vel.x = -ball.vel.x * bounce;
  }

  if (ball.pos.y - radius < 0) {
    ball.pos.y = radius;
    ball.vel.y = -ball.vel.y * bounce;
  } else if (ball.pos.y + radius > screenH) {
    ball.pos.y = screenH - radius;
    ball.vel.y = -ball.vel.y * bounce;
  }
}

/**
 * Line Segment to Circle Intersection Test (for Laser beams)
 * Returns true if segment p1->p2 intersects a circle at center with given radius.
 */
export function testLaserIntersection(p1, p2, center, radius) {
  const d = Vector.sub(p2, p1);
  const f = Vector.sub(p1, center);
  
  const a = Vector.dot(d, d);
  const b = 2 * Vector.dot(f, d);
  const c = Vector.dot(f, f) - radius * radius;
  
  const discriminant = b * b - 4 * a * c;
  
  if (discriminant < 0) {
    return false; // No intersection with the infinite line
  }
  
  // Check if intersection occurs inside the line segment bounds
  const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
  
  if (t1 >= 0 && t1 <= 1) return true;
  if (t2 >= 0 && t2 <= 1) return true;
  
  return false;
}
