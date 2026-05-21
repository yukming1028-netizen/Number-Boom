// ===== ACHIEVEMENTS =====
const ACHIEVEMENTS = [
  // === 主題解鎖成就 ===
  { id: 'first_rainbow', name: '\u4EBA\u751F\u662F\u5F69\u8272\u7684', desc: '\u9996\u6B21\u5408\u6210\u5F69\u8679\u65B9\u584A', icon: 'star', reward: { type: 'theme', id: 'rainbow' } },
  { id: 'first_white', name: '???', desc: '???', icon: 'question', hidden: true, reward: { type: 'theme', id: 'white' }, revealName: '\u7D14\u767D', revealDesc: '\u9996\u6B21\u5408\u6210\u7D14\u767D\u65B9\u584A' },
  { id: 'first_obsidian', name: '???', desc: '???', icon: 'question', hidden: true, reward: { type: 'theme', id: 'obsidian' }, revealName: '\u865B\u7121', revealDesc: '\u9996\u6B21\u5408\u6210\u865B\u7121\u65B9\u584A' },
  { id: 'million', name: '???', desc: '???', icon: 'question', hidden: true, reward: { type: 'theme', id: 'infinity' }, revealName: '\u4E0D\u53EF\u80FD\u7684\u4E8B', revealDesc: '\u7121\u76E1\u6A21\u5F0F\u9054\u5230100\u842C\u5206' },

  // === 累積成就（無上限，每達成一個階梯就獎勵）===
  { id: 'cum_score', name: '\u5206\u6578\u5927\u5E2B', desc: '\u6BCF\u7D2F\u7A4D10\u842C\u5206', icon: 'medal', repeatable: true, step: 100000, reward: { hammer: 1 } },
  { id: 'cum_merge', name: '\u5408\u6210\u9054\u4EBA', desc: '\u6BCF\u7D2F\u7A4D1000\u6B21\u5408\u6210', icon: 'merge', repeatable: true, step: 1000, reward: { swap: 1 } },
  { id: 'cum_combo', name: '\u9023\u64CA\u4E4B\u795E', desc: '\u6BCF\u7D2F\u7A4D100\u6B21\u9023\u64CA', icon: 'combo', repeatable: true, step: 100, reward: { lightning: 1 } },

  // === 每日挑戰完成獎勵（可重複）===
  { id: 'cum_daily', name: '\u6BCF\u65E5\u9054\u4EBA', desc: '\u6BCF\u5B8C\u6210\u4E00\u6B21\u6BCF\u65E5\u6311\u6230', icon: 'calendar', repeatable: true, step: 1, reward: { hammer: 1, swap: 1, lightning: 1 } },

  // === 每日完成次數解鎖主題成就 ===
  { id: 'daily_ocean', name: '\u6D77\u6D0B\u4E4B\u5FC3', desc: '\u5B8C\u62105\u6B21\u6BCF\u65E5\u6311\u6230', icon: 'medal', reward: { type: 'theme', id: 'ocean' } },
  { id: 'daily_cyber', name: '\u8CFD\u535A\u5D1B\u8D77', desc: '\u5B8C\u621010\u6B21\u6BCF\u65E5\u6311\u6230', icon: 'medal', reward: { type: 'theme', id: 'cyber' } },
  { id: 'daily_sunset', name: '\u65E5\u843D\u9918\u8F5D', desc: '\u5B8C\u621015\u6B21\u6BCF\u65E5\u6311\u6230', icon: 'medal', reward: { type: 'theme', id: 'sunset' } },
  { id: 'daily_forest', name: '\u68EE\u6797\u79D8\u5883', desc: '\u5B8C\u621020\u6B21\u6BCF\u65E5\u6311\u6230', icon: 'medal', reward: { type: 'theme', id: 'forest' } },
  { id: 'daily_kawaii', name: '\u53EF\u611B\u842C\u6B72', desc: '\u5B8C\u621025\u6B21\u6BCF\u65E5\u6311\u6230', icon: 'medal', reward: { type: 'theme', id: 'kawaii' } },
  { id: 'daily_ink', name: '\u6C34\u58A8\u5C71\u6C34', desc: '\u5B8C\u621030\u6B21\u6BCF\u65E5\u6311\u6230', icon: 'medal', reward: { type: 'theme', id: 'ink' } },
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
    case 'calendar':
      cmds = ['M5,4 L5,2', 'M19,4 L19,2', 'M3,6 L21,6 L21,22 L3,22 Z', 'M8,11 L16,11', 'M8,15 L14,15']
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

// Give repeatable tier reward — mark as pending, player must claim in achievements page
function giveTierReward(achId, tier) {
  var def = ACHIEVEMENTS.find(function(a) { return a.id === achId })
  if (!def || !def.reward) return
  // Store pending reward
  var pending = S._g('pendingRewards') || []
  pending.push({ achId: achId, tier: tier, ts: Date.now() })
  S._s('pendingRewards', pending)
  var parts = []
  if (def.reward.hammer) parts.push('\uD83D\uDD28\u00D7' + def.reward.hammer)
  if (def.reward.swap) parts.push('\uD83D\uDD04\u00D7' + def.reward.swap)
  if (def.reward.lightning) parts.push('\u26A1\u00D7' + def.reward.lightning)
  addToast('\uD83C\uDFC6 ' + def.name + ' Lv.' + tier + '\uFF01', '\u2B50')
}

// Claim a pending reward
function claimReward(index) {
  var pending = S._g('pendingRewards') || []
  if (index < 0 || index >= pending.length) return
  var pr = pending[index]
  var def = ACHIEVEMENTS.find(function(a) { return a.id === pr.achId })
  if (!def || !def.reward) return
  var rw = def.reward
  // Theme reward: unlock theme + add to unseen
  if (rw.type === 'theme' || pr.themeId) {
    var themeId = rw.id || pr.themeId
    S.unlockTheme(themeId)
    S.addUnseenTheme(themeId)
    var thDef = THEMES.find(function(t) { return t.id === themeId })
    addToast('\uD83C\uDF81 \u5DF2\u9818\u53D6\uFF1A' + (thDef ? thDef.name : themeId), '\u2705')
  } else {
    // Item rewards
    if (rw.hammer) S.addItem('hammer', rw.hammer)
    if (rw.swap) S.addItem('swap', rw.swap)
    if (rw.lightning) S.addItem('lightning', rw.lightning)
    var parts = []
    if (rw.hammer) parts.push('\uD83D\uDD28\u00D7' + rw.hammer)
    if (rw.swap) parts.push('\uD83D\uDD04\u00D7' + rw.swap)
    if (rw.lightning) parts.push('\u26A1\u00D7' + rw.lightning)
    addToast('\uD83C\uDF81 \u5DF2\u9818\u53D6: ' + parts.join(' '), '\u2705')
  }
  pending.splice(index, 1)
  S._s('pendingRewards', pending)
}

// Check daily completion achievement
function checkDailyAchievement() {
  var cum = S.getCumStats()
  cum.dailyCompleted = (cum.dailyCompleted || 0) + 1
  var lastTier = cum.dailyTier || 0
  var newTier = Math.floor(cum.dailyCompleted / 1)
  while (newTier > lastTier) {
    lastTier++
    giveTierReward('cum_daily', lastTier)
  }
  cum.dailyTier = lastTier
  S.saveCumStats(cum)

  // Increment global daily completed count for theme unlocks
  var totalCount = S.addDailyCompleted()

  // Check daily count theme achievements
  var ach = S.getAchievements()
  var dailyAchievements = [
    { id: 'daily_ocean', count: 5 },
    { id: 'daily_cyber', count: 10 },
    { id: 'daily_sunset', count: 15 },
    { id: 'daily_forest', count: 20 },
    { id: 'daily_kawaii', count: 25 },
    { id: 'daily_ink', count: 30 },
  ]
  for (var i = 0; i < dailyAchievements.length; i++) {
    var da = dailyAchievements[i]
    if (totalCount >= da.count && !ach[da.id]) {
      unlockAchievement(da.id, ach)
    }
  }
}

// Unlock a single achievement (theme rewards → pending)
function unlockAchievement(id, ach) {
  var def = ACHIEVEMENTS.find(function(a) { return a.id === id })
  if (!def) return
  ach[id] = true
  S.saveAchievements(ach)

  var rw = def.reward
  if (rw.type === 'theme') {
    // Add to pending rewards — player must claim in achievements page
    var pending = S._g('pendingRewards') || []
    pending.push({ achId: id, ts: Date.now(), themeId: rw.id })
    S._s('pendingRewards', pending)
    var dispName = def.hidden ? def.revealName : def.name
    addToast('\uD83C\uDFC6 \u6210\u5C31\u9054\u6210\uFF1A' + dispName + '\uFF01', '\u2B50')
  }
}

// Check daily completion count theme unlocks
function checkDailyCountThemes() {
  var count = S.getDailyCompleted()
  var milestoneThemes = [
    { count: 5, themeId: 'ocean' },
    { count: 10, themeId: 'cyber' },
    { count: 15, themeId: 'sunset' },
    { count: 20, themeId: 'forest' },
    { count: 25, themeId: 'kawaii' },
    { count: 30, themeId: 'ink' },
  ]
  for (var i = 0; i < milestoneThemes.length; i++) {
    var ms = milestoneThemes[i]
    if (count >= ms.count) {
      if (S.unlockTheme(ms.themeId)) {
        var thDef = THEMES.find(function(t) { return t.id === ms.themeId })
        addToast('\uD83C\uDFC6 \u5B8C\u6210' + ms.count + '\u6B21\u6BCF\u65E5\uFF01\u89E3\u9396\uFF1A' + (thDef ? thDef.name : ms.themeId), '\uD83C\uDF89')
        S.addUnseenTheme(ms.themeId)
      }
    }
  }
}
