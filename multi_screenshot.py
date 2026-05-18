import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        await page.goto('http://localhost:8080/index.html')
        await page.wait_for_timeout(500)
        
        # Screenshot 1: Menu
        await page.screenshot(path='/home/ri/projects/number-boom/ss_menu.png')
        print('Menu screenshot saved')
        
        # Start classic game
        await page.evaluate("startGame('classic')")
        await page.wait_for_timeout(500)
        await page.screenshot(path='/home/ri/projects/number-boom/ss_game.png')
        print('Game screenshot saved')
        
        # Drop some pieces
        await page.evaluate("doDrop(2); doDrop(1); doDrop(3); doDrop(2); doDrop(1)")
        await page.wait_for_timeout(500)
        await page.screenshot(path='/home/ri/projects/number-boom/ss_game2.png')
        print('Game2 screenshot saved')
        
        # Shop
        await page.evaluate("state='shop'")
        await page.wait_for_timeout(300)
        await page.screenshot(path='/home/ri/projects/number-boom/ss_shop.png')
        print('Shop screenshot saved')
        
        await browser.close()

asyncio.run(main())
