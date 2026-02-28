/* entity.js — Base Entity Class
   Engine equivalent: Node2D (Godot) / GameObject (Unity)
   All game objects (player, enemies, items) extend this. */

class Entity {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.speed = 0;
    this.collisionRadius = 8;
    this.facing = 'down';
    this.isMoving = false;
    this.active = true;
    this.animTimer = 0;
    this.tags = new Set();
  }

  update(dt, tilemap) {
    if (this.vx !== 0 || this.vy !== 0) this.moveWithCollision(dt, tilemap);
    if (this.isMoving) {
      this.animTimer += dt;
      if (Math.abs(this.vx) > Math.abs(this.vy))
        this.facing = this.vx > 0 ? 'right' : 'left';
      else
        this.facing = this.vy > 0 ? 'down' : 'up';
    } else {
      this.animTimer = 0;
    }
  }

  moveWithCollision(dt, tilemap) {
    const nx = this.x + this.vx * dt;
    const ny = this.y + this.vy * dt;
    const r = this.collisionRadius;
    if (!Utils.circleCollidesWithMap(nx, this.y, r, tilemap)) this.x = nx;
    if (!Utils.circleCollidesWithMap(this.x, ny, r, tilemap)) this.y = ny;
  }

  draw(ctx) {
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.collisionRadius, 0, Math.PI*2);
    ctx.fill();
  }

  hasTag(tag) { return this.tags.has(tag); }
}
