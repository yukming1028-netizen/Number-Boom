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
  var feverGain = (result.events.length * 3 + result.chains * 5) * 0.3
  if (!feverActive) {
    feverGauge = Math.min(FEVER_MAX, feverGauge + feverGain)
    if (feverGauge >= FEVER_MAX) {
      feverActive = true
      feverTimer = FEVER_DURATION
      addToast('\uD83D\uDD25 FEVER TIME\uFF01', '\uD83D\uDD25')
      particles.emitRainbow(W / 2, H / 3)
    }
  }
  var gained = result.score * (feverActive ? 2 : 1)
  score += gained
  if (result.chains > maxCombo) maxCombo = result.chains
}

function boardFullness() {
  var filled = 0
  for (var r = 0; r < grid.rows; r++)
    for (var c = 0; c < grid.cols; c++)
      if (grid.cells[r][c] > 0) filled++
  return filled / (grid.rows * grid.cols)
}

// Get all non-empty cells
function getFilledCells() {
  var cells = []
  for (var r = 0; r < grid.rows; r++)
    for (var c = 0; c < grid.cols; c++)
      if (grid.cells[r][c] > 0) cells.push({ r: r, c: c, v: grid.cells[r][c] })
  return cells
}

// Find the best swap that creates a merge (highest value possible)
function findBestSwap() {
  var best = null, bestScore = 0
  var dirs = [[0, 1], [1, 0]] // right, down only (avoid duplicate pairs)
  for (var r = 0; r < grid.rows; r++) {
    for (var c = 0; c < grid.cols; c++) {
      if (grid.cells[r][c] === 0) continue
      for (var d = 0; d < dirs.length; d++) {
        var nr = r + dirs[d][0], nc = c + dirs[d][1]
        if (nr >= grid.rows || nc >= grid.cols) continue
        if (grid.cells[nr][nc] === 0) continue
        // Don't swap same values
        if (grid.cells[r][c] === grid.cells[nr][nc]) continue
        // Try swap
        var tg = grid.clone()
        tg.swap(r, c, nr, nc)
        var result = tg.processMerges()
        if (result.score > 0) {
          // Score: weight by max new value created + chain bonus
          var maxNew = 0
          for (var i = 0; i < result.events.length; i++) {
            if (result.events[i].newValue > maxNew) maxNew = result.events[i].newValue
          }
          var s = maxNew * 100 + result.score + result.chains * 50
          if (s > bestScore) {
            bestScore = s
            best = { r1: r, c1: c, r2: nr, c2: nc, maxNew: maxNew }
          }
        }
      }
    }
  }
  return best
}

