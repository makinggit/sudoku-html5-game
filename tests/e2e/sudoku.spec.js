import { test, expect } from '@playwright/test';

test('sudoku board renders and accepts input', async ({ page }) => {
	await page.goto('/');

	const cells = page.locator('#board .cell');
	await expect(cells).toHaveCount(81);

	const firstEmptyCell = page.locator('#board .cell:not(.given)').first();
	await firstEmptyCell.click();
	await page.keyboard.press('5');

	await expect(firstEmptyCell).toHaveText('5');
});

test('gold details popup opens from the gold bar', async ({ page }) => {
	await page.goto('/');

	await page.locator('#gold-bar').click();

	const modal = page.locator('#gold-modal');
	await expect(modal).toHaveClass(/open/);
	await expect(page.locator('#gold-title')).toBeVisible();
});

test('check button highlights incorrect entries only after manual check', async ({ page }) => {
	await page.goto('/');

	const firstEmptyCell = page.locator('#board .cell:not(.given)').first();
	await firstEmptyCell.click();
	await page.keyboard.press('1');

	await page.locator('#check').click();

	await expect(page.locator('#message')).toContainText(/目前沒有錯誤|個錯誤格子/);
});
