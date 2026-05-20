// ===== INPUT HANDLING =====

canvas.addEventListener('touchstart', function(e) {
  e.preventDefault()
  var touch = e.touches[0]
  var rect = canvas.getBoundingClientRect()
  handleClick(touch.clientX - rect.left, touch.clientY - rect.top)
}, { passive: false })

canvas.addEventListener('touchmove', function(e) {
  e.preventDefault()
  var touch = e.touches[0]
  var rect = canvas.getBoundingClientRect()
  var px = touch.clientX - rect.left
  var py = touch.clientY - rect.top
  // Only track hover within board area
  if (py >= boardTop && py <= boardTop + boardH && px >= boardX && px <= boardX + boardW) {
    hoverCol = pixelToCol(px)
  } else {
    hoverCol = -1
  }
}, { passive: false })

canvas.addEventListener('touchend', function(e) {
  hoverCol = -1
}, { passive: false })

canvas.addEventListener('click', function(e) {
  var rect = canvas.getBoundingClientRect()
  handleClick(e.clientX - rect.left, e.clientY - rect.top)
})

canvas.addEventListener('mousemove', function(e) {
  var rect = canvas.getBoundingClientRect()
  var px = e.clientX - rect.left
  var py = e.clientY - rect.top
  // Only track hover within board area
  if (py >= boardTop && py <= boardTop + boardH && px >= boardX && px <= boardX + boardW) {
    hoverCol = pixelToCol(px)
  } else {
    hoverCol = -1
  }
})

canvas.addEventListener('mouseleave', function() {
  hoverCol = -1
})

function handleClick(px, py) {
  if (state === 'menu') { handleMenuClick(px, py); return }
  if (state === 'playing' || state === 'item_select') { handlePlayClick(px, py); return }
  if (state === 'gameover') { handleGameOverClick(px, py); return }
  if (state === 'themes') { handleThemeClick(px, py); return }
  if (state === 'leaderboard') { handleLeaderboardClick(px, py); return }
  if (state === 'auto_summary') { handleAutoSummaryClick(px, py); return }
}

function handleMenuClick(px, py) {
  var btnW = 230, btnX = W / 2 - btnW / 2

  // Right icons (4: settings, theme, achievement, leaderboard)
  var iconX = W - MI_W - 4
  if (px >= iconX && px <= iconX + MI_W) {
    var iconSpan = 3 * MI_GAP + MI_H
    var iconY0 = (_coverBoardY != null) ? _coverBoardY + (_coverBoardH - iconSpan) / 2 : 90
    if (py >= iconY0 && py < iconY0 + MI_H) { addToast('\u2699\uFE0F \u8A2D\u5B9A\u5373\u5C07\u63A8\u51FA', '\uD83D\uDEE0\uFE0F'); return }
    if (py >= iconY0 + MI_GAP && py < iconY0 + MI_GAP + MI_H) { state = 'themes'; return }
    if (py >= iconY0 + MI_GAP * 2 && py < iconY0 + MI_GAP * 2 + MI_H) { addToast('\uD83C\uDFC6 \u6210\u5C31\u5373\u5C07\u63A8\u51FA', '\u2B50'); return }
    if (py >= iconY0 + MI_GAP * 3 && py < iconY0 + MI_GAP * 3 + MI_H) { state = 'leaderboard'; return }
  }

  // 每日挑戰
  var dy = H - 252
  if (px >= btnX && px <= btnX + btnW && py >= dy && py <= dy + 58) {
    startGame('daily'); return
  }

  // 無盡模式
  var ey = H - 182
  if (px >= btnX && px <= btnX + btnW && py >= ey && py <= ey + 50) {
    startGame('endless'); return
  }

  // Test buttons (3 side by side)
  var testY = H - 120
  var tbW = Math.floor((btnW - 8) / 3)
  if (py >= testY && py <= testY + 34) {
    if (px >= btnX && px <= btnX + tbW) {
      S.refreshDaily(); state = 'menu'; return
    }
    if (px >= btnX + tbW + 4 && px <= btnX + tbW * 2 + 4) {
      startGame('endless'); startAutoPlay('endless'); return
    }
    if (px >= btnX + (tbW + 4) * 2 && px <= btnX + (tbW + 4) * 2 + tbW) {
      startGame('daily'); startAutoPlay('daily'); return
    }
  }
}

function handlePlayClick(px, py) {
  // Item bar — full width layout
  var items = S.getItems()
  var itemKeys = ['hammer', 'swap', 'lightning']
  var ibGap = 6
  var ibW = (boardW - ibGap * 2) / 3
  var ibH = 62
  var ibY = boardTop + boardH + 8

  for (var i = 0; i < 3; i++) {
    var ix = boardX + i * (ibW + ibGap)
    if (px >= ix && px <= ix + ibW && py >= ibY && py <= ibY + ibH) {
      if (state === 'item_select') {
        itemSelectType = null; swapFirst = null; state = 'playing'; return
      }
      useItemAction(itemKeys[i])
      return
    }
  }

  // Board click — must click on actual cell
  if (state === 'item_select') {
    var cell = pixelToCell(px, py)
    if (cell.r >= 0 && cell.r < grid.rows && cell.c >= 0 && cell.c < grid.cols) {
      doItemTarget(cell.r, cell.c)
    }
    return
  }

  // Drop — must click on actual cell within board
  if (state === 'playing') {
    var cell = pixelToCell(px, py)
    if (cell.r >= 0 && cell.r < grid.rows && cell.c >= 0 && cell.c < grid.cols) {
      doDrop(cell.c)
    }
  }
}

