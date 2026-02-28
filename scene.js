/* scene.js — Scene Manager
   Engine equivalent: SceneTree (Godot) / SceneManager (Unity) */

class Scene {
  constructor(name) {
    this.name = name;
    this.tilemap = new Tilemap();
    this.entities = [];
    this.camera = null;
    this.player = null;
  }

  init(gameWidth, gameHeight) {}

  update(dt) {
    for (const e of this.entities) if (e.active) e.update(dt, this.tilemap);
    if (this.camera) this.camera.update(dt);
  }

  draw() {
    if (this.camera) Renderer.drawFrame(this.camera, this.tilemap, this.entities);
  }

  addEntity(entity) { this.entities.push(entity); return entity; }

  removeEntity(entity) {
    const idx = this.entities.indexOf(entity);
    if (idx !== -1) this.entities.splice(idx, 1);
  }

  getEntitiesByTag(tag) {
    return this.entities.filter(e => e.active && e.hasTag(tag));
  }
}

/* --- Test Room Scene --- */
class TestRoomScene extends Scene {
  constructor() { super('test-room'); }

  init(gameWidth, gameHeight) {
    this.tilemap.generateTestRoom(CONFIG.RENDER_COLS, CONFIG.RENDER_ROWS);
    const spawn = this.tilemap.findSpawnPoint();
    this.player = new Player(spawn.x, spawn.y);
    this.addEntity(this.player);
    this.camera = new Camera(gameWidth, gameHeight);
    this.camera.follow(this.player);
    const ws = this.tilemap.getWorldSize();
    this.camera.setBounds(ws.width, ws.height);
  }
}

/* --- Scene Manager Singleton --- */
const SceneManager = (() => {
  let currentScene = null, gw = 0, gh = 0;

  return {
    init(w, h) { gw = w; gh = h; },
    changeScene(scene) { currentScene = scene; currentScene.init(gw, gh); },
    update(dt) { if (currentScene) currentScene.update(dt); },
    draw() { if (currentScene) currentScene.draw(); },
    getCurrent() { return currentScene; },
  };
})();
