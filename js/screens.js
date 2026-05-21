// ===== SCREENS / DRAWING =====

// ===== MENU CONSTANTS =====
var MI_W = 44, MI_H = 50, MI_GAP = 54

// ===== MENU SCREEN =====
function drawMenu(t) {
  drawBg(t)

  // Title: 方塊爆爆 — 48px bold + rainbow gradient + accent glow
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  var titleY = 28
  ctx.save()
  ctx.font = 'bold 48px Arial'
  ctx.shadowColor = t.accent || '#ffd700'; ctx.shadowBlur = 14
  var titleGrad = ctx.createLinearGradient(W / 2 - 130, titleY, W / 2 + 130, titleY)
  titleGrad.addColorStop(0, '#FF6B6B')
  titleGrad.addColorStop(0.25, '#FFD32A')
  titleGrad.addColorStop(0.5, '#2ED573')
  titleGrad.addColorStop(0.75, '#18DCFF')
  titleGrad.addColorStop(1, '#C56CF0')
  ctx.fillStyle = titleGrad
  ctx.fillText('\u65B9\u584A\u7206\u7206', W / 2, titleY)
  ctx.restore()

  // Cover art (center area)
  drawCoverArt(t)

  // Right icons: vertically centered with cover board
  var iconX = W - MI_W - 4
  var iconTypes = ['gear', 'palette', 'trophy', 'chart']
  var iconLabels = ['\u8A2D\u5B9A', '\u4E3B\u984C', '\u6210\u5C31', '\u6392\u884C']
  // Center icons vertically within the cover board area
  var iconTotalH = 4 * MI_H + 3 * (MI_GAP - MI_H) // total span of 4 icons
  var iconSpan = 3 * MI_GAP + MI_H
  var iconY0 = (_coverBoardY != null) ? _coverBoardY + (_coverBoardH - iconSpan) / 2 - 25 : 65
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

  // Settings gear — top right
  if (!showSettings) {
    drawSvgIcon(W - 18, 18, 22, 'gear', t.textDim)
  }

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
    // Fever: show upgraded piece preview
    var previewPiece = feverActive && currentPiece < 9 ? currentPiece + 1 : currentPiece
    drawTile(hx + cellW * 0.125, hy, cellW * 0.75, cellH * 0.75, previewPiece, t)
    ctx.globalAlpha = 1
    // Arrow indicator
    ctx.fillStyle = t.accent || '#ffd700'
    ctx.beginPath()
    ctx.moveTo(hx + cellW / 2 - 5, boardTop - 3)
    ctx.lineTo(hx + cellW / 2 + 5, boardTop - 3)
    ctx.lineTo(hx + cellW / 2, boardTop + 2)
    ctx.closePath(); ctx.fill()
  }

  // Fever gauge bar — below header, above board
  drawFeverBar(t)

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

