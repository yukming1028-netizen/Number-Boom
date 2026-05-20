// ===== LAYOUT (dynamic, recalculated) =====
let COLS, ROWS, margin, headerH, previewH, boardTop, boardW, cellGap, cellW, cellH, boardH, boardX, itemBarH, backBtnH, bottomPad

function recalcLayout() {
  COLS = grid.cols; ROWS = grid.rows
  margin = 8
  headerH = Math.min(85, Math.floor(H * 0.1))
  previewH = Math.min(48, Math.floor(H * 0.06))
  itemBarH = 48; backBtnH = 32; bottomPad = 10
  boardTop = headerH + previewH + 4
  boardW = W - margin * 2
  cellGap = 3
  const cwW = Math.floor((boardW - cellGap * (COLS + 1)) / COLS)
  const availH = H - boardTop - itemBarH - backBtnH - bottomPad - 20
  const cwH = Math.floor((availH - cellGap * (ROWS + 1)) / ROWS)
  const cs = Math.max(20, Math.min(cwW, cwH))
  cellW = cs; cellH = cs
  boardH = cellH * ROWS + cellGap * (ROWS + 1)
  boardX = margin
}
