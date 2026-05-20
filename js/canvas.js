// ===== CANVAS SETUP =====
const canvas = document.getElementById('c')
const ctx = canvas.getContext('2d')
let W, H, dpr = window.devicePixelRatio || 1

function resizeCanvas() {
  W = Math.min(window.innerWidth, 420)
  H = window.innerHeight
  dpr = window.devicePixelRatio || 1
  canvas.width = W * dpr; canvas.height = H * dpr
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)
  recalcLayout()
}
resizeCanvas()
// resize listener moved to draw.js (handles initBgOrbs + initInfinityParticles)

function randPiece(){ return autoPlaying ? (Math.random() < 0.4 ? 1 : Math.random() < 0.75 ? 2 : 3) : (Math.random() < 0.55 ? 1 : 2) }
currentPiece = randPiece(); nextPiece = randPiece()
