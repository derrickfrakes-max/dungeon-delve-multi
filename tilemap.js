/* tilemap.js — Tilemap System
   Engine equivalent: TileMap (Godot) / Tilemap (Unity)
   Stores tile grid, handles collision queries, renders map. */

class Tilemap {
  constructor() {
    this.data = []; this.rows = 0; this.cols = 0;
    this.tileSize = CONFIG.TILE_SIZE;
    this.decorations = [];
  }

  load(data) {
    this.data = data; this.rows = data.length; this.cols = data[0].length;
    this.generateDecorations();
  }

  generateTestRoom(cols, rows) {
    this.cols = cols; this.rows = rows; this.data = [];
    for (let r = 0; r < rows; r++) {
      this.data[r] = [];
      for (let c = 0; c < cols; c++) {
        if (r===0 || r===rows-1 || c===0 || c===cols-1)
          this.data[r][c] = CONFIG.TILE.WALL;
        else if ((r===4||r===10) && (c===5||c===14))
          this.data[r][c] = CONFIG.TILE.WALL;
        else
          this.data[r][c] = CONFIG.TILE.FLOOR;
      }
    }
    this.generateDecorations();
  }

  generateDecorations() {
    this.decorations = [];
    for (let r = 1; r < this.rows-1; r++)
      for (let c = 1; c < this.cols-1; c++)
        if (this.data[r][c]===CONFIG.TILE.FLOOR && Math.random()<0.12)
          this.decorations.push({ r, c, type: Math.random()<0.5?'crack':'pebble' });
  }

  isSolid(col, row) {
    if (row<0||row>=this.rows||col<0||col>=this.cols) return true;
    return this.data[row][col] === CONFIG.TILE.WALL;
  }

  getWorldSize() {
    return { width: this.cols*this.tileSize, height: this.rows*this.tileSize };
  }

  findSpawnPoint() {
    const cr = Math.floor(this.rows/2), cc = Math.floor(this.cols/2);
    for (let d = 0; d < Math.max(this.rows,this.cols); d++)
      for (let dr = -d; dr <= d; dr++)
        for (let dc = -d; dc <= d; dc++) {
          const r = cr+dr, c = cc+dc;
          if (r>0 && r<this.rows-1 && c>0 && c<this.cols-1 && this.data[r][c]===CONFIG.TILE.FLOOR)
            return Utils.tileToWorld(c, r);
        }
    return Utils.tileToWorld(2, 2);
  }

  draw(ctx) {
    const C = CONFIG.COLORS, T = this.tileSize;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c*T, y = r*T;
        if (this.data[r][c] === CONFIG.TILE.WALL) {
          ctx.fillStyle = C.wallDark; ctx.fillRect(x,y,T,T);
          ctx.fillStyle = C.wall; ctx.fillRect(x,y,T,T-4);
          ctx.fillStyle = C.wallTop; ctx.fillRect(x+1,y+1,T-2,6);
          ctx.strokeStyle = C.wallDark; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x,y+T*0.45); ctx.lineTo(x+T,y+T*0.45); ctx.stroke();
          const off = (r%2===0) ? T*0.5 : 0;
          ctx.beginPath(); ctx.moveTo(x+off,y); ctx.lineTo(x+off,y+T*0.45); ctx.stroke();
        } else {
          ctx.fillStyle = (r+c)%2===0 ? C.floor1 : C.floor2;
          ctx.fillRect(x,y,T,T);
          ctx.strokeStyle = C.gridLine; ctx.lineWidth = 0.5; ctx.strokeRect(x,y,T,T);
        }
      }
    }
    for (const d of this.decorations) {
      const x = d.c*T, y = d.r*T;
      if (d.type==='crack') {
        ctx.strokeStyle = '#1a1610'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x+8,y+10); ctx.lineTo(x+16,y+18); ctx.lineTo(x+22,y+14); ctx.stroke();
      } else {
        ctx.fillStyle = '#1e1a14';
        ctx.beginPath(); ctx.arc(x+20,y+22,1.5,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+10,y+16,1,0,Math.PI*2); ctx.fill();
      }
    }
  }
}
