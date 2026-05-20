// ===== GAME LOGIC =====

function startGame(m) {
  mode = m
  if (m === 'daily') {
    const daily = S.getDaily()
    const ch = daily.challenge
    const cols = ch.cols || 5, rows = ch.rows || 5
    grid = new Grid(cols, rows)
    synthCounts = { ...(daily.synthCounts || {}) }
  } else {
    grid = new Grid(5, 5)
    synthCounts = {}
  }
  score = 0; moves = 0; maxCombo = 0; rainbowCount = 0
  currentPiece = randPiece(); nextPiece = randPiece()
  itemSelectType = null; swapFirst = null
  dailyExpandedRow = false; dailyExpandedCol = false
  recalcLayout()
  state = 'playing'
}

function trackSynthesis(result) {
  if (mode !== 'daily' || !result.events) return
  for (const ev of result.events) {
    synthCounts[ev.newValue] = (synthCounts[ev.newValue] || 0) + 1
  }
}

function doDrop(col) {
  if (state !== 'playing') return
  const row = grid.drop(col, currentPiece)
  if (row === -1) return
  moves++

  const prevRainbow = countRainbow()
  const result = grid.processMerges()
  const newRainbow = countRainbow()

  if (result.score > 0) {
    score += result.score
    if (result.chains > maxCombo) maxCombo = result.chains
    trackSynthesis(result)
    for (const ev of result.events) {
      const x = boardX + cellGap + ev.anchor.c * (cellW + cellGap) + cellW / 2
      const y = boardTop + cellGap + ev.anchor.r * (cellH + cellGap) + cellH / 2
      particles.emit(x, y, null, ev.newValue)
      if (ev.chain > 1) particles.emit(x, y, null, ev.chain + 5)
    }
    if (result.chains >= 3) addToast(`⚡ ${result.chains}連擊！`, '💥')
  }

  if (newRainbow > prevRainbow) {
    rainbowCount += (newRainbow - prevRainbow)
    for (let i = prevRainbow; i < newRainbow; i++) {
      addToast(`👑 彩虹方塊！(${rainbowCount})`, '🎉')
      particles.emitRainbow(W / 2, H / 2)
    }
  }

  currentPiece = nextPiece
  nextPiece = randPiece()

  if (mode === 'daily') checkDailyComplete()
  if (grid.isGameOver()) endGame()
}

function countRainbow() {
  let n = 0
  for (const row of grid.cells) for (const v of row) if (v === 10) n++
  return n
}

function checkDailyComplete() {
  const daily = S.getDaily()
  const ch = daily.challenge
  let passed = false

  if (ch.type === 'tiles') {
    passed = ch.goals.every(g => (synthCounts[g.value] || 0) >= g.target)
  }
  if (ch.type === 'score' && score >= ch.target) passed = true

  if (passed) {
    daily.completed = true
    daily.synthCounts = { ...synthCounts }
    S.saveDaily(daily)
    S.addDailyStreak()
    // Reward: each item ×1, once per day
    S.addItem('hammer', 1); S.addItem('swap', 1); S.addItem('lightning', 1)
    addToast('🎁 通關！每款道具+1', '✅')
    state = 'gameover'
  }
}

function endGame() {
  state = 'gameover'
  const stats = S.getStats()
  stats.gamesPlayed++
  if (grid.getMaxValue() > stats.maxTile) stats.maxTile = grid.getMaxValue()
  if (maxCombo > stats.maxCombo) stats.maxCombo = maxCombo
  stats.totalRainbows = (stats.totalRainbows || 0) + rainbowCount
  S.saveStats(stats)

  if (mode === 'endless') {
    S.setBestEndless(score)
    const unlocked = S.getUnlockedThemes()
    for (const th of THEMES) {
      if (th.rainbow > 0 && rainbowCount >= th.rainbow && !unlocked.includes(th.id)) {
        if (S.unlockTheme(th.id)) addToast(`🎨 解鎖主題: ${th.icon} ${th.name}！`, '🎉')
      }
    }
    S.addLB('endless', score, { rainbow: rainbowCount, maxTile: grid.getMaxValue() })
  }
  if (mode === 'daily') {
    const daily = S.getDaily()
    daily.synthCounts = { ...synthCounts }
    S.saveDaily(daily)
  }
}