function drawFeverBar(t) {
  var barW = W - margin * 2, barH = 10
  var barX = margin, barY = boardTop - barH - 4

  // Background
  ctx.fillStyle = t.btnS || '#333'
  rr(barX, barY, barW, barH, 5); ctx.fill()

  if (feverActive) {
    // Fever active — pulsing rainbow bar + countdown
    var pct = Math.max(0, feverTimer / FEVER_DURATION)
    var grad = ctx.createLinearGradient(barX, barY, barX + barW * pct, barY)
    var hue = (frameCount * 8) % 360
    grad.addColorStop(0, 'hsl(' + hue + ',100%,60%)')
    grad.addColorStop(0.5, 'hsl(' + ((hue + 60) % 360) + ',100%,60%)')
    grad.addColorStop(1, 'hsl(' + ((hue + 120) % 360) + ',100%,60%)')
    ctx.fillStyle = grad
    rr(barX, barY, barW * pct, barH, 5); ctx.fill()

    // Glow effect
    ctx.save()
    ctx.shadowColor = 'hsl(' + hue + ',100%,50%)'; ctx.shadowBlur = 8
    rr(barX, barY, barW * pct, barH, 5); ctx.fill()
    ctx.restore()

    // Label
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.font = 'bold 8px Arial'; ctx.fillStyle = '#fff'
    var secs = Math.ceil(feverTimer / 1000)
    ctx.fillText('\uD83D\uDD25 FEVER ' + secs + 's | \u5206\u6578\u00D72 | \u65B9\u584A+1', W / 2, barY + barH / 2)
  } else {
    // Accumulating
    var pct = feverGauge / FEVER_MAX
    var fillGrad = ctx.createLinearGradient(barX, barY, barX + barW * pct, barY)
    fillGrad.addColorStop(0, '#FF6B35')
    fillGrad.addColorStop(1, '#FFD700')
    ctx.fillStyle = fillGrad
    rr(barX, barY, barW * pct, barH, 5); ctx.fill()

    // Label
    if (feverGauge > 0) {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.font = '8px Arial'; ctx.fillStyle = t.textDim
      ctx.fillText('FEVER ' + Math.floor(pct * 100) + '%', W / 2, barY + barH / 2)
    }
  }
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
    { key: 'hammer', icon: 'hammer', count: items.hammer, desc: '\u6D88\u9664\u55AE\u683C', emoji: '\uD83D\uDD28' },
    { key: 'swap', icon: 'swapArrows', count: items.swap, desc: '\u4EA4\u63DB\u4F4D\u7F6E', emoji: '\uD83D\uDD04' },
    { key: 'lightning', icon: 'bolt', count: items.lightning, desc: '\u540C\u8272\u5168\u6D88', emoji: '\u26A1' },
  ]
  var ibGap = 6
  var ibW = (boardW - ibGap * 2) / 3
  var ibH = 56
  var ibY = boardTop + boardH + 8

  for (var i = 0; i < 3; i++) {
    var ix = boardX + i * (ibW + ibGap)
    var isActive = itemSelectType === itemTypes[i].key
    drawBtn(ix, ibY, ibW, ibH, isActive ? (t.accent || '#ffd700') : t.btnS, 8)

    // Icon on left side
    drawSvgIcon(ix + 16, ibY + ibH / 2, 22, itemTypes[i].icon, t.header)

    // Text block on right side
    var textX = ix + 34
    ctx.save()
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 2

    // Description — bold 11px
    ctx.font = 'bold 11px Arial'
    ctx.fillStyle = t.text || '#fff'
    ctx.fillText(itemTypes[i].desc, textX, ibY + 18)

    // Count — prominent accent color
    ctx.font = 'bold 12px Arial'
    if (itemTypes[i].count > 0) {
      ctx.fillStyle = t.accent || '#ffd700'
      ctx.fillText('\u00D7' + itemTypes[i].count, textX, ibY + 38)
    } else if (mode === 'daily') {
      ctx.fillStyle = '#ffd700'
      ctx.fillText('\uD83D\uDCFA+1', textX, ibY + 38)
    } else {
      ctx.fillStyle = t.textDim
      ctx.fillText('\u00D70', textX, ibY + 38)
    }
    ctx.restore()
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

// ===== ACHIEVEMENT SCREEN =====
var achScrollY = 0
function drawAchievements(t) {
  drawBg(t)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 20px Arial'
  ctx.fillText('\uD83C\uDFC6 \u6210\u5C31', W / 2, 30)

  var ach = S.getAchievements()
  var cum = S.getCumStats()
  var cardW = W - margin * 2, cardH = 62
  var startY = 55 - achScrollY

  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var a = ACHIEVEMENTS[i]
    var cy = startY + i * (cardH + 6)
    if (cy + cardH < 50 || cy > H - 50) continue
    var cx = margin

    if (a.repeatable) {
      // Repeatable achievement — show tier level + progress
      var tierKey = a.id === 'cum_score' ? 'scoreTier' : (a.id === 'cum_merge' ? 'mergeTier' : 'comboTier')
      var curTier = cum[tierKey] || 0
      drawBtn(cx, cy, cardW, cardH, curTier > 0 ? 'rgba(255,215,0,0.1)' : t.btnS, 10)

      // Icon
      drawAchievementIcon(cx + 24, cy + cardH / 2, 28, a.icon, t.accent || '#ffd700')

      // Name + level
      var nameX = cx + 48
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      ctx.font = 'bold 13px Arial'; ctx.fillStyle = t.text || '#fff'
      ctx.fillText(a.name + '  Lv.' + curTier, nameX, cy + 16)

      // Desc
      ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
      ctx.fillText(a.desc, nameX, cy + 34)

      // Progress to next tier
      var progress = getCumProgress(a, cum)
      ctx.textAlign = 'right'
      ctx.font = '9px Arial'; ctx.fillStyle = t.textDim
      ctx.fillText(progress.text, cx + cardW - 10, cy + 16)
      // Progress bar
      var barW = 60, barH = 5
      var barX = cx + cardW - 10 - barW, barY = cy + 32
      ctx.fillStyle = t.btnS || '#333'
      rr(barX, barY, barW, barH, 2.5); ctx.fill()
      ctx.fillStyle = t.accent || '#ffd700'
      rr(barX, barY, barW * Math.min(1, progress.pct), barH, 2.5); ctx.fill()

      // Reward preview
      var rw = a.reward
      var parts = []
      if (rw.hammer) parts.push('\uD83D\uDD28' + rw.hammer)
      if (rw.swap) parts.push('\uD83D\uDD04' + rw.swap)
      if (rw.lightning) parts.push('\u26A1' + rw.lightning)
      ctx.textAlign = 'left'; ctx.font = '9px Arial'; ctx.fillStyle = t.textDim
      ctx.fillText('\uD83C\uDF81 ' + parts.join(' '), nameX, cy + 50)

    } else {
      // One-time achievement
      var done = !!ach[a.id]
      drawBtn(cx, cy, cardW, cardH, done ? 'rgba(255,215,0,0.15)' : t.btnS, 10)

      var iconColor = done ? (t.accent || '#ffd700') : t.textDim
      drawAchievementIcon(cx + 24, cy + cardH / 2, 28, a.icon, iconColor)

      var nameX = cx + 48
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'

      if (a.hidden && !done) {
        ctx.font = 'bold 13px Arial'; ctx.fillStyle = t.textDim
        ctx.fillText('???', nameX, cy + 18)
        ctx.font = '10px Arial'
        ctx.fillText('\u96B1\u85CF\u6210\u5C31', nameX, cy + 36)
      } else {
        var dispName = a.hidden ? a.revealName : a.name
        var dispDesc = a.hidden ? a.revealDesc : a.desc
        ctx.font = 'bold 13px Arial'; ctx.fillStyle = done ? (t.accent || '#ffd700') : (t.text || '#fff')
        ctx.fillText(dispName, nameX, cy + 18)
        ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
        ctx.fillText(dispDesc, nameX, cy + 36)
      }

      // Status
      ctx.textAlign = 'right'
      if (done) {
        ctx.font = 'bold 11px Arial'; ctx.fillStyle = t.accent || '#ffd700'
        ctx.fillText('\u2713 \u5DF2\u9054\u6210', cx + cardW - 10, cy + cardH / 2)
      } else if (a.reward && a.reward.type === 'theme') {
        var thDef = THEMES.find(function(th) { return th.id === a.reward.id })
        if (thDef) {
          ctx.font = '10px Arial'; ctx.fillStyle = t.textDim
          ctx.fillText('\uD83C\uDFA8 ' + thDef.name, cx + cardW - 10, cy + cardH / 2)
        }
      }
    }
  }

  // Back button
  drawBtn(W / 2 - 80, H - 50, 160, 40, t.btnS, 10)
  ctx.fillStyle = t.header; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u2190 \u8FD4\u56DE', W / 2, H - 30)
}

