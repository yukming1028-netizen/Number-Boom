// ===== INPUT HANDLING =====

var _dragSlider = null  // 'bgm' | 'sfx' | null — which slider is being dragged

function _getSliderLayout() {
  var inGame = (state === 'playing' || state === 'item_select')
  var pw = Math.min(280, W - 40), ph = inGame ? 340 : 240
  var panX = W / 2 - pw / 2, panY = H / 2 - ph / 2
  // Slider track positions (must match drawSettingsPanel)
  var bgmY = panY + 55
  var sfxY = panY + 115
  var cbW = 32  // checkbox area width on right
  return {
    bgm: { x: panX + 22, y: bgmY + 24, w: pw - 22 - 12 - cbW },
    sfx: { x: panX + 22, y: sfxY + 24, w: pw - 22 - 12 - cbW }
  }
}

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
  if (_dragSlider && showSettings) {
    var lay = _getSliderLayout()
    var sl = lay[_dragSlider]
    var val = Math.max(0, Math.min(1, (px - sl.x) / sl.w))
    if (_dragSlider === 'bgm') { bgmVolume = val; S.setBgmVolume(val) }
    else { sfxVolume = val; S.setSfxVolume(val) }
    return
  }
  // Only track hover within board area
  if (py >= boardTop && py <= boardTop + boardH && px >= boardX && px <= boardX + boardW) {
    hoverCol = pixelToCol(px)
  } else {
    hoverCol = -1
  }
}, { passive: false })

canvas.addEventListener('touchend', function(e) {
  _dragSlider = null
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
  if (_dragSlider && showSettings) {
    var lay = _getSliderLayout()
    var sl = lay[_dragSlider]
    var val = Math.max(0, Math.min(1, (px - sl.x) / sl.w))
    if (_dragSlider === 'bgm') { bgmVolume = val; S.setBgmVolume(val) }
    else { sfxVolume = val; S.setSfxVolume(val) }
    return
  }
  // Only track hover within board area
  if (py >= boardTop && py <= boardTop + boardH && px >= boardX && px <= boardX + boardW) {
    hoverCol = pixelToCol(px)
  } else {
    hoverCol = -1
  }
})

canvas.addEventListener('mouseup', function() {
  _dragSlider = null
})

canvas.addEventListener('mouseleave', function() {
  _dragSlider = null
  hoverCol = -1
})

function handleClick(px, py) {
  // Exit confirm panel takes priority
  if (showExitConfirm) { handleExitConfirmClick(px, py); return }
  // Settings panel
  if (showSettings) { handleSettingsClick(px, py); return }
  if (state === 'menu') { handleMenuClick(px, py); return }
  if (state === 'playing' || state === 'item_select') { handlePlayClick(px, py); return }
  if (state === 'gameover') { handleGameOverClick(px, py); return }
  if (state === 'themes') { handleThemeClick(px, py); return }
  if (state === 'achievements') { handleAchievementClick(px, py); return }
  if (state === 'leaderboard') { handleLeaderboardClick(px, py); return }
  if (state === 'auto_summary') { handleAutoSummaryClick(px, py); return }
}

