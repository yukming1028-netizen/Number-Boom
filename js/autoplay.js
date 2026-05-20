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

function autoStep() {
  if (!autoPlaying) return
  if (state !== 'playing') {
    // Game over → auto restart with same mode
    if (state === 'gameover' && autoMode) {
      startGame(autoMode)
      return
    }
    stopAutoPlay()
    return
  }

  // Find best column to drop
  let bestCol = -1, bestScore = -1
  for (let c = 0; c < grid.cols; c++) {
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
