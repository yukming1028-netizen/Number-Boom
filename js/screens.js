// ===== SCREENS / DRAWING =====

function drawMenu(t) {
  drawBg(t)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 30px Arial'
  ctx.fillText('🔥 數字大爆炸', W / 2, 70)
  ctx.font = '14px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText('Number Boom', W / 2, 98)

  const btnW = 200, btnH = 48, btnX = W / 2 - btnW / 2

  // Endless mode
  drawBtn(btnX, 130, btnW, btnH, t.btnP, 12)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center'
  ctx.fillText('🎮 無盡模式', W / 2, 154)
  ctx.font = '11px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText('最高: ' + S.getBestEndless(), W / 2, 172)

  // Daily challenge
  const daily = S.getDaily()
  const ch = daily.challenge
  const done = daily.completed
  const btnY2 = 195
  drawBtn(btnX, btnY2, btnW, btnH, done ? t.btnS : t.btnP, 12)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center'
  ctx.fillText(done ? '✅ 今日已完成' : '📅 每日挑戰', W / 2, btnY2 + 20)
  ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
  const gridLabel = (ch.cols || 5) + '×' + (ch.rows || 5)
  if (ch.type === 'tiles' && daily.synthCounts && Object.keys(daily.synthCounts).length > 0) {
    const prog = ch.goals.map(function(g) {
      return (TILE_LABELS[g.value] || g.value) + ((daily.synthCounts[g.value] || 0) + '/' + g.target)
    }).join(' ')
    ctx.fillText(ch.desc + ' | ' + gridLabel + ' | ' + prog, W / 2, btnY2 + 37)
  } else {
    ctx.fillText(ch.desc + ' | ' + gridLabel, W / 2, btnY2 + 37)
  }

  // Theme button
  const btnY3 = 265
  drawBtn(btnX, btnY3, btnW, btnH, t.btnS, 12)
  const curTh = S.getTheme()
  const thObj = THEMES.find(function(x) { return x.id === curTh }) || THEMES[0]
  ctx.fillStyle = t.header; ctx.font = 'bold 16px Arial'
  ctx.fillText('🎨 主題: ' + thObj.icon + ' ' + thObj.name, W / 2, btnY3 + 20)
  ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText('已解鎖 ' + S.getUnlockedThemes().length + '/' + THEMES.length, W / 2, btnY3 + 37)

  // Test buttons (3 side by side)
  const testY = 340
  const tbW = Math.floor((btnW - 8) / 3)
  drawBtn(btnX, testY, tbW, 34, t.btnS, 8)
  ctx.fillStyle = t.textDim; ctx.font = '11px Arial'; ctx.textAlign = 'center'
  ctx.fillText('🔄刷新', btnX + tbW / 2, testY + 17)
  drawBtn(btnX + tbW + 4, testY, tbW, 34, t.btnS, 8)
  ctx.fillText('🤖無盡', btnX + tbW + 4 + tbW / 2, testY + 17)
  drawBtn(btnX + (tbW + 4) * 2, testY, tbW, 34, t.btnS, 8)
  ctx.fillText('🤖每日', btnX + (tbW + 4) * 2 + tbW / 2, testY + 17)

  // Stats
  const stats = S.getStats()
  ctx.font = '10px Arial'; ctx.fillStyle = t.textDim; ctx.textAlign = 'center'
  ctx.fillText('遊戲:' + stats.gamesPlayed + ' | 最大方塊:' + stats.maxTile + ' | 最高連擊:' + stats.maxCombo + ' | 彩虹:' + stats.totalRainbows, W / 2, H - 40)
  ctx.fillText('連續每日:' + S.getDailyStreak(), W / 2, H - 22)
}

