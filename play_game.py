import asyncio
from playwright.async_api import async_playwright
import os

OUT = '/home/ri/projects/number-boom/play'
os.makedirs(OUT, exist_ok=True)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': 393, 'height': 852}, device_scale_factor=2)
        await page.goto('http://localhost:8080/index.html')
        await page.wait_for_timeout(500)
        
        # 1. Menu
        await page.screenshot(path=f'{OUT}/01_menu.png')
        print('📸 01_menu.png — 主菜單')
        
        # 2. Start classic game
        await page.evaluate("startGame('classic')")
        await page.wait_for_timeout(300)
        await page.screenshot(path=f'{OUT}/02_start.png')
        print('📸 02_start.png — 遊戲開始')
        
        # 3-12. Play turns, screenshot every 2 drops
        turns = [2,1,3,2,0,4,1,3,2,0,4,1,2,3,0,2,4,1,3,2,0,1,4,3,2,1,0,4,3,2]
        
        for i, col in enumerate(turns):
            state = await page.evaluate(f'''() => {{
                doDrop({col})
                return {{
                    state: state,
                    score: score,
                    maxTile: grid.getMaxValue(),
                    moves: moves,
                    combo: maxCombo
                }}
            }}''')
            await page.wait_for_timeout(150)
            
            if (i + 1) % 5 == 0 or state.get('state') != 'playing':
                step = f'{i+1:02d}'
                await page.screenshot(path=f'{OUT}/{step}_turn{i+1}.png')
                status = '遊戲結束' if state['state'] != 'playing' else f'Score={state["score"]} Max={state["maxTile"]} Moves={state["moves"]}'
                print(f'📸 {step}_turn{i+1}.png — {status}')
                
                if state.get('state') != 'playing':
                    # Game over screenshot
                    await page.wait_for_timeout(300)
                    await page.screenshot(path=f'{OUT}/gameover.png')
                    print(f'📸 gameover.png — 遊戲結束 Score={state["score"]}')
                    break
        else:
            # Force end game if still playing
            await page.wait_for_timeout(300)
            await page.screenshot(path=f'{OUT}/final.png')
            
            # Get final stats
            stats = await page.evaluate('''() => ({
                score: score,
                maxTile: grid.getMaxValue(),
                moves: moves,
                maxCombo: maxCombo,
                state: state,
                grid: grid.cells
            })''')
            print(f'📸 final.png — Final: Score={stats["score"]} Max={stats["maxTile"]} Moves={stats["moves"]} Combo={stats["maxCombo"]}')
            
            # Print grid state
            print('\n棋盤最終狀態:')
            colors = ['', '🔴', '🟠', '🟡', '🟢', '🔵', '💎', '🔮', '⭐', '💠', '👑']
            for r in range(8):
                row = ''
                for c in range(5):
                    v = stats['grid'][r][c]
                    row += (colors[v] if v < len(colors) else '❓') + ' '
                print(f'  {row}')
        
        await browser.close()

asyncio.run(main())
