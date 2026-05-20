// ===== DRAW HELPERS =====
function rr(x,y,w,h,r){
  r=Math.min(r,w/2,h/2)
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r)
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h)
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath()
}
// rr without beginPath — adds to current path
function rrPath(x,y,w,h,r){
  r=Math.min(r,w/2,h/2)
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r)
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h)
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath()
}

function drawBtn(x,y,w,h,color,radius,alpha){
  ctx.save()
  const theme = getTheme()
  if(alpha)ctx.globalAlpha=alpha
  const r=radius||8

  // Theme-specific button styles
  const isDark = theme.id === 'obsidian' || theme.id === 'cyber' || theme.id === 'ocean'
  const isLight = theme.id === 'white' || theme.id === 'ink' || theme.id === 'kawaii'

  // Shadow
  ctx.shadowColor = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = isLight ? 6 : 12; ctx.shadowOffsetY = isLight ? 2 : 4
  ctx.fillStyle=color;rr(x,y,w,h,r);ctx.fill()
  ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0

  // Top highlight
  const hlAlpha = isDark ? 0.15 : 0.25
  const hl=ctx.createLinearGradient(x,y,x,y+h*0.5)
  hl.addColorStop(0,`rgba(255,255,255,${hlAlpha})`);hl.addColorStop(1,'rgba(255,255,255,0)')
  ctx.fillStyle=hl;rr(x,y,w,h,r);ctx.fill()

  // Border — theme colored
  const borderColor = theme.accent || 'rgba(255,255,255,0.15)'
  ctx.strokeStyle = isDark ? borderColor : (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)')
  ctx.lineWidth = isDark ? 1.5 : 1
  rr(x,y,w,h,r);ctx.stroke()

  // 幻彩 theme — rainbow border glow
  if(theme.dynamic){
    const hue = frameCount * 2
    ctx.strokeStyle = `hsla(${hue%360},80%,60%,0.5)`; ctx.lineWidth = 2
    rr(x-1,y-1,w+2,h+2,r+1);ctx.stroke()
  }
  // 黑曜 theme — purple glow
  if(theme.id === 'obsidian'){
    ctx.shadowColor = '#7c4dff'; ctx.shadowBlur = 10
    ctx.strokeStyle = 'rgba(124,77,255,0.4)'; ctx.lineWidth = 1.5
    rr(x,y,w,h,r);ctx.stroke()
    ctx.shadowBlur=0
  }
  // 極白 theme — subtle inner shadow
  if(theme.id === 'white'){
    ctx.strokeStyle = 'rgba(100,100,180,0.2)'; ctx.lineWidth = 1
    rr(x,y,w,h,r);ctx.stroke()
  }
  // 無限 theme — silver shimmer border
  if(theme.liquidMetal){
    const sh = 220 + Math.sin(frameCount*0.02)*15
    ctx.strokeStyle = `hsla(${sh},10%,75%,0.35)`; ctx.lineWidth = 1.5
    rr(x,y,w,h,r);ctx.stroke()
  }

  ctx.restore()
}

// Floating ambient orbs
let bgOrbs = []
function initBgOrbs(){
  bgOrbs=[]
  for(let i=0;i<6;i++){
    bgOrbs.push({x:Math.random()*W,y:Math.random()*H,
      r:30+Math.random()*60, vx:(Math.random()-.5)*.15, vy:(Math.random()-.5)*.15,
      alpha:.04+Math.random()*.06, hue:Math.random()*360})
  }
}
initBgOrbs()

// ===== INFINITY SYMBOL PARTICLES (伯努利雙紐線) =====
function initInfinityParticles(){
  infParticles=[]
  const count=250
  const cx=W/2, cy=H*0.45
  const scale=Math.min(W,H)*0.2
  for(let i=0;i<count;i++){
    let t=(i/count)*Math.PI*2
    let denom=1+Math.sin(t)*Math.sin(t)
    let x=(scale*Math.cos(t))/denom
    let y=(scale*Math.sin(t)*Math.cos(t))/denom
    infParticles.push({
      baseX:cx+x, baseY:cy+y,
      x:cx+x, y:cy+y,
      vx:0, vy:0,
      size:Math.random()*1.2+0.8,
      angleOffset:Math.random()*Math.PI*2
    })
  }
}
initInfinityParticles()
window.addEventListener('resize',()=>{ resizeCanvas(); initBgOrbs(); initInfinityParticles() })

