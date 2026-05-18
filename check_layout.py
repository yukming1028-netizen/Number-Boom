import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
        await page.goto('http://localhost:8080/index.html')
        await page.wait_for_timeout(300)
        
        # Start game and drop pieces
        await page.evaluate("startGame('classic')")
        await page.wait_for_timeout(300)
        await page.evaluate('doDrop(2); doDrop(1); doDrop(3); doDrop(2); doDrop(1); doDrop(0); doDrop(4); doDrop(2); doDrop(1)')
        await page.wait_for_timeout(500)
        
        # Get layout info
        info = await page.evaluate('''() => {
            const ibY = boardTop + boardH + 5
            const ibH = Math.min(42, itemBarH - 6)
            const bbY = ibY + ibH + 4
            const totalBottom = bbY + backBtnH + bottomPad
            return {
                W: W, H: H, 
                cellW: cellW, cellH: cellH, 
                boardH: boardH, boardTop: boardTop,
                headerH: headerH, previewH: previewH, itemBarH: itemBarH,
                boardBottom: boardTop + boardH,
                totalBottom: totalBottom,
                fits: totalBottom <= H,
                fitsBy: H - totalBottom,
                maxTile: grid.getMaxValue(),
                tileCount: TILE_COLORS ? TILE_COLORS.length : 0,
                cellSize: cellSize,
                cellW_from_width: cellW_from_width,
                cellH_from_height: cellH_from_height,
            }
        }''')
        for k, v in info.items():
            print(f'  {k}: {v}')
        
        await browser.close()

asyncio.run(main())