function getCumProgress(a, cum) {
  cum = cum || S.getCumStats()
  if (a.id === 'cum_score') {
    var total = cum.totalScore || 0
    var tier = cum.scoreTier || 0
    var nextAt = (tier + 1) * a.step
    var cur = total - tier * a.step
    return { pct: Math.min(1, cur / a.step), text: fmtNum(cur) + '/' + fmtNum(a.step) }
  }
  if (a.id === 'cum_merge') {
    var total = cum.totalMerges || 0
    var tier = cum.mergeTier || 0
    var cur = total - tier * a.step
    return { pct: Math.min(1, cur / a.step), text: cur + '/' + a.step }
  }
  if (a.id === 'cum_combo') {
    var total = cum.totalCombos || 0
    var tier = cum.comboTier || 0
    var cur = total - tier * a.step
    return { pct: Math.min(1, cur / a.step), text: cur + '/' + a.step }
  }
  return { pct: 0, text: '' }
}

function fmtNum(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n/1000).toFixed(1) + 'K'
  return '' + n
}

// ===== THEME SCREEN =====
function drawThemes(t) {
  drawBg(t)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 20px Arial'
  ctx.fillText('\uD83C\uDFA8 \u9078\u64C7\u4E3B\u984C', W / 2, 30)

  var unlocked = S.getUnlockedThemes()
  var streak = S.getDailyStreak()
  var cols = 3, thW = 90, thH = 85, gap = 10
  var totalW = cols * thW + (cols - 1) * gap
  var startX = W / 2 - totalW / 2, startY = 58

  // Theme unlock conditions
  var themeConditions = {
    'ocean': { type: 'streak', target: 5 },
    'cyber': { type: 'streak', target: 10 },
    'sunset': { type: 'streak', target: 15 },
    'forest': { type: 'streak', target: 20 },
    'kawaii': { type: 'streak', target: 25 },
    'ink': { type: 'streak', target: 30 },
    'rainbow': { type: 'ach', name: '\u4EBA\u751F\u662F\u5F69\u8272\u7684' },
    'white': { type: 'hidden' },
    'obsidian': { type: 'hidden' },
    'infinity': { type: 'hidden' },
  }

  for (var i = 0; i < THEMES.length; i++) {
    var th = THEMES[i]
    var col = i % cols, row = Math.floor(i / cols)
    var x = startX + col * (thW + gap), y = startY + row * (thH + gap)
    var isUnlocked = unlocked.includes(th.id)
    var isActive = S.getTheme() === th.id
    var cond = themeConditions[th.id]

    drawBtn(x, y, thW, thH, isActive ? t.accent : t.btnS, 10)

    if (isUnlocked) {
      ctx.font = '24px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = th.header
      ctx.fillText(th.icon, x + thW / 2, y + thH * 0.3)
      ctx.font = '10px Arial'; ctx.fillStyle = t.text || '#fff'
      ctx.fillText(th.name, x + thW / 2, y + thH * 0.6)
    } else if (cond && cond.type === 'hidden') {
      // Hidden theme — show ???
      ctx.font = 'bold 22px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = t.textDim
      ctx.fillText('?', x + thW / 2, y + thH * 0.3)
      ctx.font = '10px Arial'
      ctx.fillText('???', x + thW / 2, y + thH * 0.6)
      ctx.font = '8px Arial'
      ctx.fillText('\u96B1\u85CF', x + thW / 2, y + thH * 0.8)
    } else if (cond && cond.type === 'streak') {
      // Streak unlock
      ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = t.textDim
      ctx.fillText('\uD83D\uDCC5', x + thW / 2, y + thH * 0.25)
      ctx.font = 'bold 10px Arial'; ctx.fillStyle = t.textDim
      ctx.fillText(cond.target + '\u5929', x + thW / 2, y + thH * 0.5)
      // Mini progress
      var prog2 = Math.min(1, streak / cond.target)
      var pbarW = thW - 16, pbarH = 4
      var pbarX = x + 8, pbarY = y + thH * 0.68
      ctx.fillStyle = t.btnS || '#333'
      rr(pbarX, pbarY, pbarW, pbarH, 2); ctx.fill()
      ctx.fillStyle = t.accent || '#ffd700'
      rr(pbarX, pbarY, pbarW * prog2, pbarH, 2); ctx.fill()
      ctx.font = '8px Arial'; ctx.fillStyle = t.textDim
      ctx.fillText(streak + '/' + cond.target, x + thW / 2, y + thH * 0.88)
    } else if (cond && cond.type === 'ach') {
      // Achievement unlock
      ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = t.textDim
      ctx.fillText('\uD83C\uDFC6', x + thW / 2, y + thH * 0.3)
      ctx.font = '8px Arial'; ctx.fillStyle = t.textDim
      ctx.fillText(cond.name, x + thW / 2, y + thH * 0.65)
    } else {
      ctx.font = '24px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = t.textDim
      ctx.fillText('\uD83D\uDD12', x + thW / 2, y + thH * 0.4)
    }
  }

  drawBtn(W / 2 - 80, H - 50, 160, 40, t.btnS, 10)
  ctx.fillStyle = t.header; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u2190 \u8FD4\u56DE', W / 2, H - 30)
}