function drawGameScreen(t) {
  drawBg(t)

  // Header
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillStyle = t.header; ctx.font = 'bold 16px Arial'
  var modeLabel = mode === 'daily' ? '📅 每日' : '🎮 無盡'
  ctx.fillText(modeLabel + '  ' + score, margin + 2, 4)

  ctx.textAlign = 'right'; ctx.font = '12px Arial'; ctx.fillStyle = t.textDim
  if (mode === 'endless') {
    ctx.fillText('最高:' + S.getBestEndless() + ' | 👑' + (S.getStats().totalRainbows || 0), W - margin, 6)
  }

  // Daily progress line
  if (mode === 'daily') {
    var daily = S.getDaily()
    var ch = daily.challenge
    ctx.textAlign = 'left'; ctx.font = '11px Arial'; ctx.fillStyle = t.textDim
    if (ch.type === 'tiles') {
      var prog = ch.goals.map(function(g) {
        var cur = synthCounts[g.value] || 0
        var ok = cur >= g.target
        return (TILE_LABELS[g.value] || g.value) + (ok ? '✓' : cur + '/' + g.target)
      }).join(' ')
      ctx.fillText((ch.cols || 5) + '×' + (ch.rows || 5) + ' | ' + prog, margin + 2, 24)
    } else {
      var pct = Math.min(100, Math.floor(score / ch.target * 100))
      ctx.fillText(ch.desc + ' | ' + score + '/' + ch.target + ' (' + pct + '%)', margin + 2, 24)
    }
  }

  // Board
  drawBoard(t)

  // Item bar
  drawItemBar(t)

  // Next piece preview
  var npLabelY = headerH + 2
  var npPieceY = npLabelY + 16
  var npPieceX = W / 2 - cellW * 0.7 / 2 - 2
  ctx.textAlign = 'center'; ctx.fillStyle = t.textDim; ctx.font = '11px Arial'
  ctx.fillText('下一個', W / 2, npLabelY + 4)
  drawTile(npPieceX, npPieceY, cellW * 0.7, cellH * 0.7, nextPiece, t)

  // Swap indicator
  if (itemSelectType === 'swap' && swapFirst) {
    var sx = boardX + cellGap + swapFirst.c * (cellW + cellGap)
    var sy = boardTop + cellGap + swapFirst.r * (cellH + cellGap)
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3
    rr(sx - 2, sy - 2, cellW + 4, cellH + 4, 8); ctx.stroke()
  }

  // Toasts
  drawToasts(t)
}

function drawBoard(t) {
  ctx.fillStyle = t.board
  rr(boardX, boardTop, boardW, boardH, 8); ctx.fill()

  for (var r = 0; r < grid.rows; r++) {
    for (var c = 0; c < grid.cols; c++) {
      var x = boardX + cellGap + c * (cellW + cellGap)
      var y = boardTop + cellGap + r * (cellH + cellGap)
      ctx.fillStyle = t.empty
      rr(x, y, cellW, cellH, 6); ctx.fill()
      var v = grid.cells[r][c]
      if (v > 0) drawTile(x, y, cellW, cellH, v, t, 6, r, c)
    }
  }
}

function drawItemBar(t) {
  var items = S.getItems()
  var itemTypes = [
    { key: 'hammer', icon: '🔨', count: items.hammer },
    { key: 'swap', icon: '🔄', count: items.swap },
    { key: 'lightning', icon: '⚡', count: items.lightning },
  ]
  var ibW = 50, ibH = 42
  var totalW = 3 * ibW + 2 * 4
  var startX = boardX + boardW / 2 - totalW / 2
  var ibY = boardTop + boardH + 6

  for (var i = 0; i < itemTypes.length; i++) {
    var ix = startX + i * (ibW + 4)
    var isActive = itemSelectType === itemTypes[i].key
    drawBtn(ix, ibY, ibW, ibH, isActive ? t.accent : t.btnS, 8)
    ctx.font = '16px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillStyle = t.header
    ctx.fillText(itemTypes[i].icon, ix + ibW / 2, ibY + ibH * 0.32)
    ctx.font = 'bold 10px Arial'
    if (itemTypes[i].count > 0) {
      ctx.fillStyle = t.text || '#fff'
      ctx.fillText('×' + itemTypes[i].count, ix + ibW / 2, ibY + ibH * 0.72)
    } else if (mode === 'daily') {
      ctx.fillStyle = '#ffd700'
      ctx.fillText('📹+1', ix + ibW / 2, ibY + ibH * 0.72)
    } else {
      ctx.fillStyle = t.textDim
      ctx.fillText('×0', ix + ibW / 2, ibY + ibH * 0.72)
    }
  }
}

