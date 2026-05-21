// ===== GAME LOGIC =====

function startGame(m) {
  mode = m
  if (m === 'daily') {
    var daily = S.getDaily()
    // Already completed today — cannot replay
    if (daily.completed) { addToast('\u2705 \u4ECA\u65E5\u5DF2\u5B8C\u6210\uFF01', '\u274C'); return }
    // No attempts left
    if ((daily.attempts != null ? daily.attempts : 3) <= 0) { addToast('\u26A0\uFE0F \u6B21\u6578\u7528\u5B8C\uFF01\u770B\u5EE3\u544A\u7372\u5F97\u66F4\u591A', '\u274C'); return }
    // Consume one attempt
    S.useDailyAttempt()
    dailyAttempts = S.getDailyAttempts()
    dailyMaxAttempts = 3
    var ch = daily.challenge
    var cols = ch.cols || 5, rows = ch.rows || 5
    grid = new Grid(cols, rows)
    synthCounts = {}
    for (var k in (daily.synthCounts || {})) synthCounts[k] = daily.synthCounts[k]
  } else {
    grid = new Grid(5, 5)
    synthCounts = {}
  }
  score = 0; moves = 0; maxCombo = 0; rainbowCount = 0
  currentPiece = randPiece(); nextPiece = randPiece()
  itemSelectType = null; swapFirst = null
  dailyExpandedRow = false; dailyExpandedCol = false
  hoverCol = -1
  gameStartTime = Date.now()
  autoItemsUsed = { hammer: 0, swap: 0, lightning: 0 }
  showSettings = false; showExitConfirm = false
  feverGauge = 0; feverActive = false; feverTimer = 0
  recalcLayout()
  state = 'playing'
}

function trackSynthesis(result) {
  if (mode !== 'daily' || !result.events) return
  for (var i = 0; i < result.events.length; i++) {
    var ev = result.events[i]
    synthCounts[ev.newValue] = (synthCounts[ev.newValue] || 0) + 1
  }
}

function doDrop(col) {
  if (state !== 'playing') return
  var row = grid.drop(col, currentPiece)
  if (row === -1) return
  moves++

  var prevRainbow = countRainbow()
  var result = grid.processMerges()
  var newRainbow = countRainbow()

  if (result.score > 0) {
    // Fever gauge accumulation (reduced 70%)
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

    // Score — 2x during fever
    var gained = result.score * (feverActive ? 5 : 1)
    score += gained

    if (result.chains > maxCombo) maxCombo = result.chains
    trackSynthesis(result)
    for (var i = 0; i < result.events.length; i++) {
      var ev = result.events[i]
      var x = boardX + cellGap + ev.anchor.c * (cellW + cellGap) + cellW / 2
      var y = boardTop + cellGap + ev.anchor.r * (cellH + cellGap) + cellH / 2
      particles.emit(x, y, null, ev.newValue)
      if (ev.chain > 1) particles.emit(x, y, null, ev.chain + 5)
    }
    if (result.chains >= 3) addToast('\u26A1 ' + result.chains + '\u9023\u64CA\uFF01', '\uD83D\uDCA5')
    // Achievement checks: combo + merge events
    checkComboAchievements(result.chains)
    for (var ei = 0; ei < result.events.length; ei++) {
      checkMergeAchievements(result.events[ei].newValue)
    }
    // Cumulative merge count
    var cum = S.getCumStats()
    cum.totalMerges = (cum.totalMerges || 0) + result.events.length
    S.saveCumStats(cum)
    checkMergeCountAchievements(cum.totalMerges)
  }

  if (newRainbow > prevRainbow) {
    rainbowCount += (newRainbow - prevRainbow)
    for (var i = prevRainbow; i < newRainbow; i++) {
      addToast('\uD83D\uDC51 \u5F69\u8679\u65B9\u584A\uFF01(' + rainbowCount + ')', '\uD83C\uDF89')
      particles.emitRainbow(W / 2, H / 2)
    }
  }

  currentPiece = nextPiece
  nextPiece = randPiece()
  // Fever: upgrade next piece by +1 (max 9, not rainbow/white/obsidian)
  if (feverActive && nextPiece < 9) nextPiece++

  if (mode === 'daily') checkDailyComplete()
  if (grid.isGameOver()) endGame()
}