function drawBg(t){
  let bg1=t.bg1, bg2=t.bg2
  // 幻彩 dynamic rainbow background
  if(t.dynamic){
    const h=frameCount*0.5
    bg1=`hsl(${h%360},70%,55%)`; bg2=`hsl(${(h+120)%360},70%,35%)`
  }
  // 無限 theme — silver shimmer
  if(t.liquidMetal){
    const s=frameCount*0.3
    bg1=`hsl(230,8%,${18+Math.sin(s*0.01)*4}%)`
    bg2=`hsl(240,10%,${10+Math.cos(s*0.012)*3}%)`
  }
  const g=ctx.createLinearGradient(0,0,W*0.3,H)
  g.addColorStop(0,bg1);g.addColorStop(1,bg2)
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H)
  const rg=ctx.createRadialGradient(W/2,H*0.15,0,W/2,H*0.15,W*0.7)
  rg.addColorStop(0,'rgba(255,255,255,0.06)');rg.addColorStop(1,'rgba(255,255,255,0)')
  ctx.fillStyle=rg;ctx.fillRect(0,0,W,H)
  for(const o of bgOrbs){
    if(t.dynamic) o.hue=(o.hue+0.3)%360
    if(t.liquidMetal) o.hue=220+Math.sin(frameCount*0.02+o.x*0.01)*15
    o.x+=o.vx;o.y+=o.vy
    if(o.x<-o.r)o.x=W+o.r;if(o.x>W+o.r)o.x=-o.r
    if(o.y<-o.r)o.y=H+o.r;if(o.y>H+o.r)o.y=-o.r
    const og=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r)
    og.addColorStop(0,`hsla(${o.hue},60%,70%,${o.alpha})`);og.addColorStop(1,`hsla(${o.hue},60%,70%,0)`)
    ctx.fillStyle=og;ctx.fillRect(o.x-o.r,o.y-o.r,o.r*2,o.r*2)
  }
  // Liquid metal flowing waves (無限 theme — silver)
  if(t.liquidMetal){
    const wt=frameCount*0.008
    for(let i=0;i<3;i++){
      ctx.beginPath()
      const wg=ctx.createLinearGradient(0,0,W,H)
      wg.addColorStop(0,'rgba(60,62,70,0.06)')
      wg.addColorStop(0.5,'rgba(160,165,175,0.08)')
      wg.addColorStop(1,'rgba(30,32,38,0.06)')
      ctx.fillStyle=wg
      ctx.moveTo(0,H)
      ctx.bezierCurveTo(
        W*0.25,H*0.4+Math.sin(wt+i)*50,
        W*0.75,H*0.6+Math.cos(wt-i)*50,
        W,H*0.5
      )
      ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill()
    }
  }
  // Infinity symbol particles (無限 theme)
  if(t.ripple){
    const pt=frameCount*0.01
    ctx.save()
    for(const p of infParticles){
      // Float breathing
      let floatX=Math.sin(pt*2.5+p.angleOffset)*1.5
      let floatY=Math.cos(pt*2.5+p.angleOffset)*1.5
      let targetX=p.baseX+floatX
      let targetY=p.baseY+floatY
      // Ripple push force
      for(const rp of ripples){
        let dx=p.x-rp.x, dy=p.y-rp.y
        let dist=Math.sqrt(dx*dx+dy*dy)
        if(dist>0 && Math.abs(dist-rp.r)<15){
          let force=(1-rp.r/rp.maxR)*5.5
          p.vx+=(dx/dist)*force
          p.vy+=(dy/dist)*force
        }
      }
      // Spring back
      p.vx+=(targetX-p.x)*0.07
      p.vy+=(targetY-p.y)*0.07
      p.vx*=0.86; p.vy*=0.86
      p.x+=p.vx; p.y+=p.vy
      // Draw particle
      ctx.beginPath()
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2)
      let vel=Math.sqrt(p.vx*p.vx+p.vy*p.vy)
      if(vel>0.5){
        ctx.shadowBlur=Math.min(vel*2,6)
        ctx.shadowColor='rgba(255,255,255,0.5)'
        ctx.fillStyle='rgba(245,248,255,0.95)'
      }else{
        ctx.shadowBlur=0
        ctx.fillStyle='rgba(200,210,225,0.7)'
      }
      ctx.fill()
    }
    ctx.shadowBlur=0
    ctx.restore()
  }
  // Ripples (無限 theme — 銀白光亮)
  for(let i=ripples.length-1;i>=0;i--){
    const rp=ripples[i]
    rp.r+=3; rp.alpha-=0.015
    if(rp.alpha<=0){ripples.splice(i,1);continue}
    ctx.save()
    // 外圈 — 銀白發光
    ctx.strokeStyle=`rgba(240,245,255,${rp.alpha*0.9})`
    ctx.lineWidth=3+rp.r*0.025
    ctx.shadowBlur=18; ctx.shadowColor='rgba(220,230,255,0.8)'
    ctx.beginPath();ctx.arc(rp.x,rp.y,rp.r,0,Math.PI*2);ctx.stroke()
    // 內圈 — 更亮白芯
    if(rp.r>12){
      ctx.strokeStyle=`rgba(255,255,255,${rp.alpha*0.7})`
      ctx.lineWidth=1.5
      ctx.shadowBlur=10; ctx.shadowColor='rgba(255,255,255,0.6)'
      ctx.beginPath();ctx.arc(rp.x,rp.y,rp.r*0.55,0,Math.PI*2);ctx.stroke()
    }
    ctx.restore()
  }
}

