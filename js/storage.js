// ===== DAILY CHALLENGES (tiles cumulative + score) =====
const TILE_LABELS = {4:'綠',5:'青',6:'藍',7:'紫',8:'金',9:'鑽',10:'虹'}

const DAILY_CHALLENGES = [
  // --- 合成方塊（累積進度，跨場次）---
  {type:'tiles',desc:'合成綠色方塊×2',goals:[{value:4,target:2}],cols:3,rows:3},
  {type:'tiles',desc:'合成青×11 藍×4',goals:[{value:5,target:11},{value:6,target:4}],cols:4,rows:4},
  {type:'tiles',desc:'合成紫×11 金×4 鑽×2 虹×1',goals:[{value:7,target:11},{value:8,target:4},{value:9,target:2},{value:10,target:1}],cols:5,rows:5},
  // --- 分數達成 (score) 5×5 ---
  {type:'score',desc:'達到30000分',target:30000,cols:5,rows:5},
  {type:'score',desc:'達到40000分',target:40000,cols:5,rows:5},
  {type:'score',desc:'達到50000分',target:50000,cols:5,rows:5},
  {type:'score',desc:'達到60000分',target:60000,cols:5,rows:5},
  {type:'score',desc:'達到70000分',target:70000,cols:5,rows:5},
  {type:'score',desc:'達到80000分',target:80000,cols:5,rows:5},
  {type:'score',desc:'達到90000分',target:90000,cols:5,rows:5},
  {type:'score',desc:'達到100000分',target:100000,cols:5,rows:5},
]

// ===== STORAGE =====
const S={
  _g(k){try{return JSON.parse(localStorage.getItem('nb2_'+k))}catch{return null}},
  _s(k,v){try{localStorage.setItem('nb2_'+k,JSON.stringify(v))}catch{}},
  // Items
  getItems(){return this._g('items')||{hammer:0,swap:0,lightning:0}},
  saveItems(i){this._s('items',i)},
  useItem(t){const i=this.getItems();if((i[t]||0)<=0)return false;i[t]--;this.saveItems(i);return true},
  addItem(t,n){const i=this.getItems();i[t]=(i[t]||0)+n;this.saveItems(i)},
  // Theme
  getTheme(){return this._g('theme')||'classic'},
  setTheme(t){this._s('theme',t)},
  getUnlockedThemes(){
    const saved=this._g('unlocked')
    if(saved&&saved.length===THEMES.length) return saved
    const all=THEMES.map(t=>t.id)
    this._s('unlocked',all)
    return all
  },
  unlockTheme(id){const u=this.getUnlockedThemes();if(u.includes(id))return false;u.push(id);this._s('unlocked',u);return true},
  // Best scores
  getBestEndless(){return this._g('best_endless')||0},
  setBestEndless(s){if(s>this.getBestEndless())this._s('best_endless',s)},
  // Stats
  getStats(){return this._g('stats')||{gamesPlayed:0,maxTile:0,maxCombo:0,totalRainbows:0}},
  saveStats(s){this._s('stats',s)},
  // Daily
  getDaily(){
    const today=new Date().toISOString().slice(0,10)
    const d=this._g('daily')
    if(!d||d.date!==today){
      const seed=today.split('-').reduce((a,b)=>a+parseInt(b),0)
      const challenges=DAILY_CHALLENGES
      const ch={date:today,challenge:challenges[seed%challenges.length],completed:false,synthCounts:{},attempts:3,adBonus:0}
      this._s('daily',ch);return ch
    }
    return d
  },
  getDailyAttempts(){const d=this.getDaily();return d.attempts!=null?d.attempts:3},
  setDailyAttempts(n){const d=this.getDaily();d.attempts=n;this._s('daily',d)},
  useDailyAttempt(){const d=this.getDaily();if((d.attempts||3)<=0)return false;d.attempts=(d.attempts||3)-1;this._s('daily',d);return true},
  addDailyAdBonus(){const d=this.getDaily();d.adBonus=(d.adBonus||0)+1;d.attempts=(d.attempts||0)+1;this._s('daily',d)},
  saveDaily(d){this._s('daily',d)},
  // Player name
  getName(){return this._g('playerName')||'\u73A9\u5BB6'},
  setName(n){if(n&&n.trim())this._s('playerName',n.trim())},
  // Leaderboard (local) — one record per mode per player
  getLB(){return this._g('lb')||[]},
  addLB(mode,score,extra){
    const lb=this.getLB()
    // Replace existing record for same mode (keep latest)
    const idx=lb.findIndex(e=>e.mode===mode)
    if(idx>=0) lb.splice(idx,1)
    lb.push({mode,score,...extra,name:this.getName(),ts:Date.now()})
    lb.sort((a,b)=>b.score-a.score)
    this._s('lb',lb.slice(0,20))
  },
  getDailyStreak(){
    const d=this._g('streak')||{count:0,lastDate:''}
    const today=new Date().toISOString().slice(0,10)
    if(d.lastDate===today) return d.count
    const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10)
    if(d.lastDate===yesterday) return d.count
    return 0
  },
  addDailyStreak(){
    const today=new Date().toISOString().slice(0,10)
    const d=this._g('streak')||{count:0,lastDate:''}
    const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10)
    if(d.lastDate===today) return d.count
    let count = d.lastDate===yesterday ? d.count+1 : 1
    this._s('streak',{count,lastDate:today})
    return count
  },
  // Volume & mute
  getBgmVolume(){return this._g('bgm')!=null?this._g('bgm'):0.5},
  setBgmVolume(v){this._s('bgm',v)},
  getSfxVolume(){return this._g('sfx')!=null?this._g('sfx'):0.7},
  setSfxVolume(v){this._s('sfx',v)},
  getMuted(){return this._g('muted')||false},
  setMuted(m){this._s('muted',m)},
  getBgmMuted(){return this._g('bgm_muted')||false},
  setBgmMuted(m){this._s('bgm_muted',m)},
  getSfxMuted(){return this._g('sfx_muted')||false},
  setSfxMuted(m){this._s('sfx_muted',m)},
  // Achievements
  getAchievements(){return this._g('ach')||{}},
  saveAchievements(a){this._s('ach',a)},
  // Cumulative stats for achievement tracking
  getCumStats(){return this._g('cumStats')||{totalScore:0,totalMerges:0}},
  saveCumStats(s){this._s('cumStats',s)},
  // Reset all progress
  resetAll(){
    var keys = Object.keys(localStorage).filter(k => k.startsWith('nb2_'))
    for (var i = 0; i < keys.length; i++) localStorage.removeItem(keys[i])
  },
  // Test: refresh daily challenge to a random different one
  refreshDaily(){
    const today=new Date().toISOString().slice(0,10)
    const challenges=DAILY_CHALLENGES
    const current=this._g('daily')
    const oldIdx=current?challenges.findIndex(c=>c.desc===(current.challenge||{}).desc):-1
    let idx
    do { idx=Math.floor(Math.random()*challenges.length) } while(idx===oldIdx&&challenges.length>1)
    const ch={date:today,challenge:challenges[idx],completed:false,synthCounts:{}}
    this._s('daily',ch);return ch
  },
}
