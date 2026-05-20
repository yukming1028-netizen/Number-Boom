// ===== ACHIEVEMENTS =====
const ACHIEVEMENTS = [
  // === 主題解鎖成就 ===
  { id: 'first_rainbow', name: '\u4EBA\u751F\u662F\u5F69\u8272\u7684', desc: '\u9996\u6B21\u5408\u6210\u5F69\u8679\u65B9\u584A', icon: 'star', reward: { type: 'theme', id: 'rainbow' } },
  { id: 'first_white', name: '???', desc: '???', icon: 'question', hidden: true, reward: { type: 'theme', id: 'white' }, revealName: '\u7D14\u767D', revealDesc: '\u9996\u6B21\u5408\u6210\u7D14\u767D\u65B9\u584A' },
  { id: 'first_obsidian', name: '???', desc: '???', icon: 'question', hidden: true, reward: { type: 'theme', id: 'obsidian' }, revealName: '\u865B\u7121', revealDesc: '\u9996\u6B21\u5408\u6210\u865B\u7121\u65B9\u584A' },
  { id: 'million', name: '???', desc: '???', icon: 'question', hidden: true, reward: { type: 'theme', id: 'infinity' }, revealName: '\u4E0D\u53EF\u80FD\u7684\u4E8B', revealDesc: '\u7121\u76E1\u6A21\u5F0F\u9054\u5230100\u842C\u5206' },

  // === 累積分數成就（獎勵道具）===
  { id: 'score_1k', name: '\u521D\u51FA\u8305\u5E90', desc: '\u7D2F\u7A4D\u5206\u6578\u90541,000', icon: 'medal1', reward: { type: 'items', hammer: 1, swap: 1, lightning: 1 } },
  { id: 'score_10k', name: '\u5C0F\u6709\u540D\u6C23', desc: '\u7D2F\u7A4D\u5206\u6578\u905410,000', icon: 'medal2', reward: { type: 'items', hammer: 2, swap: 2, lightning: 2 } },
  { id: 'score_50k', name: '\u540D\u8072\u5927\u5660', desc: '\u7D2F\u7A4D\u5206\u6578\u905450,000', icon: 'medal3', reward: { type: 'items', hammer: 3, swap: 3, lightning: 3 } },
  { id: 'score_100k', name: '\u50B3\u5947\u73A9\u5BB6', desc: '\u7D2F\u7A4D\u5206\u6578\u9054100,000', icon: 'medal4', reward: { type: 'items', hammer: 5, swap: 5, lightning: 5 } },
  { id: 'score_500k', name: '\u65B9\u584A\u5927\u5E2B', desc: '\u7D2F\u7A4D\u5206\u6578\u9054500,000', icon: 'medal5', reward: { type: 'items', hammer: 8, swap: 8, lightning: 8 } },

  // === 累積合成成就（獎勵道具）===
  { id: 'merge_100', name: '\u5408\u6210\u65B0\u624B', desc: '\u7D2F\u7A4D\u5408\u6210100\u6B21', icon: 'merge1', reward: { type: 'items', hammer: 2, swap: 1 } },
  { id: 'merge_500', name: '\u5408\u6210\u9054\u4EBA', desc: '\u7D2F\u7A4D\u5408\u6210500\u6B21', icon: 'merge2', reward: { type: 'items', hammer: 3, swap: 2, lightning: 1 } },
  { id: 'merge_2000', name: '\u5408\u6210\u5927\u5E2B', desc: '\u7D2F\u7A4D\u5408\u62102000\u6B21', icon: 'merge3', reward: { type: 'items', hammer: 5, swap: 5, lightning: 5 } },

  // === 累積連擊成就（獎勵道具）===
  { id: 'combo_3', name: '\u9023\u64CA\u5165\u9580', desc: '\u55AE\u5834\u90543\u9023\u64CA', icon: 'combo1', reward: { type: 'items', lightning: 2 } },
  { id: 'combo_5', name: '\u9023\u64CA\u9AD8\u624B', desc: '\u55AE\u5834\u90545\u9023\u64CA', icon: 'combo2', reward: { type: 'items', lightning: 3, swap: 2 } },
  { id: 'combo_8', name: '\u9023\u64CA\u4E4B\u795E', desc: '\u55AE\u5834\u90548\u9023\u64CA', icon: 'combo3', reward: { type: 'items', hammer: 3, swap: 3, lightning: 3 } },
]

