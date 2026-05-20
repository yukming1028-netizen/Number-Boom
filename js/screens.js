// ===== SCREENS / DRAWING =====

// ===== MENU SCREEN =====
function drawMenu(t) {
  drawBg(t)

  // Title
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 28px Arial'
  ctx.fillText('\uD83D\uDD25 \u6578\u5B57\u5927\u7206\u70B8', W / 2 - 15, 50)
  ctx.font = '12px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText('Number Boom', W / 2 - 15, 75)

  // Right icons: settings, theme, achievement
  var iconX = W - 44, iconS = 36
  // ⚙️ Settings
  drawBtn(iconX, 15, iconS, iconS, t.btnS, 8)
  ctx.font = '18px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header
  ctx.fillText('\u2699\uFE0F', iconX + iconS / 2, 15 + iconS / 2)
  // 🎨 Theme
  drawBtn(iconX, 58, iconS, iconS, t.btnS, 8)
  ctx.fillText('\uD83C\uDFA8', iconX + iconS / 2, 58 + iconS / 2)
  // 🏆 Achievement
  drawBtn(iconX, 101, iconS, iconS, t.btnS, 8)
  ctx.fillText('\uD83C\uDFC6', iconX + iconS / 2, 101 + iconS / 2)

  // Daily challenge info
  var daily = S.getDaily()
  var ch = daily.challenge
  var done = daily.completed
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.textDim; ctx.font = '11px Arial'
  var gridLabel = (ch.cols || 5) + '\u00D7' + (ch.rows || 5)
  if (done) {
    ctx.fillText('\u2705 \u4ECA\u65E5\u5DF2\u5B8C\u6210 | ' + ch.desc + ' | ' + gridLabel, W / 2, H - 270)
  } else {
    ctx.fillText(ch.desc + ' | ' + gridLabel, W / 2, H - 270)
  }

  // Bottom buttons
  var btnW = 220, btnH = 50, btnX = W / 2 - btnW / 2

  // 📅 每日挑戰
  var dy = H - 240
  drawBtn(btnX, dy, btnW, btnH, done ? t.btnS : t.btnP, 12)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 17px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\uD83D\uDCC5 \u6BCF\u65E5\u6311\u6230', W / 2, dy + 21)
  ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText(gridLabel, W / 2, dy + 39)

  // 🎮 無盡模式
  var ey = H - 175
  drawBtn(btnX, ey, btnW, btnH, t.btnP, 12)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 17px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\uD83C\uDFAE \u7121\u76E1\u6A21\u5F0F', W / 2, ey + 21)
  ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText('\u6700\u9AD8: ' + S.getBestEndless(), W / 2, ey + 39)

  // Test buttons (3 side by side)
  var testY = H - 110
  var tbW = Math.floor((btnW - 8) / 3)
  drawBtn(btnX, testY, tbW, 34, t.btnS, 8)
  ctx.fillStyle = t.textDim; ctx.font = '11px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\uD83D\uDD04\u5237\u65B0', btnX + tbW / 2, testY + 17)
  drawBtn(btnX + tbW + 4, testY, tbW, 34, t.btnS, 8)
  ctx.fillText('\uD83E\uDD16\u7121\u76E1', btnX + tbW + 4 + tbW / 2, testY + 17)
  drawBtn(btnX + (tbW + 4) * 2, testY, tbW, 34, t.btnS, 8)
  ctx.fillText('\uD83E\uDD16\u6BCF\u65E5', btnX + (tbW + 4) * 2 + tbW / 2, testY + 17)

  // Stats
  var stats = S.getStats()
  ctx.font = '10px Arial'; ctx.fillStyle = t.textDim; ctx.textAlign = 'center'
  ctx.fillText('\u904A\u6232:' + stats.gamesPlayed + ' | \u6700\u5927:' + stats.maxTile + ' | \u9023\u64CA:' + stats.maxCombo + ' | \u5F69\u8679:' + stats.totalRainbows, W / 2, H - 50)
  ctx.fillText('\u9023\u7E8C\u6BCF\u65E5:' + S.getDailyStreak(), W / 2, H - 32)
}

