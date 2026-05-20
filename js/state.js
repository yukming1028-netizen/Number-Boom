// ===== GAME STATE (must be before resizeCanvas) =====
let state = 'menu'  // menu | playing | item_select | gameover | leaderboard | themes | auto_summary
let mode = 'endless' // daily | endless
let grid = new Grid(5, 5)
let score = 0, moves = 0, maxCombo = 0, rainbowCount = 0
let currentPiece = 1, nextPiece = 1
let itemSelectType = null // 'hammer' | 'lightning' | 'swap'
let swapFirst = null // { r, c } for swap first selection
let toasts = []
let autoPlaying = false // must be declared before randPiece
let lastTouchCol = -1, lastTouchCell = null
let touchStartY = 0
let dailyExpandedRow = false, dailyExpandedCol = false
let frameCount = 0  // for animations
let ripples = []  // { x, y, r, maxR, hue, alpha }
let infParticles = []  // 無限主題 ∞ 粒子群
let synthCounts = {}  // 每日挑戰：追蹤合成次數 { value: count }
let dailyItems = { hammer: 0, swap: 0, lightning: 0 } // 每日挑戰專用道具（看廣告獲得）
let hoverCol = -1  // 觸控/滑鼠懸停列
let gameStartTime = 0  // 遊戲開始時間
let autoItemsUsed = { hammer: 0, swap: 0, lightning: 0 }  // 自動遊玩道具使用統計
