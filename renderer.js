/* renderer.js — Rendering System
   Engine equivalent: Viewport / CanvasLayer / rendering pipeline
   Manages canvas sizing, pixel-perfect scaling, draw orchestration. */

const Renderer = (() => {
  let canvas, ctx, gameWidth, gameHeight, scale = 1;

  function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    gameWidth = CONFIG.RENDER_COLS * CONFIG.TILE_SIZE;
    gameHeight = CONFIG.RENDER_ROWS * CONFIG.TILE_SIZE;
    canvas.width = gameWidth;
    canvas.height = gameHeight;
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 100));
    return { canvas, ctx, gameWidth, gameHeight };
  }

  function resize() {
    const cw = window.innerWidth, ch = window.innerHeight;
    const aspect = gameWidth / gameHeight;
    let cssW, cssH;
    if (cw/ch > aspect) { cssH = ch; cssW = cssH * aspect; }
    else { cssW = cw; cssH = cssW / aspect; }
    // On mobile leave room for touch controls
    if (window.innerWidth < 768) {
      const maxH = ch * 0.62;
      if (cssH > maxH) { cssH = maxH; cssW = cssH * aspect; }
    }
    canvas.style.width = `${Math.floor(cssW)}px`;
    canvas.style.height = `${Math.floor(cssH)}px`;
    scale = cssW / gameWidth;
  }

  function clear() { ctx.clearRect(0, 0, gameWidth, gameHeight); }

  function drawFrame(camera, tilemap, entities) {
    clear();
    const offset = camera.getOffset();
    ctx.save();
    ctx.translate(offset.x, offset.y);
    tilemap.draw(ctx);
    // Y-sort entities for depth
    const sorted = entities.filter(e => e.active).sort((a,b) => a.y - b.y);
    for (const e of sorted) e.draw(ctx);
    ctx.restore();
  }

  function getScale() { return scale; }

  return { init, clear, drawFrame, getScale };
})();