function handleGameOverClick(px, py) {
  var daily = mode === 'daily' ? S.getDaily() : null
  var ch = daily ? daily.challenge : null
  var isComplete = daily ? daily.completed : false

  var cardW = Math.min(300, W - 40)
  var cx = W / 2 - cardW / 2
  var cardH, cy

  if (mode === 'daily' && !isComplete) {
    cardH = 340; cy = H / 2 - cardH / 2
    // Ad buttons (SVG icons)
    var adBtnW = 60, adBtnH = 32
    var adKeys = ['hammer', 'swap', 'lightning']
    var adStartX = W / 2 - (3 * adBtnW + 2 * 6) / 2
    var adY = cy + 155
    for (var i = 0; i < 3; i++) {
      var ax = adStartX + i * (adBtnW + 6)
      if (px >= ax && px <= ax + adBtnW && py >= adY && py <= adY + adBtnH) {
        watchAdForItem(adKeys[i]); return
      }
    }
    // Retry + Menu
    var btnW2 = 120, btnH2 = 40
    var by = cy + 200
    if (py >= by && py <= by + btnH2) {
      if (px >= W / 2 - btnW2 - 8 && px <= W / 2 - 8) { startGame('daily'); return }
      if (px >= W / 2 + 8 && px <= W / 2 + btnW2 + 8) { state = 'menu'; return }
    }
  } else if (mode === 'daily') {
    cardH = 240; cy = H / 2 - cardH / 2
    var btnW3 = 160, btnH3 = 42, by3 = cy + 150
    if (px >= W / 2 - btnW3 / 2 && px <= W / 2 + btnW3 / 2 && py >= by3 && py <= by3 + btnH3) { state = 'menu'; return }
  } else {
    cardH = 260; cy = H / 2 - cardH / 2
    var btnW2 = 120, btnH2 = 40, by = cy + 130
    if (py >= by && py <= by + btnH2) {
      if (px >= W / 2 - btnW2 - 8 && px <= W / 2 - 8) { startGame('endless'); return }
      if (px >= W / 2 + 8 && px <= W / 2 + btnW2 + 8) { state = 'menu'; return }
    }
  }
}

function handleAutoSummaryClick(px, py) {
  var cardW = Math.min(300, W - 40), cardH = 380
  var cx = W / 2 - cardW / 2, cy = H / 2 - cardH / 2
  var by = cy + 280
  var btnW3 = 160, btnH3 = 42
  if (px >= W / 2 - btnW3 / 2 && px <= W / 2 + btnW3 / 2 && py >= by && py <= by + btnH3) {
    state = 'menu'
  }
}

function handleThemeClick(px, py) {
  var unlocked = S.getUnlockedThemes()
  var cols = 3, thW = 90, thH = 80, gap = 10
  var totalW = cols * thW + (cols - 1) * gap
  var startX = W / 2 - totalW / 2, startY = 60

  for (var i = 0; i < THEMES.length; i++) {
    var col = i % cols, row = Math.floor(i / cols)
    var x = startX + col * (thW + gap), y = startY + row * (thH + gap)
    if (px >= x && px <= x + thW && py >= y && py <= y + thH) {
      var th = THEMES[i]
      if (unlocked.includes(th.id)) {
        S.setTheme(th.id)
        addToast('\uD83C\uDFA8 ' + th.icon + ' ' + th.name, '\u2705')
      } else {
        addToast('\uD83D\uDD12 \u672A\u89E3\u9396', '\u274C')
      }
      return
    }
  }

  if (px >= W / 2 - 80 && px <= W / 2 + 80 && py >= H - 60 && py <= H - 20) {
    state = 'menu'
  }
}

function handleLeaderboardClick(px, py) {
  // Back button at bottom
  var backY = H - 50
  var backH = 40
  if (py >= backY && py <= backY + backH) {
    state = 'menu'; return
  }
  // Bottom tabs
  var tabW = (W - margin * 2 - 6) / 2
  var tabH = 38
  var tabY = H - 98
  if (py >= tabY && py <= tabY + tabH) {
    if (px >= margin && px <= margin + tabW) { lbTab = 'endless'; return }
    if (px >= margin + tabW + 6 && px <= margin + tabW * 2 + 6) { lbTab = 'daily'; return }
  }
  // Edit name — tap name area (y 42-62)
  if (py >= 42 && py <= 62) {
    var newName = prompt('\u8F38\u5165\u4F60\u7684\u540D\u5B57', S.getName())
    if (newName && newName.trim()) S.setName(newName)
    return
  }
  // Back — tap title area
  if (py <= 40) { state = 'menu' }
}

function pixelToCol(px) {
  for (var c = 0; c < grid.cols; c++) {
    var x = boardX + cellGap + c * (cellW + cellGap)
    if (px >= x && px <= x + cellW) return c
  }
  return -1
}

function pixelToCell(px, py) {
  for (var r = 0; r < grid.rows; r++) {
    for (var c = 0; c < grid.cols; c++) {
      var x = boardX + cellGap + c * (cellW + cellGap)
      var y = boardTop + cellGap + r * (cellH + cellGap)
      if (px >= x && px <= x + cellW && py >= y && py <= y + cellH) return { r: r, c: c }
    }
  }
  return { r: -1, c: -1 }
}
