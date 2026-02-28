/* player.js — Player Entity
   Engine equivalent: Player scene/prefab with CharacterBody2D */

class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.speed = CONFIG.PLAYER_SPEED;
    this.collisionRadius = CONFIG.PLAYER_RADIUS;
    this.visualRadius = CONFIG.PLAYER_VISUAL_RADIUS;
    this.tags.add('player');
    this.bobTimer = 0;
  }

  update(dt, tilemap) {
    const dir = Input.getAxis();
    this.vx = dir.x * this.speed;
    this.vy = dir.y * this.speed;
    this.isMoving = (dir.x !== 0 || dir.y !== 0);
    if (this.isMoving) this.bobTimer += dt * 10; else this.bobTimer = 0;
    super.update(dt, tilemap);
  }

  draw(ctx) {
    const C = CONFIG.COLORS, r = this.visualRadius;
    const bob = this.isMoving ? Math.sin(this.bobTimer) * 2 : 0;

    // Shadow
    ctx.fillStyle = C.shadow;
    ctx.beginPath(); ctx.ellipse(this.x, this.y+r+2, r*0.8, 4, 0, 0, Math.PI*2); ctx.fill();

    // Body
    ctx.fillStyle = C.player;
    ctx.beginPath(); ctx.arc(this.x, this.y+bob, r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = C.playerDk;
    ctx.beginPath(); ctx.arc(this.x, this.y+bob, r*0.7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = C.player;
    ctx.beginPath(); ctx.arc(this.x-2, this.y-2+bob, r*0.35, 0, Math.PI*2); ctx.fill();

    // Eyes
    const eo = {up:{x:0,y:-4},down:{x:0,y:4},left:{x:-4,y:0},right:{x:4,y:0}}[this.facing];
    ctx.fillStyle = C.eyes;
    ctx.beginPath(); ctx.arc(this.x+eo.x-3, this.y+eo.y+bob-1, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(this.x+eo.x+3, this.y+eo.y+bob-1, 2, 0, Math.PI*2); ctx.fill();

    // Debug collider
    if (CONFIG.SHOW_COLLIDERS) {
      ctx.strokeStyle = '#ff000088'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.collisionRadius, 0, Math.PI*2); ctx.stroke();
    }
  }
}