function autoStep() {
  if (!autoPlaying) return
  if (state === 'gameover') {
    stopAutoPlay()
    state = 'auto_summary'
    return
  }
  if (state !== 'playing') { stopAutoPlay(); return }

  var fullness = boardFullness()

  // === Phase 1: Swap — find a swap that creates a merge (always try first) ===
  var swapMove = findBestSwap()
  if (swapMove && swapMove.maxNew >= 3) {
    grid.swap(swapMove.r1, swapMove.c1, swapMove.r2, swapMove.c2)
    autoItemsUsed.swap++
    var result = grid.processMerges()
    applyFeverScore(result)
    trackSynthesis(result)
    if (result.chains >= 3) addToast('\u26A1 ' + result.chains + '\u9023\u64CA\uFF01', '\uD83D\uDCA5')
    if (mode === 'daily') checkDailyComplete()
    if (grid.isGameOver()) endGame()
    return
  }

  // === Phase 2: Lightning — clear most abundant LOW-value tiles when board > 60% ===
  if (fullness > 0.6) {
    var counts = {}
    var countCells = {}
    for (var r = 0; r < grid.rows; r++) {
      for (var c = 0; c < grid.cols; c++) {
        var v = grid.cells[r][c]
        if (v > 0 && v < 6) { // only clear low-value tiles (1-5)
          counts[v] = (counts[v] || 0) + 1
          if (!countCells[v]) countCells[v] = { r: r, c: c }
        }
      }
    }
    var lightningTarget = null, lightningCount = 0
    for (var v in counts) {
      if (counts[v] >= 4 && counts[v] > lightningCount) {
        lightningTarget = parseInt(v)
        lightningCount = counts[v]
      }
    }
    if (lightningTarget !== null) {
      var tc = countCells[lightningTarget]
      grid.lightning(tc.r, tc.c)
      autoItemsUsed.lightning++
      var result = grid.processMerges()
      applyFeverScore(result)
      trackSynthesis(result)
      if (mode === 'daily') checkDailyComplete()
      if (grid.isGameOver()) endGame()
      return
    }
  }

  // === Phase 3: Hammer — remove a tile blocking a potential high-value merge ===
  // Find groups of size 2 (one short of merge), hammer the neighbor that blocks them
  if (fullness > 0.5) {
    var bestHammer = findHammerTarget()
    if (bestHammer) {
      grid.hammer(bestHammer.r, bestHammer.c)
      autoItemsUsed.hammer++
      var result = grid.processMerges()
      applyFeverScore(result)
      trackSynthesis(result)
      if (mode === 'daily') checkDailyComplete()
      if (grid.isGameOver()) endGame()
      return
    }
  }

  // === Phase 4: Drop — find best column ===
  var bestCol = -1, bestScore = -1
  for (var c = 0; c < grid.cols; c++) {
    var testGrid = grid.clone()
    var row = testGrid.drop(c, currentPiece)
    if (row === -1) continue
    var result = testGrid.processMerges()
    var s = 0
    // Heavily weight higher value merges
    for (var i = 0; i < result.events.length; i++) {
      s += result.events[i].newValue * result.events[i].newValue * 5
    }
    s += result.score
    if (result.chains > 1) s += result.chains * 80
    if (s > bestScore) { bestScore = s; bestCol = c }
  }
  if (bestCol === -1) bestCol = Math.floor(Math.random() * grid.cols)
  doDrop(bestCol)
}

// Find hammer target: look for groups of 2 same-value tiles that are adjacent,
// find a different-value neighbor that we can hammer to make space for a 3rd
function findHammerTarget() {
  var visited = {}
  var best = null, bestVal = 0

  for (var r = 0; r < grid.rows; r++) {
    for (var c = 0; c < grid.cols; c++) {
      var v = grid.cells[r][c]
      if (v === 0 || v >= 11) continue // don't waste hammer on low priority
      var key = r + ',' + c
      if (visited[key]) continue

      // Find all same-value neighbors (BFS limited to size 2)
      var pair = [{ r: r, c: c }]
      visited[key] = true
      var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      for (var d = 0; d < dirs.length; d++) {
        var nr = r + dirs[d][0], nc = c + dirs[d][1]
        if (nr >= 0 && nr < grid.rows && nc >= 0 && nc < grid.cols
          && grid.cells[nr][nc] === v && !visited[nr + ',' + nc]) {
          pair.push({ r: nr, c: nc })
          visited[nr + ',' + nc] = true
          break // only need pair of 2
        }
      }

      if (pair.length === 2) {
        // For each cell in the pair, check if there's an empty neighbor
        // or a different-value neighbor we could hammer to extend group
        for (var p = 0; p < pair.length; p++) {
          for (var d = 0; d < dirs.length; d++) {
            var nr = pair[p].r + dirs[d][0], nc = pair[p].c + dirs[d][1]
            if (nr >= 0 && nr < grid.rows && nc >= 0 && nc < grid.cols) {
              var nv = grid.cells[nr][nc]
              // Empty cell: dropping same value here would create group of 3
              // But we can't hammer empty. Look for a different low-value blocker
              if (nv > 0 && nv !== v && nv < v) {
                // Hammering this would let gravity possibly align things
                // Only worth it for higher value groups
                if (v > bestVal) {
                  bestVal = v
                  best = { r: nr, c: nc }
                }
              }
            }
          }
        }
      }
    }
  }
  return best
}