// Per-tile random seed
const _tileSeeds = {}
function tileSeed(r, c) {
  const key = r * 100 + c
  if (!_tileSeeds[key]) _tileSeeds[key] = Math.random() * Math.PI * 2
  return _tileSeeds[key]
}

// Smooth flowing gradient — just rotate direction, no color jumping
function flowingGrad(x, y, w, h, colors, speed, seed) {
  const angle = seed + frameCount * speed * 0.012
  const cx = x + w/2, cy = y + h/2
  const len = Math.max(w, h) * 0.7
  const dx = Math.cos(angle) * len
  const dy = Math.sin(angle) * len
  const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy)
  for (let i = 0; i < colors.length; i++) {
    grad.addColorStop(i / (colors.length - 1), colors[i])
  }
  return grad
}

// Theme tile shape path — adds to current path (no beginPath)
function tileShapePath(id, x, y, w, h) {
  const cx = x + w/2, cy = y + h/2
  switch(id) {
    case 'fish': // 魚
      ctx.ellipse(cx - w*0.05, cy, w*0.35, h*0.32, 0, 0, Math.PI * 2)
      ctx.moveTo(x + w*0.68, cy)
      ctx.lineTo(x + w*0.95, cy - h*0.28)
      ctx.lineTo(x + w*0.95, cy + h*0.28)
      ctx.closePath()
      break
    case 'robot': { // 機器人臉
      const u = Math.min(w, h) * 0.01 // 1 unit
      const hx = x + w*0.1, hy = y + h*0.18, hw = w*0.8, hh = h*0.52
      // 天線桿
      ctx.moveTo(cx, hy); ctx.lineTo(cx, hy - 12*u)
      // 天線球
      ctx.moveTo(cx + 3*u, hy - 15*u)
      ctx.arc(cx, hy - 15*u, 3*u, 0, Math.PI*2)
      // 頭部圓角矩形
      rrPath(hx, hy, hw, hh, 8*u)
      // 左耳
      ctx.moveTo(hx, hy + hh*0.5 - 9*u)
      ctx.lineTo(hx - 5*u, hy + hh*0.5 - 9*u)
      ctx.lineTo(hx - 5*u, hy + hh*0.5 + 9*u)
      ctx.lineTo(hx, hy + hh*0.5 + 9*u)
      // 右耳
      ctx.moveTo(hx + hw, hy + hh*0.5 - 9*u)
      ctx.lineTo(hx + hw + 5*u, hy + hh*0.5 - 9*u)
      ctx.lineTo(hx + hw + 5*u, hy + hh*0.5 + 9*u)
      ctx.lineTo(hx + hw, hy + hh*0.5 + 9*u)
      // 左眼
      ctx.moveTo(cx - hw*0.12 + 5*u, hy + hh*0.3)
      ctx.arc(cx - hw*0.12, hy + hh*0.3, 5*u, 0, Math.PI*2)
      // 右眼
      ctx.moveTo(cx + hw*0.12 + 5*u, hy + hh*0.3)
      ctx.arc(cx + hw*0.12, hy + hh*0.3, 5*u, 0, Math.PI*2)
      // 音波嘴巴（5 條豎線）
      for(let i=0;i<5;i++){
        const mx = cx - 8*u + i*4*u
        const mh = (3 + Math.sin(frameCount*0.08 + i)*2) * u
        ctx.moveTo(mx, hy + hh*0.65 - mh)
        ctx.lineTo(mx, hy + hh*0.65 + mh)
      }
      // 脖子
      ctx.moveTo(cx - 8*u, hy + hh)
      ctx.lineTo(cx - 8*u, hy + hh + 7*u)
      ctx.lineTo(cx + 8*u, hy + hh + 7*u)
      ctx.lineTo(cx + 8*u, hy + hh)
      break
    }
    case 'sun': // 太陽
      ctx.arc(cx, cy, Math.min(w,h)*0.3, 0, Math.PI*2)
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4
        const ix=cx+Math.cos(a)*Math.min(w,h)*0.3
        const iy=cy+Math.sin(a)*Math.min(w,h)*0.3
        const ox=cx+Math.cos(a)*Math.min(w,h)*0.45
        const oy=cy+Math.sin(a)*Math.min(w,h)*0.45
        const la=a-0.3, ra=a+0.3
        ctx.moveTo(ix+Math.cos(la)*w*0.02, iy+Math.sin(la)*h*0.02)
        ctx.lineTo(ox, oy)
        ctx.lineTo(ix+Math.cos(ra)*w*0.02, iy+Math.sin(ra)*h*0.02)
      }
      break
    case 'tree': // 樹
      ctx.moveTo(cx, y+h*0.06)
      ctx.lineTo(x+w*0.82, y+h*0.45)
      ctx.lineTo(cx, y+h*0.35)
      ctx.lineTo(x+w*0.18, y+h*0.45)
      ctx.closePath()
      ctx.moveTo(cx, y+h*0.3)
      ctx.lineTo(x+w*0.88, y+h*0.7)
      ctx.lineTo(cx, y+h*0.58)
      ctx.lineTo(x+w*0.12, y+h*0.7)
      ctx.closePath()
      ctx.rect(cx-w*0.08, y+h*0.62, w*0.16, h*0.3)
      break
    case 'flower': // 花
      for(let i=0;i<5;i++){
        const a=i*Math.PI*2/5-Math.PI/2
        const px=cx+Math.cos(a)*w*0.22
        const py=cy+Math.sin(a)*h*0.22
        ctx.moveTo(px+w*0.14,py)
        ctx.arc(px,py,w*0.14,0,Math.PI*2)
      }
      ctx.moveTo(cx+w*0.1,cy)
      ctx.arc(cx,cy,w*0.1,0,Math.PI*2)
      break
    case 'brush': // 毛筆
      ctx.ellipse(cx, cy+h*0.05, w*0.35, h*0.38, 0, 0, Math.PI*2)
      ctx.moveTo(cx-w*0.1, y+h*0.72)
      ctx.lineTo(cx, y+h*0.95)
      ctx.lineTo(cx+w*0.1, y+h*0.72)
      ctx.closePath()
      break
    case 'taiji': { // 太極圖 ☯
      const R = Math.min(w,h)*0.42
      // 外圈
      ctx.arc(cx, cy, R, 0, Math.PI*2)
      // S 曲線：上半右凸 + 下半左凸（不 closePath）
      ctx.moveTo(cx, cy - R)
      ctx.arc(cx, cy - R/2, R/2, -Math.PI/2, Math.PI/2)
      ctx.arc(cx, cy + R/2, R/2, -Math.PI/2, Math.PI/2, true)
      // 上方魚眼（右側黑魚的白眼）
      ctx.moveTo(cx + R*0.13, cy - R/2)
      ctx.arc(cx, cy - R/2, R*0.13, 0, Math.PI*2)
      // 下方魚眼（左側白魚的黑眼）
      ctx.moveTo(cx - R*0.13, cy + R/2)
      ctx.arc(cx, cy + R/2, R*0.13, 0, Math.PI*2)
      break
    }
    case 'rainbow': // 彩虹弧
      ctx.arc(cx, cy + h*0.3, w*0.42, Math.PI, 0)
      ctx.arc(cx, cy + h*0.3, w*0.18, 0, Math.PI, true)
      ctx.closePath()
      break
    case 'hollow': // 空心 — 只畫外框，不填滿
      rrPath(x + w*0.12, y + h*0.12, w*0.76, h*0.76, w*0.08)
      break
    case 'hex': { // 黑曜石寶石刻面線框
      const R1 = Math.min(w,h)*0.44, R2 = Math.min(w,h)*0.24
      const pts = [], inner = []
      for(let i=0;i<6;i++){
        const a = i*Math.PI/3 - Math.PI/2
        pts.push({x: cx+Math.cos(a)*R1, y: cy+Math.sin(a)*R1})
        inner.push({x: cx+Math.cos(a)*R2, y: cy+Math.sin(a)*R2})
      }
      // 外六邊形
      ctx.moveTo(pts[0].x, pts[0].y)
      for(let i=1;i<6;i++) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.closePath()
      // 內六邊形
      ctx.moveTo(inner[0].x, inner[0].y)
      for(let i=1;i<6;i++) ctx.lineTo(inner[i].x, inner[i].y)
      ctx.closePath()
      // 6 條脊線：外→內對應頂點
      for(let i=0;i<6;i++){
        ctx.moveTo(pts[i].x, pts[i].y)
        ctx.lineTo(inner[i].x, inner[i].y)
      }
      break
    }
    case 'infinity': { // 平滑 ∞ 曲線（更圓的胖 ∞）
      const rw = w * 0.44, rh = h * 0.32
      ctx.moveTo(cx, cy)
      ctx.bezierCurveTo(cx - rw*0.6, cy - rh*1.4, cx - rw*1.2, cy - rh*0.4, cx - rw, cy)
      ctx.bezierCurveTo(cx - rw*1.2, cy + rh*0.4, cx - rw*0.6, cy + rh*1.4, cx, cy)
      ctx.bezierCurveTo(cx + rw*0.6, cy - rh*1.4, cx + rw*1.2, cy - rh*0.4, cx + rw, cy)
      ctx.bezierCurveTo(cx + rw*1.2, cy + rh*0.4, cx + rw*0.6, cy + rh*1.4, cx, cy)
      break
    }
  }
}