function drawGameOver(t) {
  // Draw game underneath
  drawGameScreen(t)
  // Overlay
  ctx.fillStyle = t.overlay
  ctx.fillRect(0, 0, W, H)

  var daily = mode === 'daily' ? S.getDaily() : null
  var ch = daily ? daily.challenge : null
  var isComplete = daily ? daily.completed : false

  var cardW = Math.min(300, W - 40)
  var cardH = mode === 'daily' ? 320 : 260
  var cx = W / 2 - cardW / 2, cy = H / 2 - cardH / 2
  drawBtn(cx, cy, cardW, cardH, t.overlay, 16)

  // Card border
  ctx.strokeStyle = t.accent || 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 2
  rr(cx, cy, cardW, cardH, 16); ctx.stroke()

  // Title
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 22px Arial'
  ctx.fillText(isComplete ? '🎉 通關！' : '💥 遊戲結束', W / 2, cy + 30)

  // Score
  ctx.font = 'bold 28px Arial'; ctx.fillStyle = t.accent || '#ffd700'
  ctx.fillText('' + score, W / 2, cy + 65)

  // Stats
  ctx.font = '12px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText('最大: ' + levelName(grid.getMaxValue()) + ' | ' + moves + ' 步 | ' + maxCombo + 'x 連擊', W / 2, cy + 90)

  if (mode === 'daily') {
    // Progress
    if (ch.type === 'tiles') {
      ctx.font = '12px Arial'; ctx.fillStyle = t.text || '#fff'
      var prog = ch.goals.map(function(g) {
        var cur = synthCounts[g.value] || 0
        var ok = cur >= g.target
        return (TILE_LABELS[g.value] || g.value) + ':' + (ok ? '✓' : cur + '/' + g.target)
      }).join('  ')
      ctx.fillText('進度: ' + prog, W / 2, cy + 115)
    } else {
      ctx.font = '12px Arial'; ctx.fillStyle = t.text || '#fff'
      var pct = Math.min(100, Math.floor(score / ch.target * 100))
      ctx.fillText('目標: ' + ch.target + '分 | 達成: ' + pct + '%', W / 2, cy + 115)
    }

    if (!isComplete) {
      // Ad-for-items label
      ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
      ctx.fillText('看廣告拿道具', W / 2, cy + 142)

      // Ad buttons
      var adBtnW = 60, adBtnH = 32
      var adIcons = [{ key: 'hammer', icon: '🔨' }, { key: 'swap', icon: '🔄' }, { key: 'lightning', icon: '⚡' }]
      var adStartX = W / 2 - (3 * adBtnW + 2 * 6) / 2
      var adY = cy + 155
      for (var i = 0; i < 3; i++) {
        var ax = adStartX + i * (adBtnW + 6)
        drawBtn(ax, adY, adBtnW, adBtnH, t.btnS, 8)
        ctx.fillStyle = t.header; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
        ctx.fillText('📹' + adIcons[i].icon, ax + adBtnW / 2, adY + adBtnH / 2)
      }

      // Retry + Menu
      var btnW2 = 120, btnH2 = 40
      var by = cy + 200
      drawBtn(W / 2 - btnW2 - 8, by, btnW2, btnH2, t.btnP, 10)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
      ctx.fillText('再來一局', W / 2 - btnW2 / 2 - 8, by + btnH2 / 2)
      drawBtn(W / 2 + 8, by, btnW2, btnH2, t.btnS, 10)
      ctx.fillStyle = t.header
      ctx.fillText('回菜單', W / 2 + btnW2 / 2 + 8, by + btnH2 / 2)
    } else {
      // Completed
      var btnW3 = 160, btnH3 = 42
      var by3 = cy + 160
      drawBtn(W / 2 - btnW3 / 2, by3, btnW3, btnH3, t.btnP, 10)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center'
      ctx.fillText('回菜單', W / 2, by3 + btnH3 / 2)
    }
  } else {
    // Endless game over
    var btnW2 = 120, btnH2 = 40
    var by = cy + 140
    drawBtn(W / 2 - btnW2 - 8, by, btnW2, btnH2, t.btnP, 10)
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
    ctx.fillText('再來一局', W / 2 - btnW2 / 2 - 8, by + btnH2 / 2)
    drawBtn(W / 2 + 8, by, btnW2, btnH2, t.btnS, 10)
    ctx.fillStyle = t.header
    ctx.fillText('回菜單', W / 2 + btnW2 / 2 + 8, by + btnH2 / 2)
  }
}

