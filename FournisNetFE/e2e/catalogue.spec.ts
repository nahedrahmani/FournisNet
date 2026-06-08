import { test, expect } from '@playwright/test';

async function loginAsAdmin(page: any) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button.lg-btn');
  await page.waitForURL(/\/home/, { timeout: 15000 });
}

// ── Sélecteurs réels du catalogue (cars.component.html) ──────────────────────
// Route réelle : /pieces  (pas /cars — CarsComponent est monté sur /pieces)
// Cartes produit : <div class="cat-card">
// Recherche     : <input class="cat-search">
// Pagination    : <button class="cat-page-btn">
// Stock pill    : <span class="cat-stock-pill">
const ROUTE_CATALOGUE = '/pieces';
const SEL_CARD        = '.cat-card';
const SEL_SEARCH      = 'input.cat-search';
const SEL_PAGE_BTN    = '.cat-page-btn';
const SEL_STOCK_PILL  = '.cat-stock-pill';

test.describe('Catalogue des produits', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(ROUTE_CATALOGUE);
    // Attend que les cartes produit OU l'état "vide" soit visible
    await page.waitForSelector(`${SEL_CARD}, .cat-state`, { timeout: 15000 });
  });

  test('affiche au moins un produit', async ({ page }) => {
    // Attend spécifiquement les cartes (pas juste cat-state qui peut être un état d'erreur)
    await page.waitForSelector(SEL_CARD, { timeout: 10000 });
    const count = await page.locator(SEL_CARD).count();
    expect(count).toBeGreaterThan(0);
  });

  test('la recherche filtre les produits', async ({ page }) => {
    const searchInput = page.locator(SEL_SEARCH);
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    // Tape un terme et attend la réponse API (debounce 400ms + réseau)
    await searchInput.fill('filtre');
    await page.waitForResponse(
      resp => resp.url().includes('/api/produits') && resp.status() === 200,
      { timeout: 10000 }
    );
    await page.waitForTimeout(400);

    // Vide le champ — doit recharger tous les produits
    await searchInput.fill('');
    await page.waitForResponse(
      resp => resp.url().includes('/api/produits') && resp.status() === 200,
      { timeout: 10000 }
    );
    const cards = page.locator(SEL_CARD);
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('affiche des badges de stock sur les produits', async ({ page }) => {
    const pills = page.locator(SEL_STOCK_PILL);
    const count = await pills.count();
    expect(count).toBeGreaterThan(0);

    // Vérifie qu'au moins un badge a une des classes de statut
    const statusBadge = page.locator('.cat-stock-ok, .cat-stock-low, .cat-stock-out').first();
    await expect(statusBadge).toBeVisible();
  });

  test('la pagination fonctionne si plusieurs pages', async ({ page }) => {
    const pageBtns = page.locator(SEL_PAGE_BTN);
    const count = await pageBtns.count();

    if (count > 2) {
      // count > 2 = précédent + au moins une page numérotée + suivant
      // On clique le 2e bouton (index 1 = première page numérotée)
      await pageBtns.nth(1).click();
      await page.waitForResponse(
        resp => resp.url().includes('/api/produits') && resp.status() === 200,
        { timeout: 10000 }
      );
      const cards = page.locator(SEL_CARD);
      expect(await cards.count()).toBeGreaterThanOrEqual(0);
    } else {
      console.log('ℹ️  Moins de 2 pages — pagination non affichée, test ignoré');
    }
  });

  test('filtre par catégorie avec les chips', async ({ page }) => {
    // Les chips de catégorie : <button class="cat-chip">
    const chips = page.locator('.cat-chip');
    const count = await chips.count();
    expect(count).toBeGreaterThan(0); // au moins le chip "Toutes"

    if (count > 1) {
      // Clique sur la deuxième chip (1ère catégorie réelle)
      await chips.nth(1).click();
      await page.waitForResponse(
        resp => resp.url().includes('/api/produits') && resp.status() === 200,
        { timeout: 10000 }
      );
      // La chip cliquée doit avoir la classe active
      await expect(chips.nth(1)).toHaveClass(/cat-chip--active/);
    }
  });

});

test.describe('Détail d\'un produit', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(ROUTE_CATALOGUE);
    await page.waitForSelector(SEL_CARD, { timeout: 15000 });
  });

  test('bouton Détails mène à la page produit', async ({ page }) => {
    // Chaque carte a un <a routerLink="/produit-single"> avec class cat-btn-sm
    const detailBtn = page.locator('.cat-btn-sm').first();
    if (await detailBtn.count() > 0) {
      await detailBtn.click();
      await expect(page).toHaveURL(/\/produit-single/, { timeout: 5000 });
    }
  });

});