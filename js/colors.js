// ===== TILE COLORS =====
const TILE_COLORS = [
  null,
  {name:'紅',emoji:'🔴',bg1:'#FF6B6B',bg2:'#C0392B'},
  {name:'橙',emoji:'🟠',bg1:'#FFA502',bg2:'#D35400'},
  {name:'黃',emoji:'🟡',bg1:'#FFD32A',bg2:'#F39C12'},
  {name:'綠',emoji:'🟢',bg1:'#2ED573',bg2:'#009432'},
  {name:'青',emoji:'🔵',bg1:'#18DCFF',bg2:'#0984E3'},
  {name:'藍',emoji:'💎',bg1:'#7158E2',bg2:'#3D3D8E'},
  {name:'紫',emoji:'🔮',bg1:'#C56CF0',bg2:'#6F1E51'},
  {name:'暗金',emoji:'⭐',bg1:'#FFD700',bg2:'#DAA520',glow:'#FFEC80'},
  {name:'鑽石',emoji:'💠',bg1:'#4A90D9',bg2:'#2E6CB5',glow:'#A8D8EA'},
  {name:'虹',emoji:'👑',bg1:'#FF6B6B',bg2:'#6F1E51',glow:'#FFD700'},
  {name:'白',emoji:'⚪',bg1:'#FFFFFF',bg2:'#F0F0FF',glow:'#FFFFFF'},
  {name:'黑曜石',emoji:'🖤',bg1:'#2C2C2C',bg2:'#0A0A0A',glow:'#6A0DAD'},
]

function levelName(v) {
  if (v > 0 && v < TILE_COLORS.length) return TILE_COLORS[v].name
  return 'Lv.' + v
}
