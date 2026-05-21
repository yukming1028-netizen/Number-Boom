// ===== AUTOPLAY — Optimized Strategy =====
// Core principle: DROP is king. Items are emergency tools only.
// Goal: synthesize the highest value tiles possible.

let autoMode = null
let autoLastAction = ''  // track to detect loops

function startAutoPlay(m) {
  autoPlaying = true
  autoMode = m || mode
  autoLastAction = ''
}

function stopAutoPlay() {
  autoPlaying = false
  autoMode = null
}

// Fever score + gauge
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

// Evaluate a merge result — higher = better
// Exponentially reward high-value merges (synthesizing top tiles is the goal)
function evalResult(result) {
  if (!result || result.score <= 0) return 0
  var s = 0
  for (var i = 0; i < result.events.length; i++) {
    var nv = result.events[i].newValue
    // Exponential: value 5→25, 8→64, 10→100, 12→144
    s += nv * nv * 3
  }
  // Chain bonus (cascading merges are extremely valuable)
  s += result.chains * result.chains * 30
  s += result.score * 0.1
  return s
}

// Find best column to drop current piece
function findBestDrop(piece) {
  var bestCol = -1, bestScore = -1, bestMergeScore = 0
  for (var c = 0; c < grid.cols; c++) {
    var tg = grid.clone()
    var row = tg.drop(c, piece)
    if (row === -1) continue
    var result = tg.processMerges()
    var s = evalResult(result)
    // Even if no merge, prefer columns that keep board open
    // (drop to shortest column = more room)
    if (s === 0) {
      // Measure how compact this column is (prefer dropping onto same value)
      var belowV = row + 1 < grid.rows ? grid.cells[row + 1][c] : -1
      var sideL = c > 0 ? grid.cells[row][c - 1] : -1
      var sideR = c < grid.cols - 1 ? grid.cells[row][c + 1] : -1
      if (belowV === piece) s += 5
      if (sideL === piece || sideR === piece) s += 4
      // Prefer not filling up the top row
      if (row > 0) s += 1
    }
    if (s > bestScore) {
      bestScore = s
      bestCol = c
      bestMergeScore = result.score
    }
  }
  return { col: bestCol, score: bestScore, mergeScore: bestMergeScore }
}

// Find best swap (returns null if no beneficial swap found)
function findBestSwap() {
  var best = null, bestScore = 0
  var dirs = [[0, 1], [1, 0]]
  for (var r = 0; r < grid.rows; r++) {
    for (var c = 0; c < grid.cols; c++) {
      if (grid.cells[r][c] === 0) continue
      for (var d = 0; d < dirs.length; d++) {
        var nr = r + dirs[d][0], nc = c + dirs[d][1]
        if (nr >= grid.rows || nc >= grid.cols) continue
        if (grid.cells[nr][nc] === 0) continue
        if (grid.cells[r][c] === grid.cells[nr][nc]) continue
        var tg = grid.clone()
        tg.swap(r, c, nr, nc)
        var result = tg.processMerges()
        var s = evalResult(result)
        if (s > bestScore) {
          bestScore = s
          best = { r1: r, c1: c, r2: nr, c2: nc, score: s }
        }
      }
    }
  }
  return best
}

// Find best lightning target (emergency: clear lowest value that has most count)
function findBestLightning() {
  var counts = {}, cells = {}
  for (var r = 0; r < grid.rows; r++) {
    for (var c = 0; c < grid.cols; c++) {
      var v = grid.cells[r][c]
      if (v > 0) {
        counts[v] = (counts[v] || 0) + 1
        if (!cells[v]) cells[v] = { r: r, c: c }
      }
    }
  }
  // Only clear if count >= 4, prefer clearing LOW value tiles (they're worth less)
  var best = null, bestCount = 0, bestVal = 99
  for (var v in counts) {
    var iv = parseInt(v)
    if (counts[v] >= 4) {
      // Clear the one with most tiles AND lowest value (preserve high-value tiles)
      if (counts[v] > bestCount || (counts[v] === bestCount && iv < bestVal)) {
        bestCount = counts[v]
        bestVal = iv
        best = cells[v]
      }
    }
  }
  return best
}

