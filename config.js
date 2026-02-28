/* config.js — Game constants & settings
   Engine equivalent: Project Settings */

const CONFIG = {
  TILE_SIZE: 32,
  RENDER_COLS: 20,
  RENDER_ROWS: 15,
  PLAYER_SPEED: 150,
  PLAYER_RADIUS: 10,
  PLAYER_VISUAL_RADIUS: 12,
  CAMERA_LERP: 0.1,
  COLORS: {
    floor1: '#2a2520', floor2: '#262118',
    wall: '#4a3f32', wallTop: '#5c4f3e', wallDark: '#1e1a14',
    gridLine: '#1a1610',
    player: '#d4a853', playerDk: '#a07830',
    eyes: '#1a1410', shadow: '#00000044',
  },
  TILE: { FLOOR: 0, WALL: 1 },
  SHOW_FPS: true,
  SHOW_COLLIDERS: false,
};
