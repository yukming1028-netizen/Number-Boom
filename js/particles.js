// ===== PARTICLES =====
class ParticleSystem {
  constructor(){this.particles=[]}
  emit(x,y,color,value=2){
    const count=8+value*2, speed=1.5+value*0.5, sz=2+value*0.3
    const colors=this._pal(value)
    for(let i=0;i<count;i++){
      const a=(Math.PI*2*i)/count+(Math.random()-.5)*.5, v=speed*(.5+Math.random())
      this.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,decay:.015+Math.random()*.02,size:sz*(.6+Math.random()*.8),color:colors[Math.floor(Math.random()*colors.length)],gravity:.03+Math.random()*.02})
    }
  }
  emitRainbow(x,y){
    for(let i=0;i<30;i++){
      const a=Math.random()*Math.PI*2, v=2+Math.random()*3, hue=(i*12)%360
      this.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,decay:.008+Math.random()*.01,size:3+Math.random()*3,color:`hsl(${hue},100%,60%)`,gravity:.02})
    }
  }
  _pal(v){
    const tc=TILE_COLORS[v]
    if(!tc)return['#fff']
    return[tc.bg1,tc.bg2||tc.bg1,'#fff',tc.bg1+'88']
  }
  update(){
    for(let i=this.particles.length-1;i>=0;i--){
      const p=this.particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.98;p.life-=p.decay
      if(p.life<=0)this.particles.splice(i,1)
    }
  }
  draw(ctx){
    for(const p of this.particles){
      ctx.save();ctx.globalAlpha=p.life
      ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=p.size*2
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill()
      ctx.restore()
    }
  }
  clear(){this.particles=[]}
}

const particles = new ParticleSystem()