// ===== LEADERBOARD SCREEN =====
function drawLeaderboard(t) {
  drawBg(t)

  // Title — tap to go back
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = t.header; ctx.font = 'bold 22px Arial'
  ctx.fillText('\u6392 \u884C \u699C', W / 2, 30)

  // Player name — tap to edit
  var pName = S.getName()
  ctx.font = '12px Arial'; ctx.fillStyle = t.textDim
  ctx.fillText(pName + ' \u25B8', W / 2, 52)

  // Content area with border
  var contentX = margin
  var contentY = 68
  var contentW = W - margin * 2
  var contentH = H - 68 - 108 // leave space for tabs + back button
  // Border
  ctx.save()
  ctx.strokeStyle = t.accent || '#ffd700'; ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.3
  rr(contentX, contentY, contentW, contentH, 12); ctx.stroke()
  ctx.restore()
  // Subtle fill
  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.fillStyle = t.board || 'rgba(20,15,40,0.8)'
  rr(contentX, contentY, contentW, contentH, 12); ctx.fill()
  ctx.restore()

  // Filter by current tab
  var lb = S.getLB().filter(function(e) { return e.mode === lbTab })
  var maxEntries = 10

  if (lb.length === 0) {
    ctx.font = '14px Arial'; ctx.fillStyle = t.textDim; ctx.textAlign = 'center'
    ctx.fillText('\u66AB\u7121\u8A18\u9304', W / 2, contentY + contentH / 2)
  } else {
    var listY0 = contentY + 8
    var rowH = 42
    for (var i = 0; i < Math.min(maxEntries, lb.length); i++) {
      var entry = lb[i]
      var ry = listY0 + i * rowH
      if (ry + rowH > contentY + contentH - 4) break // clip to content area

      // Row background
      if (i === 0) {
        ctx.save(); ctx.globalAlpha = 0.15
        ctx.fillStyle = t.accent || '#ffd700'
        rr(contentX + 6, ry, contentW - 12, rowH - 4, 8); ctx.fill()
        ctx.restore()
      } else if (i % 2 === 0) {
        ctx.save(); ctx.globalAlpha = 0.08
        ctx.fillStyle = t.header
        rr(contentX + 6, ry, contentW - 12, rowH - 4, 8); ctx.fill()
        ctx.restore()
      }

      // Rank medal for top 3
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      if (i < 3) {
        var medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49']
        ctx.font = '18px Arial'
        ctx.fillText(medals[i], contentX + 16, ry + rowH / 2 - 2)
      } else {
        ctx.font = 'bold 14px Arial'; ctx.fillStyle = t.textDim
        ctx.fillText('' + (i + 1), contentX + 20, ry + rowH / 2 - 2)
      }

      // Player name
      var entryName = entry.name || '\u73A9\u5BB6'
      ctx.font = '12px Arial'; ctx.fillStyle = t.text || '#fff'
      ctx.textAlign = 'left'
      ctx.fillText(entryName, contentX + 44, ry + rowH / 2 - 8)

      // Score (below name)
      ctx.font = 'bold 14px Arial'; ctx.fillStyle = i === 0 ? (t.accent || '#ffd700') : t.textDim
      ctx.fillText('' + entry.score, contentX + 44, ry + rowH / 2 + 8)

      // Extra info (right side)
      ctx.font = '9px Arial'; ctx.fillStyle = t.textDim
      ctx.textAlign = 'right'
      var extra = ''
      if (entry.maxTile) extra += '\u6700\u5927:' + levelName(entry.maxTile) + ' '
      if (entry.ts) {
        var d = new Date(entry.ts)
        extra += (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
      }
      ctx.fillText(extra, contentX + contentW - 14, ry + rowH / 2 - 2)
    }
  }

  // Bottom tabs: 無盡模式 | 每日挑戰
  var tabW = (W - margin * 2 - 6) / 2
  var tabH = 38
  var tabY = H - 98

  var endlessActive = lbTab === 'endless'
  drawBtn(margin, tabY, tabW, tabH, endlessActive ? t.btnP : t.btnS, 10)
  ctx.fillStyle = endlessActive ? '#fff' : t.textDim
  ctx.font = 'bold 13px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('\u7121 \u76E1 \u6A21 \u5F0F', margin + tabW / 2, tabY + tabH / 2)

  var dailyActive = lbTab === 'daily'
  drawBtn(margin + tabW + 6, tabY, tabW, tabH, dailyActive ? t.btnP : t.btnS, 10)
  ctx.fillStyle = dailyActive ? '#fff' : t.textDim
  ctx.font = 'bold 13px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u6BCF \u65E5 \u6311 \u6230', margin + tabW + 6 + tabW / 2, tabY + tabH / 2)

  // Back button below tabs
  var backY = H - 50
  var backW = W - margin * 2
  drawBtn(margin, backY, backW, 40, t.btnS, 10)
  ctx.fillStyle = t.text || '#fff'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u2190 \u8FD4\u56DE', W / 2, backY + 20)
}