function countRainbow() {
  var n = 0
  for (var r = 0; r < grid.rows; r++)
    for (var c = 0; c < grid.cols; c++)
      if (grid.cells[r][c] === 10) n++
  return n
}

function checkDailyComplete() {
  var daily = S.getDaily()
  var ch = daily.challenge
  var passed = false

  if (ch.type === 'tiles') {
    passed = ch.goals.every(function(g) { return (synthCounts[g.value] || 0) >= g.target })
  }
  if (ch.type === 'score' && score >= ch.target) passed = true

  if (passed) {
    daily.completed = true
    daily.synthCounts = {}
    for (var k in synthCounts) daily.synthCounts[k] = synthCounts[k]
    S.saveDaily(daily)
    S.addDailyStreak()
    addToast('\uD83C\uDF89 \u901A\u95DC\uFF01', '\u2705')
    checkDailyAchievement()
    state = 'gameover'
  }
}

function endGame() {
  state = 'gameover'
  var stats = S.getStats()
  stats.gamesPlayed++
  if (grid.getMaxValue() > stats.maxTile) stats.maxTile = grid.getMaxValue()
  if (maxCombo > stats.maxCombo) stats.maxCombo = maxCombo
  stats.totalRainbows = (stats.totalRainbows || 0) + rainbowCount
  S.saveStats(stats)

  if (mode === 'endless') {
    S.setBestEndless(score)
    S.addLB('endless', score, { rainbow: rainbowCount, maxTile: grid.getMaxValue() })
  }
  if (mode === 'daily') {
    var daily = S.getDaily()
    daily.synthCounts = {}
    for (var k in synthCounts) daily.synthCounts[k] = synthCounts[k]
    // Reset attempts count from storage
    dailyAttempts = S.getDailyAttempts()
    dailyMaxAttempts = 3
    S.saveDaily(daily)
  }

  // Cumulative score + achievement checks
  var cum = S.getCumStats()
  cum.totalScore = (cum.totalScore || 0) + score
  S.saveCumStats(cum)
  checkScoreAchievements(cum.totalScore)
  checkDailyCountThemes()
}

function useItemAction(type) {
  if (type === 'hammer' || type === 'lightning') {
    if (!S.useItem(type)) {
      if (mode === 'daily') { watchAdForItem(type); return }
      addToast('\u9053\u5177\u4E0D\u8DB3\uFF01', '\u274C'); return
    }
    itemSelectType = type; swapFirst = null
    state = 'item_select'
  } else if (type === 'swap') {
    if (!S.useItem('swap')) {
      if (mode === 'daily') { watchAdForItem('swap'); return }
      addToast('\u9053\u5177\u4E0D\u8DB3\uFF01', '\u274C'); return
    }
    itemSelectType = 'swap'; swapFirst = null
    state = 'item_select'
    addToast('\uD83D\uDD04 \u9078\u64C7\u7B2C\u4E00\u500B\u65B9\u584A', '\uD83D\uDC46')
  }
}

function watchAdForItem(type) {
  S.addItem(type, 1)
  var icons = { hammer: '\uD83D\uDD28', swap: '\uD83D\uDD04', lightning: '\u26A1' }
  addToast('\uD83D\uDCFA \u7372\u5F97' + icons[type] + '\uFF01', '\u2705')
}