function handleMenuClick(px, py) {
  var btnW = 230, btnX = W / 2 - btnW / 2

  // Right icons (4: settings, theme, achievement, leaderboard)
  var iconX = W - MI_W - 4
  if (px >= iconX && px <= iconX + MI_W) {
    var iconSpan = 3 * MI_GAP + MI_H
    var iconY0 = (_coverBoardY != null) ? _coverBoardY + (_coverBoardH - iconSpan) / 2 - 25 : 65
    if (py >= iconY0 && py < iconY0 + MI_H) { showSettings = true; return }
    if (py >= iconY0 + MI_GAP && py < iconY0 + MI_GAP + MI_H) { state = 'themes'; return }
    if (py >= iconY0 + MI_GAP * 2 && py < iconY0 + MI_GAP * 2 + MI_H) { state = 'achievements'; return }
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
  // Settings gear — top right circle area
  if (px >= W - 35 && px <= W - 5 && py >= 5 && py <= 35) {
    showSettings = true; return
  }

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

function handleAchievementClick(px, py) {
  // Back button
  if (py >= H - 50 && py <= H - 10 && px >= W / 2 - 80 && px <= W / 2 + 80) {
    state = 'menu'; achScrollY = 0; return
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

function handleSettingsClick(px, py) {
  var inGame = (state === 'playing' || state === 'item_select')
  var pw = Math.min(280, W - 40), ph = inGame ? 340 : 240
  var panX = W / 2 - pw / 2, panY = H / 2 - ph / 2

  // Close X — top right
  if (px >= panX + pw - 30 && px <= panX + pw && py >= panY && py <= panY + 30) {
    showSettings = false; return
  }

  var bgmY = panY + 55
  var sfxY = panY + 115
  var cbW = 32, cbH = 32

  // BGM checkbox (right of slider row)
  var cb1X = panX + pw - 12 - cbW, cb1Y = bgmY + 12
  if (px >= cb1X && px <= cb1X + cbW && py >= cb1Y && py <= cb1Y + cbH) {
    bgmMuted = !bgmMuted; S.setBgmMuted(bgmMuted); return
  }

  // SFX checkbox
  var cb2X = panX + pw - 12 - cbW, cb2Y = sfxY + 12
  if (px >= cb2X && px <= cb2X + cbW && py >= cb2Y && py <= cb2Y + cbH) {
    sfxMuted = !sfxMuted; S.setSfxMuted(sfxMuted); return
  }

  // BGM slider — start drag
  var bgmSlX = panX + 22, bgmSlY = bgmY + 24, bgmSlW = pw - 22 - 12 - cbW
  if (py >= bgmSlY - 16 && py <= bgmSlY + 24 && px >= bgmSlX && px <= bgmSlX + bgmSlW) {
    _dragSlider = 'bgm'
    bgmVolume = Math.max(0, Math.min(1, (px - bgmSlX) / bgmSlW))
    S.setBgmVolume(bgmVolume); return
  }

  // SFX slider — start drag
  var sfxSlX = panX + 22, sfxSlY = sfxY + 24, sfxSlW = pw - 22 - 12 - cbW
  if (py >= sfxSlY - 16 && py <= sfxSlY + 24 && px >= sfxSlX && px <= sfxSlX + sfxSlW) {
    _dragSlider = 'sfx'
    sfxVolume = Math.max(0, Math.min(1, (px - sfxSlX) / sfxSlW))
    S.setSfxVolume(sfxVolume); return
  }

  if (inGame) {
    var btnW = pw - 40, btnH = 44
    var btn1Y = panY + 185
    if (px >= panX + 20 && px <= panX + 20 + btnW && py >= btn1Y && py <= btn1Y + btnH) {
      showSettings = false; return
    }
    var btn2Y = panY + 241
    if (px >= panX + 20 && px <= panX + 20 + btnW && py >= btn2Y && py <= btn2Y + btnH) {
      showSettings = false; showExitConfirm = true; return
    }
  } else {
    var closeY = panY + ph - 60
    var btnW = pw - 40, btnH = 44
    if (px >= panX + 20 && px <= panX + 20 + btnW && py >= closeY && py <= closeY + btnH) {
      showSettings = false; return
    }
  }
}

function handleExitConfirmClick(px, py) {
  var t = getTheme()
  var pw = Math.min(260, W - 60), ph = 170
  var panX = W / 2 - pw / 2, panY = H / 2 - ph / 2

  var btnW = (pw - 50) / 2, btnH = 40
  var btn1X = panX + 15, btn2X = panX + pw - btnW - 15, btnY = panY + ph - 58

  // Confirm exit — settle score and go to gameover
  if (px >= btn1X && px <= btn1X + btnW && py >= btnY && py <= btnY + btnH) {
    showExitConfirm = false; showSettings = false
    endGame(); return
  }
  // Cancel
  if (px >= btn2X && px <= btn2X + btnW && py >= btnY && py <= btnY + btnH) {
    showExitConfirm = false; return
  }
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