// ===== GAME SCREEN =====
function drawGameScreen(t) {
  drawBg(t)

  // Header bar
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillStyle = t.header; ctx.font = 'bold 15px Arial'
  var modeLabel = mode === 'daily' ? '\uD83D\uDCC5\u6BCF\u65E5' : '\uD83C\uDFAE\u7121\u76E1'
  ctx.fillText(modeLabel + '  ' + score, margin + 2, 4)

  // Next piece (small, top right)
  var npSize = 26, npX = W - margin - npSize, npY = 5
  ctx.textAlign = 'center'; ctx.fillStyle = t.textDim; ctx.font = '9px Arial'
  ctx.fillText('\u4E0B\u4E00\u500B', npX + npSize / 2, npY - 1)
  drawTile(npX, npY + 10, npSize, npSize, nextPiece, t)

  // Current piece (big, top left beside score)
  var cpSize = 36, cpX = margin + 2, cpY = 24
  ctx.textAlign = 'left'; ctx.fillStyle = t.textDim; ctx.font = '9px Arial'
  ctx.fillText('\u7576\u524D', cpX, cpY - 1)
  drawTile(cpX + 24, cpY - 2, cpSize, cpSize, currentPiece, t)

  // Daily progress line
  if (mode === 'daily') {
    var daily = S.getDaily()
    var ch = daily.challenge
    ctx.textAlign = 'left'; ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
    if (ch.type === 'tiles') {
      var prog = ch.goals.map(function(g) {
        var cur = synthCounts[g.value] || 0
        var ok = cur >= g.target
        return (TILE_LABELS[g.value] || g.value) + (ok ? '\u2713' : cur + '/' + g.target)
      }).join(' ')
      ctx.fillText((ch.cols || 5) + '\u00D7' + (ch.rows || 5) + ' | ' + prog, margin + 2, 62)
    } else {
      var pct = Math.min(100, Math.floor(score / ch.target * 100))
      ctx.fillText(ch.desc + ' | ' + score + '/' + ch.target + ' (' + pct + '%)', margin + 2, 62)
    }
  }

  // Current piece floating above hover column
  if (hoverCol >= 0 && hoverCol < grid.cols) {
    var hx = boardX + cellGap + hoverCol * (cellW + cellGap)
    var hy = boardTop - cellH * 0.75 - 6
    ctx.globalAlpha = 0.75
    drawTile(hx + cellW * 0.125, hy, cellW * 0.75, cellH * 0.75, currentPiece, t)
    ctx.globalAlpha = 1
    // Arrow indicator
    ctx.fillStyle = t.accent || '#ffd700'
    ctx.beginPath()
    ctx.moveTo(hx + cellW / 2 - 5, boardTop - 3)
    ctx.lineTo(hx + cellW / 2 + 5, boardTop - 3)
    ctx.lineTo(hx + cellW / 2, boardTop + 2)
    ctx.closePath(); ctx.fill()
  }

  // Board
  drawBoard(t)

  // Item bar
  drawItemBar(t)

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
    { key: 'hammer', icon: '\uD83D\uDD28', count: items.hammer },
    { key: 'swap', icon: '\uD83D\uDD04', count: items.swap },
    { key: 'lightning', icon: '\u26A1', count: items.lightning },
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
      ctx.fillText('\u00D7' + itemTypes[i].count, ix + ibW / 2, ibY + ibH * 0.72)
    } else if (mode === 'daily') {
      ctx.fillStyle = '#ffd700'
      ctx.fillText('\uD83D\uDCFA+1', ix + ibW / 2, ibY + ibH * 0.72)
    } else {
      ctx.fillStyle = t.textDim
      ctx.fillText('\u00D70', ix + ibW / 2, ibY + ibH * 0.72)
    }
  }
}

