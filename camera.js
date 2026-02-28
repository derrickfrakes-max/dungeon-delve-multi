/* camera.js — Camera / Viewport
   Engine equivalent: Camera2D (Godot) / Cinemachine (Unity) */

class Camera {
  constructor(viewWidth, viewHeight) {
    this.x = 0; this.y = 0;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.target = null;
    this.lerp = CONFIG.CAMERA_LERP;
    this.bounds = null;
  }

  follow(entity) {
    this.target = entity;
    this.x = entity.x; this.y = entity.y;
  }

  setBounds(worldW, worldH) {
    this.bounds = {
      minX: this.viewWidth/2, minY: this.viewHeight/2,
      maxX: worldW - this.viewWidth/2, maxY: worldH - this.viewHeight/2,
    };
  }

  update(dt) {
    if (!this.target) return;
    this.x = Utils.lerp(this.x, this.target.x, this.lerp);
    this.y = Utils.lerp(this.y, this.target.y, this.lerp);
    if (this.bounds) {
      this.x = Utils.clamp(this.x, this.bounds.minX, this.bounds.maxX);
      this.y = Utils.clamp(this.y, this.bounds.minY, this.bounds.maxY);
    }
  }

  getOffset() {
    return {
      x: Math.round(this.viewWidth/2 - this.x),
      y: Math.round(this.viewHeight/2 - this.y),
    };
  }

  screenToWorld(sx, sy) {
    const off = this.getOffset();
    return { x: sx - off.x, y: sy - off.y };
  }
}
