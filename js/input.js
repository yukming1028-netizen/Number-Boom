// ===== INPUT HANDLING =====

canvas.addEventListener('touchstart', function(e) {
  e.preventDefault()
  var touch = e.touches[0]
  var rect = canvas.getBoundingClientRect()
  handleClick(touch.clientX - rect.left, touch.clientY - rect.top)
}, { passive: false })

canvas.addEventListener('click', function(e) {
  var rect = canvas.getBoundingClientRect()
  handleClick(e.clientX - rect.left, e.clientY - rect.top)
})

function handleClick(px, py) {
  if (state === 'menu') { handleMenuClick(px, py); return }
  if (state === 'playing' || state === 'item_select') { handlePlayClick(px, py); return }
  if (state === 'gameover') { handleGameOverClick(px, py); return }
  if (state === 'themes') { handleThemeClick(px, py); return }
}

function handleMenuClick(px, py) {
  const t = getTheme()
  const btnW = 200, btnH = 48, btnX = W / 2 - btnW / 2

  // Endless
  if (px >= btnX && px <= btnX + btnW && py >= 130 && py <= 130 + btnH) {
    startGame('endless'); return
  }

  // Daily
  if (px >= btnX && px <= btnX + btnW && py >= 195 && py <= 195 + btnH) {
    startGame('daily'); return
  }

  // Theme
  if (px >= btnX && px <= btnX + btnW && py >= 265 && py <= 265 + btnH) {
    state = 'themes'; return
  }

  // Test buttons (3 side by side)
  const testY = 340
  const tbW = Math.floor((btnW - 8) / 3)
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
  // Item bar
  const items = S.getItems()
  const itemKeys = ['hammer', 'swap', 'lightning']
  const ibW = 50, ibH = 42
  const totalW = 3 * ibW + 2 * 4
  const startX = boardX + boardW / 2 - totalW / 2
  const ibY = boardTop + boardH + 6

  for (let i = 0; i < 3; i++) {
    const ix = startX + i * (ibW + 4)
    if (px >= ix && px <= ix + ibW && py >= ibY && py <= ibY + ibH) {
      if (state === 'item_select') {
        itemSelectType = null; swapFirst = null; state = 'playing'; return
      }
      useItemAction(itemKeys[i])
      return
    }
  }

  // Board click
  if (state === 'item_select') {
    const { r, c } = pixelToCell(px, py)
    if (r >= 0 && r < grid.rows && c >= 0 && c < grid.cols) {
      doItemTarget(r, c)
    }
    return
  }

  // Drop column
  const col = pixelToCol(px)
  if (col >= 0 && col < grid.cols) {
    doDrop(col)
  }
}

function handleGameOverClick(px, py) {
  const t = getTheme()
  const cardW = Math.min(300, W - 40)
  const cx = W / 2 - cardW / 2

  if (mode === 'daily') {
    const daily = S.getDaily()
    const ch = daily.challenge
    const isComplete = daily.completed
    const cardH = 320
    const cy = H / 2 - cardH / 2

    if (!isComplete) {
      // Ad-for-items buttons
      const adBtnW = 60, adBtnH = 32
      const adKeys = ['hammer', 'swap', 'lightning']
      const adStartX = W / 2 - (3 * adBtnW + 2 * 6) / 2
      const adY = cy + 155
      for (let i = 0; i < 3; i++) {
        const ax = adStartX + i * (adBtnW + 6)
        if (px >= ax && px <= ax + adBtnW && py >= adY && py <= adY + adBtnH) {
          watchAdForItem(adKeys[i])
          return
        }
      }

      // Retry + Menu
      const btnW2 = 120, btnH2 = 40
      const by = cy + 200
      if (py >= by && py <= by + btnH2) {
        if (px >= W / 2 - btnW2 - 8 && px <= W / 2 - 8) {
          startGame('daily'); return // retry with accumulated progress
        }
        if (px >= W / 2 + 8 && px <= W / 2 + btnW2 + 8) {
          state = 'menu'; return
        }
      }
    } else {
      // Completed — menu only
      const btnW2 = 160, btnH2 = 42
      const by = cy + 160
      if (px >= W / 2 - btnW2 / 2 && px <= W / 2 + btnW2 / 2 && py >= by && py <= by + btnH2) {
        state = 'menu'; return
      }
    }
  } else {
    // Endless
    const cardH = 260
    const cy = H / 2 - cardH / 2
    const btnW2 = 120, btnH2 = 40
    const by = cy + 140
    if (py >= by && py <= by + btnH2) {
      if (px >= W / 2 - btnW2 - 8 && px <= W / 2 - 8) {
        startGame('endless'); return
      }
      if (px >= W / 2 + 8 && px <= W / 2 + btnW2 + 8) {
        state = 'menu'; return
      }
    }
  }
}

function handleThemeClick(px, py) {
  const t = getTheme()
  const unlocked = S.getUnlockedThemes()
  const cols = 3, thW = 90, thH = 80, gap = 10
  const totalW = cols * thW + (cols - 1) * gap
  const startX = W / 2 - totalW / 2, startY = 60

  for (let i = 0; i < THEMES.length; i++) {
    const col = i % cols, row = Math.floor(i / cols)
    const x = startX + col * (thW + gap), y = startY + row * (thH + gap)
    if (px >= x && px <= x + thW && py >= y && py <= y + thH) {
      const th = THEMES[i]
      if (unlocked.includes(th.id)) {
        S.setTheme(th.id)
        addToast(`🎨 ${th.icon} ${th.name}`, '✅')
      } else {
        addToast('🔒 未解鎖', '❌')
      }
      return
    }
  }

  // Back button
  if (px >= W / 2 - 80 && px <= W / 2 + 80 && py >= H - 60 && py <= H - 20) {
    state = 'menu'
  }
}

function pixelToCol(px) {
  for (let c = 0; c < grid.cols; c++) {
    const x = boardX + cellGap + c * (cellW + cellGap)
    if (px >= x && px <= x + cellW) return c
  }
  return -1
}

function pixelToCell(px, py) {
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const x = boardX + cellGap + c * (cellW + cellGap)
      const y = boardTop + cellGap + r * (cellH + cellGap)
      if (px >= x && px <= x + cellW && py >= y && py <= y + cellH) return { r, c }
    }
  }
  return { r: -1, c: -1 }
}
