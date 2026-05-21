// ===== AUTOPLAY =====
let autoMode = null

function startAutoPlay(m) {
  autoPlaying = true
  autoMode = m || mode
}

function stopAutoPlay() {
  autoPlaying = false
  autoMode = null
}

// Apply fever score multiplier + gauge accumulation (shared logic)
function applyFeverScore(result) {
  if (result.score <= 0) return
  // Fever gauge accumulation
  var feverGain = result.events.length * 3 + result.chains * 5
  if (!feverActive) {
    feverGauge = Math.min(FEVER_MAX, feverGauge + feverGain)
    if (feverGauge >= FEVER_MAX) {
      feverActive = true
      feverTimer = FEVER_DURATION
      addToast('\uD83D\uDD25 FEVER TIME\uFF01', '\uD83D\uDD25')
      particles.emitRainbow(W / 2, H / 3)
    }
  }
  // Score — 2x during fever
  var gained = result.score * (feverActive ? 2 : 1)
  score += gained
  if (result.chains > maxCombo) maxCombo = result.chains
}

function autoStep() {
  if (!autoPlaying) return
  if (state === 'gameover') {
    stopAutoPlay()
    state = 'auto_summary'
    return
  }
  if (state !== 'playing') { stopAutoPlay(); return }

  // Try hammer on highest tile (value >= 7)
  var maxR = -1, maxC = -1, maxV = 0
  for (var r = 0; r < grid.rows; r++) {
    for (var c = 0; c < grid.cols; c++) {
      if (grid.cells[r][c] > maxV) { maxV = grid.cells[r][c]; maxR = r; maxC = c }
    }
  }
  if (maxV >= 7 && maxR >= 0) {
    grid.hammer(maxR, maxC)
    autoItemsUsed.hammer++
    var result = grid.processMerges()
    applyFeverScore(result)
    trackSynthesis(result)
    if (mode === 'daily') checkDailyComplete()
    if (grid.isGameOver()) endGame()
    return
  }

  // Try lightning on tiles with count >= 3
  var counts = {}
  for (var r = 0; r < grid.rows; r++) {
    for (var c = 0; c < grid.cols; c++) {
      var v = grid.cells[r][c]
      if (v > 0) counts[v] = (counts[v] || 0) + 1
    }
  }
  var lightningTarget = null
  for (var v in counts) {
    if (counts[v] >= 4 && (!lightningTarget || counts[v] > counts[lightningTarget])) {
      lightningTarget = parseInt(v)
    }
  }
  if (lightningTarget !== null) {
    for (var r = 0; r < grid.rows; r++) {
      for (var c = 0; c < grid.cols; c++) {
        if (grid.cells[r][c] === lightningTarget) {
          grid.lightning(r, c)
          autoItemsUsed.lightning++
          var result = grid.processMerges()
          applyFeverScore(result)
          trackSynthesis(result)
          if (mode === 'daily') checkDailyComplete()
          if (grid.isGameOver()) endGame()
          return
        }
      }
    }
  }

  // Find best column to drop
  var bestCol = -1, bestScore = -1
  for (var c = 0; c < grid.cols; c++) {
    var testGrid = grid.clone()
    var row = testGrid.drop(c, currentPiece)
    if (row === -1) continue
    var result = testGrid.processMerges()
    var s = result.score + (result.chains > 1 ? result.chains * 50 : 0)
    if (s > bestScore) { bestScore = s; bestCol = c }
  }
  if (bestCol === -1) bestCol = Math.floor(Math.random() * grid.cols)
  doDrop(bestCol)
}
