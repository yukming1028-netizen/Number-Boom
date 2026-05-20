// ===== SCREENS / DRAWING =====

// ===== MENU CONSTANTS =====
var MI_W = 44, MI_H = 50, MI_GAP = 54

// ===== MENU SCREEN =====
function drawMenu(t) {
  drawBg(t)

  // Title
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 28px Arial'
  ctx.fillText('\u6578\u5B57\u5927\u7206\u70B8', W / 2, 45)
  ctx.font = '12px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText('Number Boom', W / 2, 70)

  // Right icons: settings, theme, achievement, leaderboard
  var iconX = W - MI_W - 4
  var iconTypes = ['gear', 'palette', 'trophy', 'chart']
  var iconLabels = ['\u8A2D\u5B9A', '\u4E3B\u984C', '\u6210\u5C31', '\u6392\u884C']
  var iconY0 = 10
  for (var i = 0; i < 4; i++) {
    var iy = iconY0 + i * MI_GAP
    drawBtn(iconX, iy, MI_W, MI_H, t.btnS, 10)
    drawSvgIcon(iconX + MI_W / 2, iy + 17, 26, iconTypes[i], t.header)
    ctx.font = '9px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = t.textDim
    ctx.fillText(iconLabels[i], iconX + MI_W / 2, iy + 42)
  }

  // Daily challenge info
  var daily = S.getDaily()
  var ch = daily.challenge
  var done = daily.completed
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.textDim; ctx.font = '11px Arial'
  var gridLabel = (ch.cols || 5) + '\u00D7' + (ch.rows || 5)
  if (done) {
    ctx.fillText('\u2705 \u4ECA\u65E5\u5DF2\u5B8C\u6210', W / 2, H - 278)
  }

  // Bottom buttons
  var btnW = 230, btnX = W / 2 - btnW / 2

  // 每日挑戰 — shows condition on button
  var dy = H - 252
  drawBtn(btnX, dy, btnW, 58, done ? t.btnS : t.btnP, 12)
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 3; ctx.shadowOffsetY = 1
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u6BCF \u65E5 \u6311 \u6230', W / 2, dy + 22)
  ctx.restore()
  ctx.font = '10px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.textAlign = 'center'
  ctx.fillText(ch.desc + ' | ' + gridLabel, W / 2, dy + 44)

  // 無盡模式 — beautified text
  var ey = H - 182
  drawBtn(btnX, ey, btnW, 50, t.btnP, 12)
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 3; ctx.shadowOffsetY = 1
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u7121 \u76E1 \u6A21 \u5F0F', W / 2, ey + 20)
  ctx.restore()
  ctx.font = '10px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.textAlign = 'center'
  ctx.fillText('\u6700\u9AD8: ' + S.getBestEndless(), W / 2, ey + 38)

  // Test buttons (3 side by side)
  var testY = H - 120
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
  ctx.fillText('\u904A\u6232:' + stats.gamesPlayed + ' | \u6700\u5927:' + stats.maxTile + ' | \u9023\u64CA:' + stats.maxCombo + ' | \u5F69\u8679:' + stats.totalRainbows, W / 2, H - 65)
  ctx.fillText('\u9023\u7E8C\u6BCF\u65E5:' + S.getDailyStreak(), W / 2, H - 47)
}