function drawThemes(t) {
  drawBg(t)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 20px Arial'
  ctx.fillText('🎨 選擇主題', W / 2, 30)

  var unlocked = S.getUnlockedThemes()
  var cols = 3, thW = 90, thH = 80, gap = 10
  var totalW = cols * thW + (cols - 1) * gap
  var startX = W / 2 - totalW / 2, startY = 60

  for (var i = 0; i < THEMES.length; i++) {
    var th = THEMES[i]
    var col = i % cols, row = Math.floor(i / cols)
    var x = startX + col * (thW + gap), y = startY + row * (thH + gap)
    var isUnlocked = unlocked.includes(th.id)
    var isActive = S.getTheme() === th.id
    drawBtn(x, y, thW, thH, isActive ? t.accent : t.btnS, 10)
    ctx.font = '24px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = isUnlocked ? th.header : t.textDim
    ctx.fillText(th.icon, x + thW / 2, y + thH * 0.35)
    ctx.font = '10px Arial'; ctx.fillStyle = isUnlocked ? (t.text || '#fff') : t.textDim
    ctx.fillText(isUnlocked ? th.name : '🔒', x + thW / 2, y + thH * 0.7)
  }

  // Back button
  drawBtn(W / 2 - 80, H - 60, 160, 40, t.btnS, 10)
  ctx.fillStyle = t.header; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
  ctx.fillText('← 返回', W / 2, H - 40)
}

function drawLeaderboard(t) {
  drawBg(t)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 20px Arial'
  ctx.fillText('🏆 排行榜', W / 2, 40)

  var lb = S.getLB()
  if (lb.length === 0) {
    ctx.font = '14px Arial'; ctx.fillStyle = t.textDim
    ctx.fillText('暫無記錄', W / 2, H / 2)
  } else {
    ctx.font = '12px Arial'; ctx.fillStyle = t.text || '#fff'
    for (var i = 0; i < Math.min(10, lb.length); i++) {
      ctx.fillText((i + 1) + '. ' + lb[i].mode + ' ' + lb[i].score, W / 2, 80 + i * 24)
    }
  }

  drawBtn(W / 2 - 80, H - 60, 160, 40, t.btnS, 10)
  ctx.fillStyle = t.header; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
  ctx.fillText('← 返回', W / 2, H - 40)
}

function drawAutoSummary(t) {
  drawBg(t)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 20px Arial'
  ctx.fillText('🤖 自動遊玩結束', W / 2, H / 2 - 20)
  ctx.font = '14px Arial'; ctx.fillStyle = t.text || '#fff'
  ctx.fillText('分數: ' + score, W / 2, H / 2 + 20)

  drawBtn(W / 2 - 80, H - 60, 160, 40, t.btnS, 10)
  ctx.fillStyle = t.header; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
  ctx.fillText('回菜單', W / 2, H - 40)
}

function drawToasts(t) {
  var now = Date.now()
  toasts = toasts.filter(function(to) { return now - to.time < 2000 })
  for (var i = 0; i < toasts.length; i++) {
    var to = toasts[i]
    var age = now - to.time
    var alpha = age < 1500 ? 1 : 1 - (age - 1500) / 500
    ctx.save(); ctx.globalAlpha = alpha
    ctx.font = '12px Arial'; ctx.textAlign = 'center'
    ctx.fillStyle = t.overlay || 'rgba(30,20,60,0.88)'
    var text = to.icon + ' ' + to.text
    var tw = ctx.measureText(text).width + 16
    var tx = W / 2 - tw / 2, ty = 42 + i * 22
    rr(tx, ty, tw, 18, 6); ctx.fill()
    ctx.fillStyle = t.text || '#fff'
    ctx.fillText(text, W / 2, ty + 9)
    ctx.restore()
  }
}