// ===== SETTINGS PANEL =====
function drawSettingsPanel(t) {
  if (!showSettings) return
  // Overlay
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, W, H)

  var pw = Math.min(280, W - 40), ph = 300
  var px = W / 2 - pw / 2, py = H / 2 - ph / 2

  // Card
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 20
  ctx.fillStyle = t.board || '#1a1a2e'
  rr(px, py, pw, ph, 16); ctx.fill()
  ctx.shadowBlur = 0
  // Border
  ctx.strokeStyle = t.accent || '#ffd700'; ctx.lineWidth = 1.5
  rr(px, py, pw, ph, 16); ctx.stroke()
  ctx.restore()

  // Title
  ctx.fillStyle = t.text || '#fff'; ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'; ctx.textBaseline = 'top'
  ctx.fillText('\u2699\uFE0F \u8A2D\u5B9A', W / 2, py + 16)

  // Volume slider
  ctx.font = 'bold 13px Arial'; ctx.fillStyle = t.text || '#fff'
  ctx.textAlign = 'left'
  ctx.fillText('\uD83D\uDD0A \u97F3\u91CF', px + 20, py + 55)
  // Slider track
  var slX = px + 20, slY = py + 78, slW = pw - 40, slH = 8
  ctx.fillStyle = t.btnS || '#333'
  rr(slX, slY, slW, slH, 4); ctx.fill()
  // Slider fill
  var fillW = slW * volumeLevel
  ctx.fillStyle = t.accent || '#ffd700'
  rr(slX, slY, fillW, slH, 4); ctx.fill()
  // Slider knob
  var knobX = slX + fillW
  ctx.beginPath(); ctx.arc(knobX, slY + slH / 2, 10, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'; ctx.fill()
  ctx.strokeStyle = t.accent || '#ffd700'; ctx.lineWidth = 2; ctx.stroke()
  // Percentage
  ctx.fillStyle = t.textDim; ctx.font = '11px Arial'; ctx.textAlign = 'right'
  ctx.fillText(Math.round(volumeLevel * 100) + '%', px + pw - 20, py + 55)

  // Mute checkbox
  var cbX = px + 20, cbY = py + 100, cbS = 20
  ctx.fillStyle = t.btnS || '#333'
  rr(cbX, cbY, cbS, cbS, 4); ctx.fill()
  if (soundMuted) {
    ctx.fillStyle = t.accent || '#ffd700'
    rr(cbX + 2, cbY + 2, cbS - 4, cbS - 4, 3); ctx.fill()
    // Checkmark
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(cbX + 5, cbY + 10); ctx.lineTo(cbX + 9, cbY + 15); ctx.lineTo(cbX + 16, cbY + 5)
    ctx.stroke()
  }
  ctx.fillStyle = t.text || '#fff'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'left'
  ctx.fillText('\uD83D\uDD07 \u975C\u97F3', cbX + cbS + 10, cbY + 4)

  // Continue button
  var btnW = pw - 40, btnH = 44
  var btn1Y = py + 140
  drawBtn(px + 20, btn1Y, btnW, btnH, t.accent || '#ffd700', 10)
  ctx.fillStyle = '#000'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u25B6 \u7E7C\u7E8C\u904A\u6232', W / 2, btn1Y + btnH / 2)

  // Exit button
  var btn2Y = py + 196
  drawBtn(px + 20, btn2Y, btnW, btnH, '#e74c3c', 10)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\uD83D\uDEAA \u9000\u51FA\u904A\u6232', W / 2, btn2Y + btnH / 2)

  // Close X — top right
  ctx.fillStyle = t.textDim; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u2715', px + pw - 20, py + 14)
}