// ===== GAME SCREEN =====
function drawGameScreen(t) {
  drawBg(t)

  // Header bar — mode + score (left)
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillStyle = t.header; ctx.font = 'bold 15px Arial'
  var modeLabel = mode === 'daily' ? '\uD83D\uDCC5\u6BCF\u65E5' : '\uD83C\uDFAE\u7121\u76E1'
  ctx.fillText(modeLabel + '  ' + score, margin + 2, 4)

  // Current piece (big) + Next piece (small) — top right, current LEFT of next
  var npSize = 24, npGap = 10
  var npX = W - margin - npSize       // next piece (rightmost)
  var cpSize = 34
  var cpX = npX - npGap - cpSize       // current piece (left of next)
  var pieceY = 8

  // Labels
  ctx.textAlign = 'center'; ctx.fillStyle = t.textDim; ctx.font = '9px Arial'
  ctx.fillText('\u7576\u524D', cpX + cpSize / 2, pieceY - 1)
  ctx.fillText('\u4E0B\u4E00\u500B', npX + npSize / 2, pieceY - 1)

  drawTile(cpX, pieceY + 10, cpSize, cpSize, currentPiece, t)
  drawTile(npX, pieceY + 13, npSize, npSize, nextPiece, t)

  // Daily progress — top left, prominent
  if (mode === 'daily') {
    var daily = S.getDaily()
    var ch = daily.challenge
    ctx.textAlign = 'left'; ctx.textBaseline = 'top'
    ctx.font = 'bold 11px Arial'; ctx.fillStyle = t.text || '#fff'
    var py = 26
    if (ch.type === 'tiles') {
      var prog = ch.goals.map(function(g) {
        var cur = synthCounts[g.value] || 0
        var ok = cur >= g.target
        return (TILE_LABELS[g.value] || g.value) + (ok ? '\u2713' : cur + '/' + g.target)
      }).join(' ')
      ctx.fillText((ch.cols || 5) + '\u00D7' + (ch.rows || 5) + ' | ' + prog, margin + 2, py)
    } else {
      var pct = Math.min(100, Math.floor(score / ch.target * 100))
      ctx.fillText(ch.desc + ' ' + pct + '%', margin + 2, py)
      // Progress bar
      var barX = margin + 2, barY = py + 14, barW = 140, barH = 6
      ctx.fillStyle = t.btnS
      rr(barX, barY, barW, barH, 3); ctx.fill()
      ctx.fillStyle = t.accent || '#ffd700'
      rr(barX, barY, barW * pct / 100, barH, 3); ctx.fill()
    }
  }

  // Current piece floating above hover column (only when hovering board)
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
    { key: 'hammer', icon: 'hammer', count: items.hammer, desc: '\u6D88\u9664\u55AE\u683C' },
    { key: 'swap', icon: 'swapArrows', count: items.swap, desc: '\u4EA4\u63DB\u4F4D\u7F6E' },
    { key: 'lightning', icon: 'bolt', count: items.lightning, desc: '\u540C\u8272\u5168\u6D88' },
  ]
  var ibGap = 6
  var ibW = (boardW - ibGap * 2) / 3
  var ibH = 62
  var ibY = boardTop + boardH + 8

  for (var i = 0; i < 3; i++) {
    var ix = boardX + i * (ibW + ibGap)
    var isActive = itemSelectType === itemTypes[i].key
    drawBtn(ix, ibY, ibW, ibH, isActive ? (t.accent || '#ffd700') : t.btnS, 8)

    // SVG icon
    drawSvgIcon(ix + ibW / 2, ibY + 15, 20, itemTypes[i].icon, t.header)

    // Description
    ctx.font = '9px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = t.textDim
    ctx.fillText(itemTypes[i].desc, ix + ibW / 2, ibY + 32)

    // Count
    ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center'
    if (itemTypes[i].count > 0) {
      ctx.fillStyle = t.text || '#fff'
      ctx.fillText('\u00D7' + itemTypes[i].count, ix + ibW / 2, ibY + 50)
    } else if (mode === 'daily') {
      ctx.fillStyle = '#ffd700'
      ctx.fillText('\uD83D\uDCFA+1', ix + ibW / 2, ibY + 50)
    } else {
      ctx.fillStyle = t.textDim
      ctx.fillText('\u00D70', ix + ibW / 2, ibY + 50)
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
      var adKeys = ['hammer', 'swap', 'lightning']
      var adIcons = ['hammer', 'swapArrows', 'bolt']
      var adStartX = W / 2 - (3 * adBtnW + 2 * 6) / 2
      var adY = cy + 155
      for (var i = 0; i < 3; i++) {
        var ax = adStartX + i * (adBtnW + 6)
        drawBtn(ax, adY, adBtnW, adBtnH, t.btnS, 8)
        drawSvgIcon(ax + adBtnW / 2, adY + adBtnH / 2, 18, adIcons[i], t.header)
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

  // Items used — with SVG icons
  ctx.fillStyle = t.textDim; ctx.font = '11px Arial'
  ctx.fillText('\u9053\u5177\u4F7F\u7528', W / 2, cy + 210)
  var itemStats = [
    { icon: 'hammer', count: autoItemsUsed.hammer },
    { icon: 'swapArrows', count: autoItemsUsed.swap },
    { icon: 'bolt', count: autoItemsUsed.lightning },
  ]
  var isGap = 70, isW = 40
  var isX = W / 2 - (3 * isW + 2 * 8) / 2
  for (var i = 0; i < 3; i++) {
    var sx = isX + i * (isW + 8)
    drawSvgIcon(sx + isW / 2, cy + 234, 18, itemStats[i].icon, t.text || '#fff')
    ctx.font = '12px Arial'; ctx.fillStyle = t.text || '#fff'; ctx.textAlign = 'center'
    ctx.fillText('\u00D7' + itemStats[i].count, sx + isW / 2, cy + 256)
  }

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
