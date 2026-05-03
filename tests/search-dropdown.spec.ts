import { test, expect } from '@playwright/test';

test.describe('Search Dropdown Layout', () => {
  test('should show search results over the next section', async ({ page }) => {
    await page.goto('/es/');

    // Ensure the page is loaded and interactive
    const searchInput = page.getByPlaceholder('Buscá marca, modelo o tipo…');
    await expect(searchInput).toBeVisible();
    await searchInput.click(); // Focus it
    await searchInput.fill('Tesla');

    // Dropdown should appear
    const dropdown = page.locator('ul:has-text("Tesla")').first();
    await expect(dropdown).toBeVisible();

    // Check overlap with overview section
    const overviewSection = page.locator('#overview');
    await expect(overviewSection).toBeVisible();

    const dropdownBox = await dropdown.boundingBox();
    const overviewBox = await overviewSection.boundingBox();

    if (dropdownBox && overviewBox) {
      // The bottom of the dropdown should be below the top of the overview section
      // to prove it's overlapping visually and not clipped.
      expect(dropdownBox.y + dropdownBox.height).toBeGreaterThan(overviewBox.y);
    }
  });

  test('should not be clipped by hero section', async ({ page }) => {
    await page.goto('/es/');
    const searchInput = page.getByPlaceholder('Buscá marca, modelo o tipo…');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Tesla');

    const dropdown = page.locator('ul:has-text("Tesla")').first();
    await expect(dropdown).toBeVisible();

    // If it's not clipped, it should have a reasonable height
    const boundingBox = await dropdown.boundingBox();
    expect(boundingBox?.height).toBeGreaterThan(50);
  });
});
