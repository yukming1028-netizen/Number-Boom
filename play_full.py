import asyncio
from playwright.async_api import async_playwright
import os, random

OUT = '/home/ri/projects/number-boom/play'
os.makedirs(OUT, exist_ok=True)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': 393, 'height': 852}, device_scale_factor=2)
        await page.goto('http://localhost:8080/index.html')
        await page.wait_for_timeout(500)
        
        # Start game
        await page.evaluate("startGame('classic')")
        await page.wait_for_timeout(300)
        
        move = 0
        screenshots = []
        
        while True:
            # Pick a random valid column (not full)
            col = random.randint(0, 4)
            state = await page.evaluate(f'''() => {{
                doDrop({col})
                return {{
                    state: state,
                    score: score,
                    maxTile: grid.getMaxValue(),
                    moves: moves,
                    combo: maxCombo,
                    grid: grid.cells
                }}
            }}''')
            move += 1
            await page.wait_for_timeout(80)
            
            # Screenshot at key moments
            if move in [1, 5, 15, 30, 50, 70, 90]:
                fname = f'{OUT}/step{move:03d}.png'
                await page.screenshot(path=fname)
                screenshots.append(fname)
                colors = ['', '🔴', '🟠', '🟡', '🟢', '🔵', '💎', '🔮', '⭐', '💠', '👑']
                maxc = colors[state['maxTile']] if state['maxTile'] < len(colors) else '❓'
                print(f'Move {move}: Score={state["score"]} Max={maxc} Combo={state["combo"]}')
                
                # Print grid
                for r in range(8):
                    row = ''
                    for c in range(5):
                        v = state['grid'][r][c]
                        if v == 0:
                            row += '· '
                        else:
                            row += (colors[v] if v < len(colors) else '❓') + ' '
                    print(f'  {row}')
                print()
            
            if state.get('state') != 'playing':
                await page.wait_for_timeout(300)
                fname = f'{OUT}/gameover.png'
                await page.screenshot(path=fname)
                screenshots.append(fname)
                colors = ['', '🔴', '🟠', '🟡', '🟢', '🔵', '💎', '🔮', '⭐', '💠', '👑']
                maxc = colors[state['maxTile']] if state['maxTile'] < len(colors) else '❓'
                print(f'💀 Game Over at Move {move}!')
                print(f'   Score={state["score"]} Max={maxc}(Lv{state["maxTile"]}) Combo={state["combo"]}')
                
                # Final grid
                print('\n最終棋盤:')
                for r in range(8):
                    row = ''
                    for c in range(5):
                        v = state['grid'][r][c]
                        if v == 0:
                            row += '· '
                        else:
                            row += (colors[v] if v < len(colors) else '❓') + ' '
                    print(f'  {row}')
                break
            
            if move > 200:
                print('太久了，手動結束')
                break
        
        await browser.close()
        print(f'\n📸 共 {len(screenshots)} 張截圖')

asyncio.run(main())
