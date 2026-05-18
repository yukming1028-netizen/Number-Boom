/**
 * Grid — 數字大爆炸核心邏輯 (5×5)
 * 色彩進階: 紅→橙→黃→綠→青→藍→紫→金→鑽→虹 (value +1)
 * 合併規則: 3+ 相鄰相同顏色 → 合併升級
 */
export class Grid {
constructor(cols = 5, rows = 5) {
  this.cols = cols
  this.rows = rows
  this.cells = []
  this.reset()
}

reset() {
  this.cells = Array.from({ length: this.rows }, () => Array(this.cols).fill(0))
}

clone() {
  const g = new Grid(this.cols, this.rows)
  g.cells = this.cells.map(r => [...r])
  return g
}

// ===== 基礎操作 =====

/** 投放方塊到指定列，返回落地的行號（-1=滿了） */
drop(col, value) {
  if (col < 0 || col >= this.cols) return -1
  if (this.cells[0][col] !== 0) return -1

  let targetRow = -1
  for (let r = this.rows - 1; r >= 0; r--) {
    if (this.cells[r][col] === 0) { targetRow = r; break }
  }
  if (targetRow === -1) return -1

  this.cells[targetRow][col] = value
  return targetRow
}

/** 重力 — 所有方塊往下落 */
applyGravity() {
  const moved = []
  for (let c = 0; c < this.cols; c++) {
    const vals = []
    for (let r = 0; r < this.rows; r++) {
      if (this.cells[r][c] !== 0) vals.push(this.cells[r][c])
    }
    for (let r = this.rows - 1; r >= 0; r--) {
      const idx = vals.length - (this.rows - r)
      const newVal = idx >= 0 ? vals[idx] : 0
      if (newVal !== this.cells[r][c]) moved.push({ r, c })
      this.cells[r][c] = newVal
    }
  }
  return moved
}

// ===== 合併系統 =====

/** BFS 找相鄰同值群組，返回大小≥3的群組 */
findGroups() {
  const visited = Array.from({ length: this.rows }, () => Array(this.cols).fill(false))
  const groups = []

  for (let r = 0; r < this.rows; r++) {
    for (let c = 0; c < this.cols; c++) {
      if (this.cells[r][c] === 0 || visited[r][c]) continue

      const value = this.cells[r][c]
      const group = []
      const queue = [{ r, c }]
      visited[r][c] = true

      while (queue.length > 0) {
        const cur = queue.shift()
        group.push(cur)

        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nr = cur.r + dr, nc = cur.c + dc
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols
            && !visited[nr][nc] && this.cells[nr][nc] === value) {
            visited[nr][nc] = true
            queue.push({ r: nr, c: nc })
          }
        }
      }

      if (group.length >= 3) {
        groups.push({ cells: group, value })
      }
    }
  }

  return groups
}

/**
 * 處理合併 — 返回 { score, chains, events }
 * 自動處理連鎖反應直到沒有新群組
 */
processMerges() {
  let totalScore = 0
  let chains = 0
  const events = []

  while (true) {
    const groups = this.findGroups()
    if (groups.length === 0) break

    chains++
    const cleared = [] // 所有被清除的格子（用於粒子特效）

    for (const group of groups) {
      const newValue = group.value + 1

      // 找錨點：最底部、然後最左邊
      let anchor = group.cells[0]
      for (const cell of group.cells) {
        if (cell.r > anchor.r || (cell.r === anchor.r && cell.c < anchor.c)) {
          anchor = cell
        }
      }

      // 記錄被清除的位置
      for (const { r, c } of group.cells) {
        cleared.push({ r, c, value: group.value })
        this.cells[r][c] = 0
      }

      // 放置合併後的方塊
      this.cells[anchor.r][anchor.c] = newValue

      // 計分: 新值 × 消除數量 × 連鎖倍率
      const chainMultiplier = 1 + (chains - 1) * 0.5
      const groupScore = Math.floor(newValue * newValue * group.cells.length * chainMultiplier)
      totalScore += groupScore

      events.push({
        anchor: { ...anchor },
        newValue,
        cleared: [...cleared],
        chain: chains,
        score: groupScore,
        groupSize: group.cells.length,
      })
    }

    this.applyGravity()
  }

  return { score: totalScore, chains, events }
}

// ===== 遊戲狀態 =====

/** 某列是否已滿 */
isColFull(c) {
  return this.cells[0][c] !== 0
}

/** 是否 Game Over（所有列都滿了） */
isGameOver() {
  for (let c = 0; c < this.cols; c++) {
    if (this.cells[0][c] === 0) return false
  }
  return true
}

/** 棋盤上的最大值 */
getMaxValue() {
  let max = 0
  for (const row of this.cells) for (const v of row) if (v > max) max = v
  return max
}

/** 非空方塊數量 */
getCount() {
  let n = 0
  for (const row of this.cells) for (const v of row) if (v > 0) n++
  return n
}

// ===== 道具效果 =====

/** 炸彈 — 清除以 (r,c) 為中心的 3x3 區域 */
bomb(r, c) {
  const cleared = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.cells[nr][nc] > 0) {
        cleared.push({ r: nr, c: nc, value: this.cells[nr][nc] })
        this.cells[nr][nc] = 0
      }
    }
  }
  this.applyGravity()
  return cleared
}

/** 洗牌 — 隨機打亂所有方塊位置 */
shuffle() {
  const values = []
  const positions = []
  for (let r = 0; r < this.rows; r++) {
    for (let c = 0; c < this.cols; c++) {
      if (this.cells[r][c] > 0) {
        values.push(this.cells[r][c])
        positions.push({ r, c })
      }
    }
  }
  // Fisher-Yates
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]]
  }
  // 先清空再放回
  for (const p of positions) this.cells[p.r][p.c] = 0
  for (let i = 0; i < positions.length; i++) {
    this.cells[positions[i].r][positions[i].c] = values[i]
  }
  this.applyGravity()
}
  /** 錘子 — 消除選中的一格 */
  hammer(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return []
    if (this.cells[r][c] === 0) return []
    const v = this.cells[r][c]
    this.cells[r][c] = 0
    this.applyGravity()
    return [{ r, c, value: v }]
  }

  /** 閃電 — 消除所有與選中格相同值的方塊 */
  lightning(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return []
    const target = this.cells[r][c]
    if (target === 0) return []
    const cleared = []
    for (let ri = 0; ri < this.rows; ri++) {
      for (let ci = 0; ci < this.cols; ci++) {
        if (this.cells[ri][ci] === target) {
          cleared.push({ r: ri, c: ci, value: target })
          this.cells[ri][ci] = 0
        }
      }
    }
    this.applyGravity()
    return cleared
  }

  /** 加一列 */
  expandCol() {
    this.cols++
    for (let r = 0; r < this.rows; r++) this.cells[r].push(0)
  }

  /** 加一行（頂部） */
  expandRow() {
    this.rows++
    this.cells.unshift(Array(this.cols).fill(0))
  }

}