// ===== GAME OVER SCREEN =====
function drawGameOver(t) {
  drawGameScreen(t)
  ctx.fillStyle = t.overlay
  ctx.fillRect(0, 0, W, H)

  var daily = mode === 'daily' ? S.getDaily() : null
  var ch = daily ? daily.challenge : null
  var isComplete = daily ? daily.completed : false

  var cardW = Math.min(300, W - 40), cardH
  if (mode === 'daily' && !isComplete) cardH = 340
  else if (mode === 'daily') cardH = 240
  else cardH = 260

  var cx = W / 2 - cardW / 2, cy = H / 2 - cardH / 2
  drawBtn(cx, cy, cardW, cardH, t.overlay, 16)
  ctx.strokeStyle = t.accent || 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2
  rr(cx, cy, cardW, cardH, 16); ctx.stroke()

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 22px Arial'
  ctx.fillText(isComplete ? '\uD83C\uDF89 \u901A\u95DC\uFF01' : '\uD83D\uDCA5 \u904A\u6232\u7D50\u675F', W / 2, cy + 30)

  ctx.font = 'bold 28px Arial'; ctx.fillStyle = t.accent || '#ffd700'
  ctx.fillText('' + score, W / 2, cy + 65)

  ctx.font = '12px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText('\u6700\u5927: ' + levelName(grid.getMaxValue()) + ' | ' + moves + ' \u6B65 | ' + maxCombo + 'x \u9023\u64CA | ' + formatTime(Date.now() - gameStartTime), W / 2, cy + 92)

  if (mode === 'daily') {
    if (ch.type === 'tiles') {
      ctx.font = '12px Arial'; ctx.fillStyle = t.text || '#fff'
      var prog = ch.goals.map(function(g) {
        var cur = synthCounts[g.value] || 0
        var ok = cur >= g.target
        return (TILE_LABELS[g.value] || g.value) + ':' + (ok ? '\u2713' : cur + '/' + g.target)
      }).join('  ')
      ctx.fillText('\u9032\u5EA6: ' + prog, W / 2, cy + 115)
    } else {
      ctx.font = '12px Arial'; ctx.fillStyle = t.text || '#fff'
      var pct = Math.min(100, Math.floor(score / ch.target * 100))
      ctx.fillText('\u76EE\u6A19: ' + ch.target + '\u5206 | \u9054\u6210: ' + pct + '%', W / 2, cy + 115)
    }

    if (!isComplete) {
      ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
      ctx.fillText('\u770B\u5EE3\u544A\u62FF\u9053\u5177', W / 2, cy + 142)
      var adBtnW = 60, adBtnH = 32
      var adIcons = [{ key: 'hammer', icon: '\uD83D\uDD28' }, { key: 'swap', icon: '\uD83D\uDD04' }, { key: 'lightning', icon: '\u26A1' }]
      var adStartX = W / 2 - (3 * adBtnW + 2 * 6) / 2
      var adY = cy + 155
      for (var i = 0; i < 3; i++) {
        var ax = adStartX + i * (adBtnW + 6)
        drawBtn(ax, adY, adBtnW, adBtnH, t.btnS, 8)
        ctx.fillStyle = t.header; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
        ctx.fillText('\uD83D\uDCFA' + adIcons[i].icon, ax + adBtnW / 2, adY + adBtnH / 2)
      }
      var by = cy + 200
      var btnW2 = 120, btnH2 = 40
      drawBtn(W / 2 - btnW2 - 8, by, btnW2, btnH2, t.btnP, 10)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
      ctx.fillText('\u518D\u4F86\u4E00\u5C40', W / 2 - btnW2 / 2 - 8, by + btnH2 / 2)
      drawBtn(W / 2 + 8, by, btnW2, btnH2, t.btnS, 10)
      ctx.fillStyle = t.header
      ctx.fillText('\u56DE\u83DC\u55AE', W / 2 + btnW2 / 2 + 8, by + btnH2 / 2)
    } else {
      var by = cy + 150
      var btnW3 = 160, btnH3 = 42
      drawBtn(W / 2 - btnW3 / 2, by, btnW3, btnH3, t.btnP, 10)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center'
      ctx.fillText('\u56DE\u83DC\u55AE', W / 2, by + btnH3 / 2)
    }
  } else {
    var by = cy + 130
    var btnW2 = 120, btnH2 = 40
    drawBtn(W / 2 - btnW2 - 8, by, btnW2, btnH2, t.btnP, 10)
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
    ctx.fillText('\u518D\u4F86\u4E00\u5C40', W / 2 - btnW2 / 2 - 8, by + btnH2 / 2)
    drawBtn(W / 2 + 8, by, btnW2, btnH2, t.btnS, 10)
    ctx.fillStyle = t.header
    ctx.fillText('\u56DE\u83DC\u55AE', W / 2 + btnW2 / 2 + 8, by + btnH2 / 2)
  }
}