// Get achievement icon SVG paths
function getAchievementIcon(type, size) {
  var u = size / 24
  var cmds = []
  switch(type) {
    case 'star':
      cmds = ['M12,2 L15,9 L22,9 L16.5,14 L18.5,22 L12,17.5 L5.5,22 L7.5,14 L2,9 L9,9 Z']
      break
    case 'question':
      cmds = ['M12,3 C8,3 6,6 6,9 L9,9 C9,7 10,6 12,6 C14,6 15,7 15,9 C15,12 9,12 9,16 L12,16']
      cmds.push('M12,20 A1,1,0,1,0,12.01,20')
      break
    case 'medal1': case 'medal2': case 'medal3': case 'medal4': case 'medal5':
      cmds = ['M8,2 L12,8 L16,2', 'M12,8 C8,8 5,12 5,17 C5,21 8,23 12,23 C16,23 19,21 19,17 C19,12 16,8 12,8 Z']
      break
    case 'merge1': case 'merge2': case 'merge3':
      cmds = ['M4,8 L12,8 L12,4 L20,10 L12,16 L12,12 L4,12 Z']
      break
    case 'combo1': case 'combo2': case 'combo3':
      cmds = ['M13,2 L4,14 L12,14 L11,22 L20,10 L12,10 Z']
      break
    default:
      cmds = ['M12,2 L15,9 L22,9 L16.5,14 L18.5,22 L12,17.5 L5.5,22 L7.5,14 L2,9 L9,9 Z']
  }
  return { u: u, cmds: cmds }
}

function drawAchievementIcon(cx, cy, size, type, color) {
  var info = getAchievementIcon(type, size)
  var u = info.u
  ctx.save()
  ctx.strokeStyle = color; ctx.fillStyle = color
  ctx.lineWidth = Math.max(1.5, size * 0.06)
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  for (var i = 0; i < info.cmds.length; i++) {
    // Parse SVG path commands
    var pathStr = info.cmds[i]
    ctx.beginPath()
    var parts = pathStr.match(/[MLCZA][^MLCZA]*/g)
    if (!parts) continue
    for (var j = 0; j < parts.length; j++) {
      var cmd = parts[j].trim()
      var letter = cmd[0]
      var nums = cmd.slice(1).split(',').map(Number)
      switch(letter) {
        case 'M': ctx.moveTo(cx + (nums[0]-12)*u, cy + (nums[1]-12)*u); break
        case 'L': ctx.lineTo(cx + (nums[0]-12)*u, cy + (nums[1]-12)*u); break
        case 'Z': ctx.closePath(); break
        case 'A':
          // Approximate arc with line for simplicity
          ctx.lineTo(cx + (nums[5]-12)*u, cy + (nums[6]-12)*u); break
      }
    }
    if (type === 'question') ctx.stroke()
    else if (info.cmds.length > 1) ctx.stroke()
    else { ctx.fill(); ctx.stroke() }
  }
  ctx.restore()
}

// Check and unlock achievements after merge events
function checkMergeAchievements(newValue) {
  var ach = S.getAchievements()
  // First rainbow tile
  if (newValue === 10 && !ach.first_rainbow) {
    unlockAchievement('first_rainbow', ach)
  }
  // First white tile
  if (newValue === 11 && !ach.first_white) {
    unlockAchievement('first_white', ach)
  }
  // First obsidian tile
  if (newValue === 12 && !ach.first_obsidian) {
    unlockAchievement('first_obsidian', ach)
  }
}

