import asyncio
from playwright.async_api import async_playwright

SCREENS = [
    ('iPhone 15 Pro', 393, 852),
    ('iPhone SE', 375, 667),
    ('Pixel 7', 412, 915),
    ('Small', 320, 568),
]

async def check(name, w, h):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': w, 'height': h}, device_scale_factor=2)
        await page.goto('http://localhost:8080/index.html')
        await page.wait_for_timeout(300)
        await page.evaluate("startGame('classic')")
        await page.wait_for_timeout(200)
        
        info = await page.evaluate('''() => {
            const ibY = boardTop + boardH + 5
            const ibH = Math.min(42, itemBarH - 6)
            const bbY = ibY + ibH + 4
            const totalBottom = bbY + backBtnH + bottomPad
            return {
                cellSize: cellSize,
                boardH: boardH,
                fits: totalBottom <= H,
                gap: H - totalBottom,
            }
        }''')
        fits = '✅' if info['fits'] else '❌'
        print(f'{name} ({w}×{h}): cell={info["cellSize"]}px, board={info["boardH"]}px, {fits} gap={info["gap"]}px')
        
        await browser.close()

async def main():
    for name, w, h in SCREENS:
        await check(name, w, h)

asyncio.run(main())