// ===== AUTO SUMMARY SCREEN =====
function drawAutoSummary(t) {
  drawBg(t)
  ctx.fillStyle = t.overlay
  ctx.fillRect(0, 0, W, H)

  var cardW = Math.min(300, W - 40), cardH = 380
  var cx = W / 2 - cardW / 2, cy = H / 2 - cardH / 2
  drawBtn(cx, cy, cardW, cardH, t.overlay, 16)
  ctx.strokeStyle = t.accent || 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2
  rr(cx, cy, cardW, cardH, 16); ctx.stroke()

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 22px Arial'
  ctx.fillText('\uD83E\uDD16 \u81EA\u52D5\u904A\u73A9\u7D50\u675F', W / 2, cy + 30)

  ctx.font = 'bold 28px Arial'; ctx.fillStyle = t.accent || '#ffd700'
  ctx.fillText('' + score, W / 2, cy + 68)

  // Stats
  ctx.font = '13px Arial'; ctx.fillStyle = t.text || '#fff'
  var elapsed = Date.now() - gameStartTime
  var lines = [
    '\u6B65\u6578: ' + moves,
    '\u6642\u9593: ' + formatTime(elapsed),
    '\u6700\u5927\u9023\u64CA: ' + maxCombo + 'x',
    '\u6700\u5927\u65B9\u584A: ' + levelName(grid.getMaxValue()),
  ]
  for (var i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], W / 2, cy + 105 + i * 24)
  }

  // Items used
  ctx.fillStyle = t.textDim; ctx.font = '11px Arial'
  ctx.fillText('\u9053\u5177\u4F7F\u7528', W / 2, cy + 210)
  ctx.font = '13px Arial'; ctx.fillStyle = t.text || '#fff'
  ctx.fillText('\uD83D\uDD28 ' + autoItemsUsed.hammer + '   \uD83D\uDD04 ' + autoItemsUsed.swap + '   \u26A1 ' + autoItemsUsed.lightning, W / 2, cy + 232)

  // Menu button
  var by = cy + 280
  var btnW3 = 160, btnH3 = 42
  drawBtn(W / 2 - btnW3 / 2, by, btnW3, btnH3, t.btnP, 10)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u56DE\u83DC\u55AE', W / 2, by + btnH3 / 2)
}

// ===== THEME SCREEN =====
function drawThemes(t) {
  drawBg(t)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 20px Arial'
  ctx.fillText('\uD83C\uDFA8 \u9078\u64C7\u4E3B\u984C', W / 2, 30)

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
    ctx.fillText(isUnlocked ? th.name : '\uD83D\uDD12', x + thW / 2, y + thH * 0.7)
  }

  drawBtn(W / 2 - 80, H - 60, 160, 40, t.btnS, 10)
  ctx.fillStyle = t.header; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u2190 \u8FD4\u56DE', W / 2, H - 40)
}

// ===== LEADERBOARD SCREEN =====
function drawLeaderboard(t) {
  drawBg(t)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 20px Arial'
  ctx.fillText('\uD83C\uDFC6 \u6392\u884C\u699C', W / 2, 40)

  var lb = S.getLB()
  if (lb.length === 0) {
    ctx.font = '14px Arial'; ctx.fillStyle = t.textDim
    ctx.fillText('\u66AB\u7121\u8A18\u9304', W / 2, H / 2)
  } else {
    ctx.font = '12px Arial'; ctx.fillStyle = t.text || '#fff'
    for (var i = 0; i < Math.min(10, lb.length); i++) {
      ctx.fillText((i + 1) + '. ' + lb[i].mode + ' ' + lb[i].score, W / 2, 80 + i * 24)
    }
  }

  drawBtn(W / 2 - 80, H - 60, 160, 40, t.btnS, 10)
  ctx.fillStyle = t.header; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u2190 \u8FD4\u56DE', W / 2, H - 40)
}

// ===== TOASTS =====
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
    var tx = W / 2 - tw / 2, ty = 80 + i * 22
    rr(tx, ty, tw, 18, 6); ctx.fill()
    ctx.fillStyle = t.text || '#fff'
    ctx.fillText(text, W / 2, ty + 9)
    ctx.restore()
  }
}