// Check score-based achievements
function checkScoreAchievements(totalScore) {
  var ach = S.getAchievements()
  var thresholds = [
    { id: 'score_1k', target: 1000 },
    { id: 'score_10k', target: 10000 },
    { id: 'score_50k', target: 50000 },
    { id: 'score_100k', target: 100000 },
    { id: 'score_500k', target: 500000 },
  ]
  for (var i = 0; i < thresholds.length; i++) {
    if (totalScore >= thresholds[i].target && !ach[thresholds[i].id]) {
      unlockAchievement(thresholds[i].id, ach)
    }
  }
  // Million (endless only, hidden)
  if (totalScore >= 1000000 && !ach.million) {
    unlockAchievement('million', ach)
  }
}

// Check merge count achievements
function checkMergeCountAchievements(totalMerges) {
  var ach = S.getAchievements()
  var thresholds = [
    { id: 'merge_100', target: 100 },
    { id: 'merge_500', target: 500 },
    { id: 'merge_2000', target: 2000 },
  ]
  for (var i = 0; i < thresholds.length; i++) {
    if (totalMerges >= thresholds[i].target && !ach[thresholds[i].id]) {
      unlockAchievement(thresholds[i].id, ach)
    }
  }
}

// Check combo achievements
function checkComboAchievements(combo) {
  var ach = S.getAchievements()
  var thresholds = [
    { id: 'combo_3', target: 3 },
    { id: 'combo_5', target: 5 },
    { id: 'combo_8', target: 8 },
  ]
  for (var i = 0; i < thresholds.length; i++) {
    if (combo >= thresholds[i].target && !ach[thresholds[i].id]) {
      unlockAchievement(thresholds[i].id, ach)
    }
  }
}

// Unlock an achievement and give rewards
function unlockAchievement(id, ach) {
  var def = ACHIEVEMENTS.find(function(a) { return a.id === id })
  if (!def) return
  ach[id] = true
  S.saveAchievements(ach)

  // Give rewards
  var rw = def.reward
  if (rw.type === 'theme') {
    if (S.unlockTheme(rw.id)) {
      var thDef = THEMES.find(function(t) { return t.id === rw.id })
      addToast('\uD83C\uDFC6 \u6210\u5C31\u89E3\u9396\uFF1A' + def.revealName + '\uFF01\n\uD83C\uDFA8 \u4E3B\u984C\uFF1A' + (thDef ? thDef.name : rw.id), '\u2B50')
    }
  } else if (rw.type === 'items') {
    if (rw.hammer) S.addItem('hammer', rw.hammer)
    if (rw.swap) S.addItem('swap', rw.swap)
    if (rw.lightning) S.addItem('lightning', rw.lightning)
    var parts = []
    if (rw.hammer) parts.push('\uD83D\uDD28\u00D7' + rw.hammer)
    if (rw.swap) parts.push('\uD83D\uDD04\u00D7' + rw.swap)
    if (rw.lightning) parts.push('\u26A1\u00D7' + rw.lightning)
    addToast('\uD83C\uDFC6 \u6210\u5C31\uFF1A' + def.name + '\uFF01\n\uD83C\uDF81 ' + parts.join(' '), '\u2B50')
  }
}

// Check daily streak theme unlocks
function checkDailyStreakThemes() {
  var streak = S.getDailyStreak()
  // Unlock themes at streak milestones 5/10/15/20/25/30
  var milestoneThemes = [
    { streak: 5, themeId: 'ocean' },
    { streak: 10, themeId: 'cyber' },
    { streak: 15, themeId: 'sunset' },
    { streak: 20, themeId: 'forest' },
    { streak: 25, themeId: 'kawaii' },
    { streak: 30, themeId: 'ink' },
  ]
  for (var i = 0; i < milestoneThemes.length; i++) {
    var ms = milestoneThemes[i]
    if (streak >= ms.streak) {
      if (S.unlockTheme(ms.themeId)) {
        var thDef = THEMES.find(function(t) { return t.id === ms.themeId })
        addToast('\uD83D\uDCC5 \u6BCF\u65E5' + ms.streak + '\u5929\uFF01\u89E3\u9396\uFF1A' + (thDef ? thDef.name : ms.themeId), '\uD83C\uDF89')
      }
    }
  }
}