function doItemTarget(r, c) {
  if (itemSelectType === 'hammer') {
    var cleared = grid.hammer(r, c)
    if (cleared.length > 0) {
      var x = boardX + cellGap + c * (cellW + cellGap) + cellW / 2
      var y = boardTop + cellGap + r * (cellH + cellGap) + cellH / 2
      particles.emit(x, y, null, cleared[0].value)
      addToast('\uD83D\uDD28 \u6D88\u9664\uFF01', '\u2705')
    }
  } else if (itemSelectType === 'lightning') {
    var cleared = grid.lightning(r, c)
    if (cleared.length > 0) {
      for (var i = 0; i < cleared.length; i++) {
        var x = boardX + cellGap + cleared[i].c * (cellW + cellGap) + cellW / 2
        var y = boardTop + cellGap + cleared[i].r * (cellH + cellGap) + cellH / 2
        particles.emit(x, y, null, cleared[i].value)
      }
      addToast('\u26A1 \u6D88\u9664 ' + cleared.length + ' \u500B\u540C\u8272\uFF01', '\u2705')
    }
  } else if (itemSelectType === 'swap') {
    if (!swapFirst) {
      if (grid.cells[r][c] === 0) { addToast('\u8ACB\u9078\u64C7\u6709\u65B9\u584A\u7684\u683C\u5B50', '\u26A0\uFE0F'); return }
      swapFirst = { r: r, c: c }
      addToast('\uD83D\uDD04 \u9078\u64C7\u7B2C\u4E8C\u500B\u65B9\u584A', '\uD83D\uDC46')
      return
    } else {
      if (swapFirst.r === r && swapFirst.c === c) { swapFirst = null; addToast('\uD83D\uDD04 \u8ACB\u9078\u53E6\u4E00\u500B\u65B9\u584A', '\u26A0\uFE0F'); return }
      grid.swap(swapFirst.r, swapFirst.c, r, c)
      addToast('\uD83D\uDD04 \u4EA4\u63DB\u5B8C\u6210\uFF01', '\u2705')
    }
  }
  itemSelectType = null; swapFirst = null
  state = 'playing'
  var result = grid.processMerges()
  if (result.score > 0) {
    score += result.score
    trackSynthesis(result)
    for (var i = 0; i < result.events.length; i++) {
      var ev = result.events[i]
      var x = boardX + cellGap + ev.anchor.c * (cellW + cellGap) + cellW / 2
      var y = boardTop + cellGap + ev.anchor.r * (cellH + cellGap) + cellH / 2
      particles.emit(x, y, null, ev.newValue)
    }
    if (result.chains > maxCombo) maxCombo = result.chains
    if (result.chains >= 3) addToast('\u26A1 ' + result.chains + '\u9023\u64CA\uFF01', '\uD83D\uDCA5')
    var newRainbow = countRainbow()
    if (newRainbow > 0) { rainbowCount += newRainbow; addToast('\uD83D\uDC51 \u5F69\u8679\uFF01(' + rainbowCount + ')', '\uD83C\uDF89') }
  }
  if (mode === 'daily') checkDailyComplete()
  if (grid.isGameOver()) endGame()
}

function dailyContinue(what) {
  if (what === 'row' && !dailyExpandedRow) {
    grid.expandRow(); dailyExpandedRow = true
    addToast('\u2195\uFE0F \u68CB\u76E4\u64F4\u5C55 +1\u884C\uFF01', '\u2705')
  } else if (what === 'col' && !dailyExpandedCol) {
    grid.expandCol(); dailyExpandedCol = true
    addToast('\u2194\uFE0F \u68CB\u76E4\u64F4\u5C55 +1\u5217\uFF01', '\u2705')
  }
  recalcLayout()
  state = 'playing'
}

function addToast(text, icon) {
  toasts.push({ text: text, icon: icon, time: Date.now() })
  if (toasts.length > 3) toasts.shift()
}

function formatTime(ms) {
  var s = Math.floor(ms / 1000)
  var m = Math.floor(s / 60)
  s = s % 60
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s
}
