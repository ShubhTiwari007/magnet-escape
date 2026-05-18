// Level Configurations for MagnaShift: Magnet Escape
// Grid elements: 
// 0 = Empty Space
// 1 = Solid Cyber Wall
// 2 = Spike Hazard (Vaporizes Core)

export const LEVEL_GRID_COLS = 16;
export const LEVEL_GRID_ROWS = 12;
export const TILE_SIZE = 45; // Canvas resolution: 720 x 540

export const levels = [
  // ==========================================
  // LEVEL 1: Attraction Chamber (Tutorial)
  // ==========================================
  {
    id: 1,
    name: "Attraction Chamber",
    description: "Use [PULL] (Cyan) to attract the core over the spikes, then use [PUSH] (Red) or inertia to send it to the green exit portal.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 120, y: 350 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 225, radius: 24 },
    anchor: { x: 360, y: 150 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: []
  },

  // ==========================================
  // LEVEL 2: Slingshot Alley (Timing & Corners)
  // ==========================================
  {
    id: 2,
    name: "Slingshot Alley",
    description: "Pull the core downward to gain velocity, then flick polarity to PUSH to navigate around the sharp divider block.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 180, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 550, y: 180, radius: 24 },
    anchor: { x: 500, y: 350 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: []
  },

  // ==========================================
  // LEVEL 3: Laser Corridor (Precision Guidance)
  // ==========================================
  {
    id: 3,
    name: "Laser Corridor",
    description: "Guide the metallic sphere past highly sensitive laser wires. Tapping a laser will vaporize your core instantly!",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 100, y: 110 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 380, radius: 24 },
    anchor: { x: 360, y: 220 },
    lasers: [
      { id: 'laser1', p1: { x: 315, y: 135 }, p2: { x: 315, y: 270 }, color: '#ff9500', active: true },
      { id: 'laser2', p1: { x: 405, y: 270 }, p2: { x: 405, y: 405 }, color: '#ff9500', active: true }
    ],
    buttons: [],
    doors: [],
    rotators: []
  },

  // ==========================================
  // LEVEL 4: Gravity Lock (Pressure Button & Gate)
  // ==========================================
  {
    id: 4,
    name: "Gravity Lock",
    description: "The exit gate is blocked by a heavy metal door. Pull the core onto the orange button to unlock it, then roll home.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 150, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 150, radius: 24 },
    anchor: { x: 300, y: 350 },
    lasers: [],
    buttons: [
      { id: 'btn1', pos: { x: 150, y: 375 }, radius: 16, targetDoorId: 'door1', isPressed: false, color: '#ff9500' }
    ],
    doors: [
      { id: 'door1', gridX: 8, gridY: 7, pos: { x: 8 * 45 + 22.5, y: 7 * 45 + 22.5 }, size: { w: 45, h: 45 }, isOpen: false }
    ],
    rotators: []
  },

  // ==========================================
  // LEVEL 5: Orbit Vortex (Rotating Magnet Fields)
  // ==========================================
  {
    id: 5,
    name: "Orbit Vortex",
    description: "A rotating vortex core spins at the center. Sync your polarities to slingshot the core past the central barrier grids.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 120, y: 225 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 225, radius: 24 },
    anchor: { x: 360, y: 225 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: [
      { id: 'rot1', pos: { x: 360, y: 225 }, radius: 36, angle: 0, spinSpeed: 0.035, strength: 160 }
    ]
  },

  // ==========================================
  // LEVEL 6: Dual Core (Mind-Bending Parallel Puzzles)
  // ==========================================
  {
    id: 6,
    name: "Dual Core Overdrive",
    description: "The ultimate challenge. Guide TWO magnetic cores into the green exit portal simultaneously! Plan wall blocks carefully.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 150, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true },
      { id: 'core2', pos: { x: 570, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 360, y: 225, radius: 26 },
    anchor: { x: 360, y: 100 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: []
  },

  // ==========================================
  // LEVEL 7: Zig-Zag Maze (Precision Rolling)
  // ==========================================
  {
    id: 7,
    name: "Zig-Zag Corridor",
    description: "Navigate a rolling steel core through a winding neon grid. Don't let your speed get out of hand!",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 80, y: 80 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 80, y: 470, radius: 24 },
    anchor: { x: 360, y: 220 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: []
  },

  // ==========================================
  // LEVEL 8: Portal Slingshot (Force Balance)
  // ==========================================
  {
    id: 8,
    name: "Slingshot Cage",
    description: "A heavy electromagnetic vortex is trapped behind spikes. Pull and slingshot around the core with careful timing.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
      [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 90, y: 225 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 630, y: 225, radius: 24 },
    anchor: { x: 360, y: 120 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: [
      { id: 'rot1', pos: { x: 360, y: 225 }, radius: 32, angle: 0, spinSpeed: 0.045, strength: 190 }
    ]
  },

  // ==========================================
  // LEVEL 9: Double Security Lock
  // ==========================================
  {
    id: 9,
    name: "Double Security Lock",
    description: "Two steel walls block the channel. You must click and slide onto both ceiling buttons to open them sequentially.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 100, y: 220 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 220, radius: 24 },
    anchor: { x: 300, y: 150 },
    lasers: [],
    buttons: [
      { id: 'btn1', pos: { x: 100, y: 375 }, radius: 16, targetDoorId: 'door1', isPressed: false, color: '#ff9500' },
      { id: 'btn2', pos: { x: 360, y: 375 }, radius: 16, targetDoorId: 'door2', isPressed: false, color: '#ff9500' }
    ],
    doors: [
      { id: 'door1', gridX: 6, gridY: 7, pos: { x: 6 * 45 + 22.5, y: 7 * 45 + 22.5 }, size: { w: 45, h: 45 }, isOpen: false },
      { id: 'door2', gridX: 10, gridY: 7, pos: { x: 10 * 45 + 22.5, y: 7 * 45 + 22.5 }, size: { w: 45, h: 45 }, isOpen: false }
    ],
    rotators: []
  },

  // ==========================================
  // LEVEL 10: Laser Grid Lock (Disabling switches)
  // ==========================================
  {
    id: 10,
    name: "Laser Grid Lock",
    description: "Three heavy orange laser gates completely block your path. Slide onto the side triggers to shut down security.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 100, y: 225 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 225, radius: 24 },
    anchor: { x: 360, y: 225 },
    lasers: [
      // Standard active lasers
      { id: 'laser1', p1: { x: 292, y: 150 }, p2: { x: 292, y: 300 }, color: '#ff3b30', active: true },
      { id: 'laser2', p1: { x: 428, y: 150 }, p2: { x: 428, y: 300 }, color: '#ff3b30', active: true }
    ],
    // The button disables laser1 and laser2! Wait, in physics loops:
    // If door is targeted we open it. Let's make buttons open door1 or door2.
    // To keep it perfectly integrated, we have a sliding door at index (6, 5) and (9, 5) blocking the gap, opened by buttons!
    buttons: [
      { id: 'btn1', pos: { x: 200, y: 225 }, radius: 16, targetDoorId: 'door1', isPressed: false, color: '#ff9500' },
      { id: 'btn2', pos: { x: 520, y: 225 }, radius: 16, targetDoorId: 'door2', isPressed: false, color: '#ff9500' }
    ],
    doors: [
      { id: 'door1', gridX: 6, gridY: 4, pos: { x: 6 * 45 + 22.5, y: 4 * 45 + 22.5 }, size: { w: 45, h: 45 }, isOpen: false },
      { id: 'door2', gridX: 9, gridY: 4, pos: { x: 9 * 45 + 22.5, y: 4 * 45 + 22.5 }, size: { w: 45, h: 45 }, isOpen: false }
    ],
    rotators: []
  },

  // ==========================================
  // LEVEL 11: Speedrun Alley (Fast Polarity Switches)
  // ==========================================
  {
    id: 11,
    name: "Speedrun Alley",
    description: "A continuous row of spiked floors at the bottom and top. Pull and release quickly to float through.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 100, y: 225 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 225, radius: 24 },
    anchor: { x: 360, y: 225 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: []
  },

  // ==========================================
  // LEVEL 12: Dual Rotator Vortex (Figure-8 Loops)
  // ==========================================
  {
    id: 12,
    name: "Dual Orbit Vortex",
    description: "Two rotating vortex cores spin in opposite directions! Ride their combined gravitational slingshot.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 120, y: 225 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 225, radius: 24 },
    anchor: { x: 360, y: 225 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: [
      { id: 'rot1', pos: { x: 260, y: 225 }, radius: 30, angle: 0, spinSpeed: 0.035, strength: 140 },
      { id: 'rot2', pos: { x: 460, y: 225 }, radius: 30, angle: Math.PI, spinSpeed: -0.035, strength: 140 }
    ]
  },

  // ==========================================
  // LEVEL 13: Parallel Maze (Dual Core Split)
  // ==========================================
  {
    id: 13,
    name: "Parallel Chambers",
    description: "Two cores trapped inside split wall channels. You must drag the anchor at the center to pull both cores in parallel.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 120, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true },
      { id: 'core2', pos: { x: 600, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 360, y: 225, radius: 24 },
    anchor: { x: 360, y: 100 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: []
  },

  // ==========================================
  // LEVEL 14: Laser Gate Escape (Dual Core Co-op)
  // ==========================================
  {
    id: 14,
    name: "Co-op Gate Hack",
    description: "One core must rest on the left button to slide open the barrier blocking the second core's path. Work together!",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 1, 1, 2, 2, 2, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 150, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true },
      { id: 'core2', pos: { x: 570, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 360, y: 225, radius: 24 },
    anchor: { x: 360, y: 100 },
    lasers: [],
    buttons: [
      { id: 'btn1', pos: { x: 150, y: 375 }, radius: 16, targetDoorId: 'door1', isPressed: false, color: '#ff9500' }
    ],
    doors: [
      { id: 'door1', gridX: 9, gridY: 6, pos: { x: 9 * 45 + 22.5, y: 6 * 45 + 22.5 }, size: { w: 45, h: 45 }, isOpen: false }
    ],
    rotators: []
  },

  // ==========================================
  // LEVEL 15: The Centrifuge (Centrifugal Launch)
  // ==========================================
  {
    id: 15,
    name: "The Centrifuge",
    description: "A fast-spinning central vortex is surrounded by an orange spiked border. Build momentum and slingshot out to the exit!",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 120, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 428, y: 380, radius: 24 }, // exit lies at the open gap in the spiked circle!
    anchor: { x: 360, y: 225 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: [
      { id: 'rot1', pos: { x: 360, y: 225 }, radius: 36, angle: 0, spinSpeed: 0.05, strength: 220 }
    ]
  },

  // ==========================================
  // LEVEL 16: Triple Core Challenge
  // ==========================================
  {
    id: 16,
    name: "Triple Core Overdrive",
    description: "Manage THREE cores at once! Anchor placement is critical to avoid spreading cores into the hazard grids.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 120, y: 150 }, vel: { x: 0, y: 0 }, radius: 12, isMetal: true },
      { id: 'core2', pos: { x: 360, y: 150 }, vel: { x: 0, y: 0 }, radius: 12, isMetal: true },
      { id: 'core3', pos: { x: 600, y: 150 }, vel: { x: 0, y: 0 }, radius: 12, isMetal: true }
    ],
    exit: { x: 360, y: 380, radius: 26 },
    anchor: { x: 360, y: 80 },
    lasers: [],
    buttons: [],
    doors: [],
    rotators: []
  },

  // ==========================================
  // LEVEL 17: Timing Gate Lock
  // ==========================================
  {
    id: 17,
    name: "Timing Gate Lock",
    description: "Two heavy locked gates obstruct the final exit portal. Hit the orange switches in quick succession to slip past.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 100, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 150, radius: 24 },
    anchor: { x: 300, y: 350 },
    lasers: [],
    buttons: [
      { id: 'btn1', pos: { x: 200, y: 375 }, radius: 16, targetDoorId: 'door1', isPressed: false, color: '#ff9500' },
      { id: 'btn2', pos: { x: 420, y: 375 }, radius: 16, targetDoorId: 'door2', isPressed: false, color: '#ff9500' }
    ],
    doors: [
      { id: 'door1', gridX: 6, gridY: 6, pos: { x: 6 * 45 + 22.5, y: 6 * 45 + 22.5 }, size: { w: 45, h: 45 }, isOpen: false },
      { id: 'door2', gridX: 10, gridY: 6, pos: { x: 10 * 45 + 22.5, y: 6 * 45 + 22.5 }, size: { w: 45, h: 45 }, isOpen: false }
    ],
    rotators: []
  },

  // ==========================================
  // LEVEL 18: Laser Slingshot Gauntlet
  // ==========================================
  {
    id: 18,
    name: "Slingshot Gauntlet",
    description: "A central vortex spins while sensitive orange lasers block the outer walls. Maintain orbit or face vaporisation!",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 120, y: 225 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 225, radius: 24 },
    anchor: { x: 360, y: 225 },
    lasers: [
      { id: 'laser1', p1: { x: 360, y: 45 }, p2: { x: 360, y: 135 }, color: '#ff3b30', active: true },
      { id: 'laser2', p1: { x: 360, y: 315 }, p2: { x: 360, y: 405 }, color: '#ff3b30', active: true }
    ],
    buttons: [],
    doors: [],
    rotators: [
      { id: 'rot1', pos: { x: 360, y: 225 }, radius: 36, angle: 0, spinSpeed: 0.04, strength: 170 }
    ]
  },

  // ==========================================
  // LEVEL 19: The Switchback (Winding Laser Trail)
  // ==========================================
  {
    id: 19,
    name: "The Neon Switchback",
    description: "A tight corridor filled with rotating laser wires. Control speed meticulously; a single error triggers meltdown.",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 100, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 620, y: 150, radius: 24 },
    anchor: { x: 360, y: 220 },
    lasers: [
      { id: 'laser1', p1: { x: 260, y: 135 }, p2: { x: 260, y: 315 }, color: '#ff9500', active: true },
      { id: 'laser2', p1: { x: 460, y: 135 }, p2: { x: 460, y: 315 }, color: '#ff9500', active: true }
    ],
    buttons: [],
    doors: [],
    rotators: []
  },

  // ==========================================
  // LEVEL 20: Sector MagnaShift Omega
  // ==========================================
  {
    id: 20,
    name: "Sector Omega",
    description: "The ultimate trial. Parallel dual-cores, a central rotator vortex, and sliding barrier gates block your path. Stabilize the grids!",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    balls: [
      { id: 'core1', pos: { x: 150, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true },
      { id: 'core2', pos: { x: 570, y: 150 }, vel: { x: 0, y: 0 }, radius: 14, isMetal: true }
    ],
    exit: { x: 360, y: 225, radius: 26 },
    anchor: { x: 360, y: 100 },
    lasers: [],
    buttons: [
      { id: 'btn1', pos: { x: 150, y: 375 }, radius: 16, targetDoorId: 'door1', isPressed: false, color: '#ff9500' }
    ],
    doors: [
      { id: 'door1', gridX: 9, gridY: 7, pos: { x: 9 * 45 + 22.5, y: 7 * 45 + 22.5 }, size: { w: 45, h: 45 }, isOpen: false }
    ],
    rotators: [
      { id: 'rot1', pos: { x: 360, y: 225 }, radius: 36, angle: 0, spinSpeed: 0.03, strength: 160 }
    ]
  }
];
