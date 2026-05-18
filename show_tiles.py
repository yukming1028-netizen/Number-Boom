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
        
        # Inject all 10 tile levels into the grid
        await page.evaluate('''() => {
            grid.cells[7][0] = 1  // 🔴 紅
            grid.cells[7][1] = 2  // 🟠 橙
            grid.cells[7][2] = 3  // 🟡 黃
            grid.cells[7][3] = 4  // 🟢 綠
            grid.cells[7][4] = 5  // 🔵 青
            
            grid.cells[6][0] = 6  // 💎 藍
            grid.cells[6][1] = 7  // 🔮 紫
            grid.cells[6][2] = 8  // ⭐ 金
            grid.cells[6][3] = 9  // 💠 鑽
            grid.cells[6][4] = 10 // 👑 虹
            
            // Add second row of same for comparison
            grid.cells[5][0] = 1
            grid.cells[5][1] = 2
            grid.cells[5][2] = 3
            grid.cells[5][3] = 4
            grid.cells[5][4] = 5
        }''')
        await page.wait_for_timeout(300)
        await page.screenshot(path='/home/ri/projects/number-boom/play/all_tiles.png')
        print('📸 all_tiles.png — 全部 10 種方塊')
        
        await browser.close()

asyncio.run(main())
