/**
 * Grid 單元測試 (5×5)
 */
import { Grid } from './grid.js'

let P = 0, F = 0
function ok(cond, msg) { cond ? (P++, console.log(`  ✅ ${msg}`)) : (F++, console.log(`  ❌ ${msg}`)) }
function eq(a, b, msg) { ok(JSON.stringify(a) === JSON.stringify(b), msg); if (JSON.stringify(a) !== JSON.stringify(b)) console.log(`     got: ${JSON.stringify(a)}, want: ${JSON.stringify(b)}`) }

// ===== 5×5 Grid =====
console.log('\n📋 Grid 基礎 (5×5)')
const g = new Grid(5, 5)
eq(g.cols, 5, 'cols = 5')
eq(g.rows, 5, 'rows = 5')
eq(g.cells.length, 5, '5 rows')
eq(g.cells[0].length, 5, '5 cols')

// ===== Drop =====
console.log('\n📋 Drop 測試')
const g1 = new Grid(5, 5)
eq(g1.drop(2, 1), 4, 'drop 到 col 2, 落到 row 4')
eq(g1.drop(2, 2), 3, 'drop 到 col 2, 落到 row 3')
eq(g1.cells[4][2], 1, 'row4 col2 = 1')
eq(g1.cells[3][2], 2, 'row3 col2 = 2')
eq(g1.isColFull(2), false, 'col 2 未滿')

// Fill col
for (let i = 0; i < 3; i++) g1.drop(0, 1)  // already 2 in col2, need 5 total for col0
eq(g1.isColFull(0), false, 'col 0 未滿 (only 3)')
for (let i = 0; i < 2; i++) g1.drop(0, 1)  // now 5
eq(g1.isColFull(0), true, 'col 0 已滿 (5/5)')
eq(g1.drop(0, 1), -1, '滿的列不能再 drop')
eq(g1.isGameOver(), false, '其他列還有空位')

// ===== Gravity =====
console.log('\n📋 Gravity 測試')
const g2 = new Grid(5, 5)
g2.cells[1][1] = 3; g2.cells[3][1] = 5
g2.applyGravity()
eq(g2.cells[4][1], 5, 'gravity: 5 落到底部')
eq(g2.cells[3][1], 3, 'gravity: 3 接著落下')
eq(g2.cells[1][1], 0, 'gravity: 原位清空')

// ===== FindGroups =====
console.log('\n📋 FindGroups 測試')
const g3 = new Grid(5, 5)
g3.cells[4][1] = 2; g3.cells[4][2] = 2; g3.cells[4][3] = 2
const groups3 = g3.findGroups()
eq(groups3.length, 1, '找到 1 個群組')
eq(groups3[0].value, 2, '群組值為 2')
eq(groups3[0].cells.length, 3, '群組大小 3')

// 不夠 3 個
const g4 = new Grid(5, 5)
g4.cells[4][0] = 4; g4.cells[4][1] = 4
eq(g4.findGroups().length, 0, '只有 2 個相鄰 → 不合併')

// ===== ProcessMerges (value+1) =====
console.log('\n📋 ProcessMerges 測試')
const g5 = new Grid(5, 5)
g5.cells[4][1] = 2; g5.cells[4][2] = 2; g5.cells[4][3] = 2
const result = g5.processMerges()
eq(result.chains, 1, '1 次連鎖')
ok(result.score > 0, `得分 ${result.score} > 0`)
let found3 = false
for (const row of g5.cells) for (const v of row) if (v === 3) found3 = true
ok(found3, '合併後出現 3 (2+1)')

// ===== 連鎖反應 =====
console.log('\n📋 連鎖反應測試')
const g6 = new Grid(5, 5)
g6.cells[2][1] = 3; g6.cells[3][1] = 3
g6.cells[4][0] = 2; g6.cells[4][1] = 2; g6.cells[4][2] = 2
const chain = g6.processMerges()
ok(chain.chains >= 2, `連鎖 ${chain.chains} >= 2`)

// ===== Hammer =====
console.log('\n📋 錘子測試')
const g7 = new Grid(5, 5)
g7.cells[4][2] = 5; g7.cells[3][2] = 3
const hammered = g7.hammer(3, 2)
eq(hammered.length, 1, '錘子消除 1 格')
eq(hammered[0].value, 3, '消除了 3')
eq(g7.cells[4][2], 5, 'gravity: 5 落下')
eq(g7.cells[3][2], 0, '原位清空')

// ===== Lightning =====
console.log('\n📋 閃電測試')
const g8 = new Grid(5, 5)
g8.cells[4][0] = 2; g8.cells[4][2] = 2; g8.cells[3][4] = 2; g8.cells[4][1] = 3
const zapped = g8.lightning(4, 0)
eq(zapped.length, 3, '閃電消除 3 個同色')
ok(zapped.every(c => c.value === 2), '全部是 value=2')

// ===== Expand =====
console.log('\n📋 擴展棋盤測試')
const g9 = new Grid(5, 5)
g9.expandRow()
eq(g9.rows, 6, '加行後 rows=6')
eq(g9.cells.length, 6, 'cells 有 6 rows')
eq(g9.cells[0].every(v => v === 0), true, '新行是空的')

g9.expandCol()
eq(g9.cols, 6, '加列後 cols=6')
eq(g9.cells[0].length, 6, '每行有 6 cols')

// ===== Swap =====
console.log('\n📋 Swap 測試')
const g10 = new Grid(5, 5)
g10.cells[4][0] = 1; g10.cells[4][1] = 2
g10.swap(4, 0, 4, 1)
eq(g10.cells[4][0], 2, 'swap 後 [4][0] = 2')
eq(g10.cells[4][1], 1, 'swap 後 [4][1] = 1')

// 黑曜石(12)不可合成
console.log('\n📋 黑曜石不可合成測試')
const g11 = new Grid(5, 5)
g11.cells[4][0] = 12; g11.cells[4][1] = 12; g11.cells[4][2] = 12
eq(g11.findGroups().length, 0, '3 個黑曜石不相鄰 → 不合成')

// ===== 結果 =====
console.log(`\n${'='.repeat(40)}`)
console.log(`📊 結果: ${P} 通過, ${F} 失敗`)
if (F === 0) console.log('🎉 全部通過！')
