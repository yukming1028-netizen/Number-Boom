// ===== LAYOUT (dynamic, recalculated) =====
let COLS, ROWS, margin, headerH, previewH, boardTop, boardW, cellGap, cellW, cellH, boardH, boardX, itemBarH, backBtnH, bottomPad

function recalcLayout() {
  COLS = grid.cols; ROWS = grid.rows
  margin = 8
  headerH = 75  // score + current piece + progress
  previewH = 20 // gap above board for floating piece
  itemBarH = 66; backBtnH = 32; bottomPad = 10
  boardTop = headerH + previewH
  boardW = W - margin * 2
  cellGap = 3
  var cwW = Math.floor((boardW - cellGap * (COLS + 1)) / COLS)
  var availH = H - boardTop - itemBarH - backBtnH - bottomPad - 20
  var cwH = Math.floor((availH - cellGap * (ROWS + 1)) / ROWS)
  var cs = Math.max(20, Math.min(cwW, cwH))
  cellW = cs; cellH = cs
  boardH = cellH * ROWS + cellGap * (ROWS + 1)
  boardX = margin
}