// ===== EXIT CONFIRM PANEL =====
function drawExitConfirm(t) {
  if (!showExitConfirm) return
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H)

  var pw = Math.min(260, W - 60), ph = 170
  var px = W / 2 - pw / 2, py = H / 2 - ph / 2

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 16
  ctx.fillStyle = t.board || '#1a1a2e'
  rr(px, py, pw, ph, 14); ctx.fill()
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 1.5
  rr(px, py, pw, ph, 14); ctx.stroke()
  ctx.restore()

  ctx.fillStyle = t.text || '#fff'; ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('\u78BA\u5B9A\u9000\u51FA\u904A\u6232\uFF1F', W / 2, py + 40)
  ctx.fillStyle = t.textDim; ctx.font = '12px Arial'
  ctx.fillText('\u5C07\u7D50\u7B97\u7576\u524D\u5206\u6578\u8207\u9032\u5EA6', W / 2, py + 65)

  // Confirm exit
  var btnW = (pw - 50) / 2, btnH = 40
  var btn1X = px + 15, btn2X = px + pw - btnW - 15, btnY = py + ph - 58
  drawBtn(btn1X, btnY, btnW, btnH, '#e74c3c', 8)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'center'
  ctx.fillText('\u78BA\u5B9A\u9000\u51FA', btn1X + btnW / 2, btnY + btnH / 2)

  drawBtn(btn2X, btnY, btnW, btnH, t.btnS || '#333', 8)
  ctx.fillStyle = t.text || '#fff'
  ctx.fillText('\u53D6\u6D88', btn2X + btnW / 2, btnY + btnH / 2)
}

