/* utils.js — Shared helpers (math, collision)
   Engine equivalent: Math library / utility autoloads */

const Utils = {
  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },
  lerp(a, b, t) {
    return a + (b - a) * t;
  },
  distance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
  },
  normalize(x, y) {
    const len = Math.sqrt(x*x + y*y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: x/len, y: y/len };
  },
  worldToTile(wx, wy) {
    return {
      col: Math.floor(wx / CONFIG.TILE_SIZE),
      row: Math.floor(wy / CONFIG.TILE_SIZE),
    };
  },
  tileToWorld(col, row) {
    return {
      x: col * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
      y: row * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
    };
  },
  circleCollidesWithMap(x, y, radius, tilemap) {
    const offsets = [
      [-radius,-radius],[radius,-radius],[-radius,radius],[radius,radius],
      [0,-radius],[0,radius],[-radius,0],[radius,0],
    ];
    for (const [ox, oy] of offsets) {
      const tile = Utils.worldToTile(x+ox, y+oy);
      if (tilemap.isSolid(tile.col, tile.row)) return true;
    }
    return false;
  },
};
