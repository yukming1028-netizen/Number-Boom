// ===== ACHIEVEMENTS =====
const ACHIEVEMENTS = [
  // === 主題解鎖成就 ===
  { id: 'first_rainbow', name: '\u4EBA\u751F\u662F\u5F69\u8272\u7684', desc: '\u9996\u6B21\u5408\u6210\u5F69\u8679\u65B9\u584A', icon: 'star', reward: { type: 'theme', id: 'rainbow' } },
  { id: 'first_white', name: '???', desc: '???', icon: 'question', hidden: true, reward: { type: 'theme', id: 'white' }, revealName: '\u7D14\u767D', revealDesc: '\u9996\u6B21\u5408\u6210\u7D14\u767D\u65B9\u584A' },
  { id: 'first_obsidian', name: '???', desc: '???', icon: 'question', hidden: true, reward: { type: 'theme', id: 'obsidian' }, revealName: '\u865B\u7121', revealDesc: '\u9996\u6B21\u5408\u6210\u865B\u7121\u65B9\u584A' },
  { id: 'million', name: '???', desc: '???', icon: 'question', hidden: true, reward: { type: 'theme', id: 'infinity' }, revealName: '\u4E0D\u53EF\u80FD\u7684\u4E8B', revealDesc: '\u7121\u76E1\u6A21\u5F0F\u9054\u5230100\u842C\u5206' },

  // === 累積成就（無上限，每達成一個階梯就獎勵）===
  { id: 'cum_score', name: '\u5206\u6578\u5927\u5E2B', desc: '\u6BCF\u7D2F\u7A4D10\u842C\u5206', icon: 'medal', repeatable: true, step: 100000, reward: { hammer: 1, swap: 1, lightning: 1 } },
  { id: 'cum_merge', name: '\u5408\u6210\u9054\u4EBA', desc: '\u6BCF\u7D2F\u7A4D1000\u6B21\u5408\u6210', icon: 'merge', repeatable: true, step: 1000, reward: { hammer: 2, swap: 1, lightning: 1 } },
  { id: 'cum_combo', name: '\u9023\u64CA\u4E4B\u795E', desc: '\u6BCF\u7D2F\u7A4D100\u6B21\u9023\u64CA', icon: 'combo', repeatable: true, step: 100, reward: { hammer: 1, swap: 2, lightning: 2 } },
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
    case 'medal':
      cmds = ['M8,2 L12,8 L16,2', 'M12,8 C8,8 5,12 5,17 C5,21 8,23 12,23 C16,23 19,21 19,17 C19,12 16,8 12,8 Z']
      break
    case 'merge':
      cmds = ['M4,8 L12,8 L12,4 L20,10 L12,16 L12,12 L4,12 Z']
      break
    case 'combo':
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
        case 'A': ctx.lineTo(cx + (nums[5]-12)*u, cy + (nums[6]-12)*u); break
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
  if (newValue === 10 && !ach.first_rainbow) {
    unlockAchievement('first_rainbow', ach)
  }
  if (newValue === 11 && !ach.first_white) {
    unlockAchievement('first_white', ach)
  }
  if (newValue === 12 && !ach.first_obsidian) {
    unlockAchievement('first_obsidian', ach)
  }
}

// Check score-based achievements (endGame)
function checkScoreAchievements(totalScore) {
  var ach = S.getAchievements()
  // Million hidden achievement (single game score)
  if (totalScore >= 1000000 && !ach.million) {
    unlockAchievement('million', ach)
  }
  // Cumulative score tiers (no upper limit)
  var cum = S.getCumStats()
  var cumScore = cum.totalScore || 0
  var lastTier = cum.scoreTier || 0
  var newTier = Math.floor(cumScore / 100000)
  while (newTier > lastTier) {
    lastTier++
    giveTierReward('cum_score', lastTier)
  }
  cum.scoreTier = lastTier
  S.saveCumStats(cum)
}

// Check merge count achievements
function checkMergeCountAchievements(totalMerges) {
  var cum = S.getCumStats()
  var lastTier = cum.mergeTier || 0
  var newTier = Math.floor(totalMerges / 1000)
  while (newTier > lastTier) {
    lastTier++
    giveTierReward('cum_merge', lastTier)
  }
  cum.mergeTier = lastTier
  S.saveCumStats(cum)
}

// Check combo achievements (cumulative across all games)
function checkComboAchievements(combo) {
  // Track cumulative combos in cumStats
  var cum = S.getCumStats()
  cum.totalCombos = (cum.totalCombos || 0) + 1
  var lastTier = cum.comboTier || 0
  var newTier = Math.floor(cum.totalCombos / 100)
  while (newTier > lastTier) {
    lastTier++
    giveTierReward('cum_combo', lastTier)
  }
  cum.comboTier = lastTier
  S.saveCumStats(cum)
}

// Give repeatable tier reward
function giveTierReward(achId, tier) {
  var def = ACHIEVEMENTS.find(function(a) { return a.id === achId })
  if (!def || !def.reward) return
  var rw = def.reward
  if (rw.hammer) S.addItem('hammer', rw.hammer)
  if (rw.swap) S.addItem('swap', rw.swap)
  if (rw.lightning) S.addItem('lightning', rw.lightning)
  var parts = []
  if (rw.hammer) parts.push('\uD83D\uDD28\u00D7' + rw.hammer)
  if (rw.swap) parts.push('\uD83D\uDD04\u00D7' + rw.swap)
  if (rw.lightning) parts.push('\u26A1\u00D7' + rw.lightning)
  addToast('\uD83C\uDFC6 ' + def.name + ' Lv.' + tier + '\uFF01\n\uD83C\uDF81 ' + parts.join(' '), '\u2B50')
}

// Unlock a single achievement (theme rewards)
function unlockAchievement(id, ach) {
  var def = ACHIEVEMENTS.find(function(a) { return a.id === id })
  if (!def) return
  ach[id] = true
  S.saveAchievements(ach)

  var rw = def.reward
  if (rw.type === 'theme') {
    if (S.unlockTheme(rw.id)) {
      var thDef = THEMES.find(function(t) { return t.id === rw.id })
      addToast('\uD83C\uDFC6 \u6210\u5C31\u89E3\u9396\uFF1A' + def.revealName + '\uFF01\n\uD83C\uDFA8 \u4E3B\u984C\uFF1A' + (thDef ? thDef.name : rw.id), '\u2B50')
    }
  }
}

// Check daily streak theme unlocks
function checkDailyStreakThemes() {
  var streak = S.getDailyStreak()
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