// Find hammer target: remove a lone low-value tile that's between two same-value tiles
function findBestHammer() {
  var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  var best = null, bestVal = 0

  for (var r = 0; r < grid.rows; r++) {
    for (var c = 0; c < grid.cols; c++) {
      var v = grid.cells[r][c]
      if (v <= 0) continue

      // Check if this cell is sandwiched between two same-value neighbors
      // Horizontal: ? — v — ?
      if (c > 0 && c < grid.cols - 1) {
        var lv = grid.cells[r][c - 1], rv = grid.cells[r][c + 1]
        if (lv === rv && lv > 0 && lv !== v && v < lv) {
          // Hammering this lets gravity potentially merge the lv pair
          if (lv > bestVal) { bestVal = lv; best = { r: r, c: c } }
        }
      }
      // Vertical: ? / v / ?
      if (r > 0 && r < grid.rows - 1) {
        var tv = grid.cells[r - 1][c], bv = grid.cells[r + 1][c]
        if (tv === bv && tv > 0 && tv !== v && v < tv) {
          if (tv > bestVal) { bestVal = tv; best = { r: r, c: c } }
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

  // ========================================================
  // DECISION TREE: evaluate ALL options, pick the best one
  // ========================================================

  // 1) Evaluate best drop (always available, primary action)
  var dropResult = findBestDrop(currentPiece)
  var dropScore = dropResult.score

  // 2) Evaluate best swap (if it creates a merge)
  var swapMove = findBestSwap()
  var swapScore = swapMove ? swapMove.score : 0

  // 3) Items only when board is dangerously full (> 75%)
  var useLightning = false, useHammer = false
  if (fullness > 0.75) {
    useLightning = true
    if (fullness > 0.85) useHammer = true
  }

  // === Compare drop vs swap — pick the HIGHEST value action ===

  // Swap beats drop ONLY if it creates significantly higher value
  // (swap costs an item, drop is free)
  if (swapMove && swapScore > dropScore * 1.5 && swapScore > 20) {
    grid.swap(swapMove.r1, swapMove.c1, swapMove.r2, swapMove.c2)
    autoItemsUsed.swap++
    var result = grid.processMerges()
    applyFeverScore(result)
    trackSynthesis(result)
    autoLastAction = 'swap'
    if (mode === 'daily') checkDailyComplete()
    if (grid.isGameOver()) endGame()
    return
  }

  // Lightning: ONLY if board is very full AND drop doesn't create good merges
  if (useLightning && dropScore < 15) {
    var lt = findBestLightning()
    if (lt) {
      grid.lightning(lt.r, lt.c)
      autoItemsUsed.lightning++
      var result = grid.processMerges()
      applyFeverScore(result)
      trackSynthesis(result)
      autoLastAction = 'lightning'
      if (mode === 'daily') checkDailyComplete()
      if (grid.isGameOver()) endGame()
      return
    }
  }

  // Hammer: ONLY if board nearly full AND no good drop/swap
  if (useHammer && dropScore < 10 && swapScore < 10) {
    var ht = findBestHammer()
    if (ht) {
      grid.hammer(ht.r, ht.c)
      autoItemsUsed.hammer++
      var result = grid.processMerges()
      applyFeverScore(result)
      trackSynthesis(result)
      autoLastAction = 'hammer'
      if (mode === 'daily') checkDailyComplete()
      if (grid.isGameOver()) endGame()
      return
    }
  }

  // === DEFAULT: Drop (the primary action 90%+ of the time) ===
  var col = dropResult.col
  if (col === -1) {
    // All columns full — fallback: find any non-full column
    for (var c = 0; c < grid.cols; c++) {
      if (grid.cells[0][c] === 0) { col = c; break }
    }
  }
  if (col === -1) col = 0  // truly stuck
  doDrop(col)
  autoLastAction = 'drop'
}
