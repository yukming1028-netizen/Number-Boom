import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        
        # Test on iPhone 15 Pro size
        page = await browser.new_page(viewport={'width': 393, 'height': 852}, device_scale_factor=2)
        await page.goto('http://localhost:8080/index.html')
        await page.wait_for_timeout(500)
        
        # Menu
        await page.screenshot(path='/home/ri/projects/number-boom/ss_menu.png')
        
        # Start and play
        await page.evaluate("startGame('classic')")
        await page.wait_for_timeout(300)
        await page.screenshot(path='/home/ri/projects/number-boom/ss_game.png')
        
        # Drop many pieces to get merges going
        for _ in range(3):
            for col in [2,1,3,0,4,2,1,3]:
                await page.evaluate(f'doDrop({col})')
                await page.wait_for_timeout(100)
        await page.wait_for_timeout(500)
        await page.screenshot(path='/home/ri/projects/number-boom/ss_game2.png')
        
        # Test on small screen too
        page2 = await browser.new_page(viewport={'width': 320, 'height': 568}, device_scale_factor=2)
        await page2.goto('http://localhost:8080/index.html')
        await page2.wait_for_timeout(500)
        await page2.evaluate("startGame('classic')")
        await page2.wait_for_timeout(300)
        for col in [2,1,3,2,1,4,0,3,2]:
            await page2.evaluate(f'doDrop({col})')
            await page2.wait_for_timeout(100)
        await page2.wait_for_timeout(500)
        await page2.screenshot(path='/home/ri/projects/number-boom/ss_small.png')
        
        # Shop
        await page.evaluate("state='shop'")
        await page.wait_for_timeout(300)
        await page.screenshot(path='/home/ri/projects/number-boom/ss_shop.png')
        
        print('All screenshots saved!')
        await browser.close()

asyncio.run(main())
