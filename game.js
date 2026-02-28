/* game.js — Main Game Loop & Bootstrap
   Engine equivalent: Main scene / _ready() / Application.Run()
   Loaded LAST so all systems are available. */

const Game = (() => {
  let lastTime = 0, frameCount = 0, fpsTimer = 0, fpsEl = null;

  function start() {
    const { gameWidth, gameHeight } = Renderer.init();
    Input.init();
    SceneManager.init(gameWidth, gameHeight);
    fpsEl = document.getElementById('fps-counter');
    SceneManager.changeScene(new TestRoomScene());
    requestAnimationFrame(loop);
    console.log(`🎮 Dungeon Delve | ${gameWidth}x${gameHeight} | Tile: ${CONFIG.TILE_SIZE}px`);
  }

  function loop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    if (CONFIG.SHOW_FPS) {
      frameCount++; fpsTimer += dt;
      if (fpsTimer >= 1) {
        fpsEl.textContent = `FPS: ${frameCount}`;
        frameCount = 0; fpsTimer = 0;
      }
    }
    SceneManager.update(dt);
    SceneManager.draw();
    requestAnimationFrame(loop);
  }

  return { start };
})();

Game.start();