// ===== TOASTS =====
function drawToasts(t) {
  var now = Date.now()
  toasts = toasts.filter(function(to) { return now - to.time < 2500 })
  for (var i = 0; i < toasts.length; i++) {
    var to = toasts[i]
    var age = now - to.time
    var alpha = age < 1800 ? 1 : 1 - (age - 1800) / 700
    // Slide-in animation
    var slideP = Math.min(age / 200, 1)
    var slideY = (1 - slideP) * -20
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.font = 'bold 13px Arial'; ctx.textAlign = 'center'
    var text = to.icon + ' ' + to.text
    var tw = ctx.measureText(text).width + 28
    var tx = W / 2 - tw / 2, ty = 70 + i * 30 + slideY
    var th = 24
    // Card background with gradient
    var toastGrad = ctx.createLinearGradient(tx, ty, tx, ty + th)
    toastGrad.addColorStop(0, 'rgba(50,30,80,0.92)')
    toastGrad.addColorStop(1, 'rgba(30,15,50,0.92)')
    ctx.fillStyle = toastGrad
    rr(tx, ty, tw, th, 12); ctx.fill()
    // Border glow
    ctx.strokeStyle = t.accent || '#ffd700'; ctx.lineWidth = 1
    ctx.globalAlpha = alpha * 0.5
    rr(tx, ty, tw, th, 12); ctx.stroke()
    // Text
    ctx.globalAlpha = alpha
    ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 2
    ctx.fillStyle = '#fff'
    ctx.fillText(text, W / 2, ty + th / 2)
    ctx.restore()
  }
}
