import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': 393, 'height': 852}, device_scale_factor=2)
        await page.goto('http://localhost:8080/index.html')
        await page.wait_for_timeout(500)
        await page.evaluate("startGame('classic')")
        await page.wait_for_timeout(200)
        
        # Show all tiles with labels
        await page.evaluate('''() => {
            grid.cells[7][0] = 1; grid.cells[7][1] = 2; grid.cells[7][2] = 3; grid.cells[7][3] = 4; grid.cells[7][4] = 5
            grid.cells[6][0] = 6; grid.cells[6][1] = 7; grid.cells[6][2] = 8; grid.cells[6][3] = 9; grid.cells[6][4] = 10
            grid.cells[5][0] = 8; grid.cells[5][1] = 8; grid.cells[5][2] = 9; grid.cells[5][3] = 9; grid.cells[5][4] = 10
        }''')
        await page.wait_for_timeout(300)
        
        # Get TILE_COLORS info
        info = await page.evaluate('''() => {
            return TILE_COLORS.slice(1).map((c, i) => ({
                level: i+1,
                name: c.name,
                emoji: c.emoji,
                bg1: c.bg1,
                bg2: c.bg2,
                glow: c.glow || 'none'
            }))
        }''')
        
        print('=== 全部方塊樣式 ===\n')
        for t in info:
            glow_str = f' ✨光暈:{t["glow"]}' if t['glow'] != 'none' else ''
            print(f'  Lv{t["level"]} {t["emoji"]} {t["name"]}  漸變: {t["bg1"]} → {t["bg2"]}{glow_str}')
        
        await page.screenshot(path='/home/ri/projects/number-boom/play/all_tiles.png')
        print('\n📸 截圖已保存: play/all_tiles.png')
        
        # Also take individual tile screenshots by rendering just one big tile each
        for level in [1,2,3,4,5,6,7,8,9,10]:
            await page.evaluate(f'''() => {{
                // Clear grid, show single tile
                grid.reset()
                grid.cells[7][2] = {level}
            }}''')
            await page.wait_for_timeout(100)
            # We'll just use the combined screenshot
        
        await browser.close()

asyncio.run(main())
