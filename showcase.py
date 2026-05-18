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

        # Row 7: Lv1-5
        # Row 6: Lv6-10
        # Row 5: Lv8,8,9,9,10 (special glow tiles)
        await page.evaluate('''() => {
            grid.cells[7][0] = 1; grid.cells[7][1] = 2; grid.cells[7][2] = 3; grid.cells[7][3] = 4; grid.cells[7][4] = 5
            grid.cells[6][0] = 6; grid.cells[6][1] = 7; grid.cells[6][2] = 8; grid.cells[6][3] = 9; grid.cells[6][4] = 10
            grid.cells[5][0] = 8; grid.cells[5][1] = 9; grid.cells[5][2] = 10; grid.cells[5][3] = 10; grid.cells[5][4] = 10
        }''')
        await page.wait_for_timeout(300)
        await page.screenshot(path='/home/ri/projects/number-boom/play/showcase.png')
        print('📸 showcase.png')

        await browser.close()

asyncio.run(main())
