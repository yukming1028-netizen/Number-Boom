// ===== MAIN LOOP =====
function drawAll() {
  const t = getTheme()
  ctx.clearRect(0, 0, W, H)

  if (state === 'menu') drawMenu(t)
  else if (state === 'playing' || state === 'item_select') drawGameScreen(t)
  else if (state === 'gameover') drawGameOver(t)
  else if (state === 'leaderboard') drawLeaderboard(t)
  else if (state === 'themes') drawThemes(t)
  else if (state === 'achievements') drawAchievements(t)
  else if (state === 'auto_summary') drawAutoSummary(t)

  particles.update()
  particles.draw(ctx)
  // Fever timer countdown
  if (feverActive && state === 'playing') {
    feverTimer -= 16.67  // ~60fps
    if (feverTimer <= 0) {
      feverActive = false; feverTimer = 0; feverGauge = 0
      addToast('\uD83D\uDD25 Fever \u7D50\u675F', '\u274C')
    }
  }
  drawSettingsPanel(t)
  drawExitConfirm(t)
  drawToasts(t)
  if (autoPlaying && frameCount % 1 === 0) autoStep()
  frameCount++
  requestAnimationFrame(drawAll)
}
drawAll()