function drawTile(x, y, w, h, value, t, radius, cellR, cellC) {
  const tc = TILE_COLORS[value] || {bg1:'#555',bg2:'#333'}
  const r = radius || 6
  const seed = tileSeed(cellR || 0, cellC || 0)
  const shape = t && t.shape

  // Outer glow for special tiles
  if (tc.glow) {
    ctx.save()
    const pulse = 0.3 + 0.2 * Math.sin(frameCount * 0.06 + seed)
    ctx.shadowColor = tc.glow; ctx.shadowBlur = 18 + 6 * Math.sin(frameCount * 0.04 + seed)
    ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0
    ctx.fillStyle = tc.glow; ctx.globalAlpha = pulse
    if(shape){ctx.beginPath();tileShapePath(shape,x-3,y-3,w+6,h+6);ctx.fill()}
    else{rr(x-3,y-3,w+6,h+6,r+3);ctx.fill()}
    ctx.restore()
  }

  // Build gradient
  let mainGrad
  if (value === 8) {
    mainGrad = flowingGrad(x, y, w, h,
      ['#FFD700','#FFF1A8','#DAA520','#FFEC80','#F0C040'], 1.5, seed)
  } else if (value === 9) {
    mainGrad = flowingGrad(x, y, w, h,
      ['#4A90D9','#FFFFFF','#5BA0E8','#F0F8FF','#4A90D9'], 2.0, seed)
  } else if (value === 10) {
    const hs = seed * 57.3
    mainGrad = flowingGrad(x, y, w, h,
      [`hsl(${hs%360},85%,65%)`,`hsl(${(hs+72)%360},85%,65%)`,
       `hsl(${(hs+144)%360},85%,65%)`,`hsl(${(hs+216)%360},85%,65%)`,
       `hsl(${(hs+288)%360},85%,65%)`], 2.5, seed)
  } else if (value === 11) {
    mainGrad = flowingGrad(x, y, w, h,
      ['#FFFFFF','#F0F0FF','#FFFFFF','#E8E8FF','#FFFFFF'], 1.8, seed)
  } else if (value === 12) {
    mainGrad = flowingGrad(x, y, w, h,
      ['#2C2C2C','#4A0080','#1A1A2E','#6A0DAD','#2C2C2C'], 1.2, seed)
  } else {
    mainGrad = ctx.createLinearGradient(x, y, x + w * 0.5, y + h)
    mainGrad.addColorStop(0, tc.bg1); mainGrad.addColorStop(1, tc.bg2 || tc.bg1)
  }

  // 有 shape → 鏤空邊框；無 shape（經典）→ 完整填滿
  const borderW = Math.max(3, w * 0.1)

  if(shape){
    // 鏤空邊框
    ctx.save()
    ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=8;ctx.shadowOffsetY=3
    ctx.strokeStyle = mainGrad; ctx.lineWidth = borderW
    ctx.lineJoin = 'round'
    ctx.beginPath();tileShapePath(shape,x,y,w,h);ctx.stroke()
    ctx.restore()
    // 高光
    ctx.save()
    ctx.strokeStyle = `rgba(255,255,255,0.35)`; ctx.lineWidth = borderW * 0.4
    ctx.lineJoin = 'round'
    ctx.beginPath();tileShapePath(shape,x,y,w,h);ctx.stroke()
    ctx.restore()
  } else {
    // 經典完整填滿
    ctx.save()
    ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=8;ctx.shadowOffsetY=3
    ctx.fillStyle = mainGrad
    rr(x,y,w,h,r);ctx.fill()
    ctx.restore()
    // 邊框
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1
    rr(x+0.5,y+0.5,w-1,h-1,r-0.5);ctx.stroke()
    ctx.restore()
    // 玻璃光澤
    ctx.save()
    ctx.beginPath();rrPath(x,y,w,h*0.48,r);ctx.clip()
    const shine = ctx.createLinearGradient(x, y, x, y + h * 0.48)
    shine.addColorStop(0, 'rgba(255,255,255,0.45)'); shine.addColorStop(0.7, 'rgba(255,255,255,0.08)')
    shine.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = shine; ctx.fillRect(x, y, w, h * 0.48)
    const spot = ctx.createRadialGradient(x+w*0.3,y+h*0.15,0,x+w*0.3,y+h*0.15,w*0.35)
    spot.addColorStop(0,'rgba(255,255,255,0.35)');spot.addColorStop(1,'rgba(255,255,255,0)')
    ctx.fillStyle=spot;ctx.fillRect(x,y,w,h*0.48)
    ctx.restore()
  }


}