function useItemAction(type) {
  if (type === 'hammer' || type === 'lightning') {
    if (!S.useItem(type)) {
      if (mode === 'daily') { watchAdForItem(type); return }
      addToast('道具不足！', '❌'); return
    }
    itemSelectType = type; swapFirst = null
    state = 'item_select'
  } else if (type === 'swap') {
    if (!S.useItem('swap')) {
      if (mode === 'daily') { watchAdForItem('swap'); return }
      addToast('道具不足！', '❌'); return
    }
    itemSelectType = 'swap'; swapFirst = null
    state = 'item_select'
    addToast('🔄 選擇第一個方塊', '👆')
  }
}

function watchAdForItem(type) {
  S.addItem(type, 1)
  const icons = { hammer: '🔨', swap: '🔄', lightning: '⚡' }
  addToast(`📹 獲得${icons[type]}！`, '✅')
}

function doItemTarget(r, c) {
  if (itemSelectType === 'hammer') {
    const cleared = grid.hammer(r, c)
    if (cleared.length > 0) {
      const x = boardX + cellGap + c * (cellW + cellGap) + cellW / 2
      const y = boardTop + cellGap + r * (cellH + cellGap) + cellH / 2
      particles.emit(x, y, null, cleared[0].value)
      addToast('🔨 消除！', '✅')
    }
  } else if (itemSelectType === 'lightning') {
    const cleared = grid.lightning(r, c)
    if (cleared.length > 0) {
      for (const cell of cleared) {
        const x = boardX + cellGap + cell.c * (cellW + cellGap) + cellW / 2
        const y = boardTop + cellGap + cell.r * (cellH + cellGap) + cellH / 2
        particles.emit(x, y, null, cell.value)
      }
      addToast(`⚡ 消除 ${cleared.length} 個同色！`, '✅')
    }
  } else if (itemSelectType === 'swap') {
    if (!swapFirst) {
      if (grid.cells[r][c] === 0) { addToast('請選擇有方塊的格子', '⚠️'); return }
      swapFirst = { r, c }
      addToast('🔄 選擇第二個方塊', '👆')
      return
    } else {
      if (swapFirst.r === r && swapFirst.c === c) { swapFirst = null; addToast('🔄 請選另一個方塊', '⚠️'); return }
      grid.swap(swapFirst.r, swapFirst.c, r, c)
      addToast('🔄 交換完成！', '✅')
    }
  }
  itemSelectType = null; swapFirst = null
  state = 'playing'
  const result = grid.processMerges()
  if (result.score > 0) {
    score += result.score
    trackSynthesis(result)
    for (const ev of result.events) {
      const x = boardX + cellGap + ev.anchor.c * (cellW + cellGap) + cellW / 2
      const y = boardTop + cellGap + ev.anchor.r * (cellH + cellGap) + cellH / 2
      particles.emit(x, y, null, ev.newValue)
    }
    if (result.chains > maxCombo) maxCombo = result.chains
    if (result.chains >= 3) addToast(`⚡ ${result.chains}連擊！`, '💥')
    const newRainbow = countRainbow()
    if (newRainbow > 0) { rainbowCount += newRainbow; addToast(`👑 彩虹！(${rainbowCount})`, '🎉') }
  }
  if (mode === 'daily') checkDailyComplete()
  if (grid.isGameOver()) endGame()
}

function dailyContinue(what) {
  if (what === 'row' && !dailyExpandedRow) {
    grid.expandRow(); dailyExpandedRow = true
    addToast('↕️ 棋盤擴展 +1行！', '✅')
  } else if (what === 'col' && !dailyExpandedCol) {
    grid.expandCol(); dailyExpandedCol = true
    addToast('↔️ 棋盤擴展 +1列！', '✅')
  }
  recalcLayout()
  state = 'playing'
}

function addToast(text, icon) {
  toasts.push({ text, icon, time: Date.now() })
  if (toasts.length > 3) toasts.shift()
}
