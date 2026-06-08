import { test, expect } from '@playwright/test';

async function loginAsAdmin(page: any) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button.lg-btn');
  await page.waitForURL(/\/home/, { timeout: 15000 });
}

// ── Sélecteurs réels du sélecteur de langue (app.component.html) ─────────────
// Le sélecteur de langue est un dropdown Bootstrap :
//   Toggle  : <a class="fn-lang-toggle dropdown-toggle">
//   Items   : <button class="dropdown-item fn-dropdown-item"> 🇫🇷 Français </button>
//
// IMPORTANT : les boutons sont hidden tant que le dropdown n'est pas ouvert.
// Il faut d'abord cliquer le toggle, puis cliquer le bouton de langue.

const SEL_LANG_TOGGLE = 'a.fn-lang-toggle';

async function openLangDropdown(page: any) {
  const toggle = page.locator(SEL_LANG_TOGGLE);
  await toggle.click();
  // Attend que le dropdown soit ouvert (Bootstrap ajoute la classe "show")
  await page.waitForSelector('.fn-lang-toggle[aria-expanded="true"], .dropdown-menu.show', { timeout: 3000 }).catch(() => {
    // Certains environnements Bootstrap ne mettent pas aria-expanded — on attend juste un peu
  });
  await page.waitForTimeout(200);
}

test.describe('Changement de langue (i18n)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    // Attend que la navbar soit chargée (le toggle de langue en fait partie)
    await page.waitForSelector(SEL_LANG_TOGGLE, { timeout: 10000 });
  });

  test('le toggle de langue est visible dans la navbar', async ({ page }) => {
    const toggle = page.locator(SEL_LANG_TOGGLE);
    await expect(toggle).toBeVisible();
    // Le toggle affiche la langue courante (ex: "FR")
    await expect(toggle).toContainText(/FR|EN|AR/i);
  });

  test('le dropdown de langue s\'ouvre et affiche les options', async ({ page }) => {
    await openLangDropdown(page);

    // Après ouverture, les boutons doivent être visibles
    const frBtn = page.locator('button.fn-dropdown-item').filter({ hasText: /Français|FR/i }).first();
    const enBtn = page.locator('button.fn-dropdown-item').filter({ hasText: /English|EN/i }).first();
    const arBtn = page.locator('button.fn-dropdown-item').filter({ hasText: /عربي|AR/i }).first();

    await expect(frBtn).toBeVisible({ timeout: 3000 });
    await expect(enBtn).toBeVisible({ timeout: 3000 });
    await expect(arBtn).toBeVisible({ timeout: 3000 });
  });

  test('passe en anglais et le toggle affiche EN', async ({ page }) => {
    await openLangDropdown(page);

    const enBtn = page.locator('button.fn-dropdown-item').filter({ hasText: /English|EN/i }).first();
    await enBtn.click();
    await page.waitForTimeout(800);

    // Le toggle doit maintenant afficher "EN"
    const toggle = page.locator(SEL_LANG_TOGGLE);
    await expect(toggle).toContainText('EN');
  });

  test('l\'arabe active la direction RTL sur <html>', async ({ page }) => {
    await openLangDropdown(page);

    const arBtn = page.locator('button.fn-dropdown-item').filter({ hasText: /عربي|AR/i }).first();
    await arBtn.click();
    await page.waitForTimeout(800);

    // Notre LanguageService fait : document.documentElement.dir = 'rtl'
    const dir = await page.getAttribute('html', 'dir');
    expect(dir).toBe('rtl');
  });

  test('revient en LTR après avoir choisi le français', async ({ page }) => {
    // 1. Passe en arabe
    await openLangDropdown(page);
    await page.locator('button.fn-dropdown-item').filter({ hasText: /عربي|AR/i }).first().click();
    await page.waitForTimeout(500);

    // 2. Repasse en français
    await openLangDropdown(page);
    await page.locator('button.fn-dropdown-item').filter({ hasText: /Français|FR/i }).first().click();
    await page.waitForTimeout(500);

    const dir = await page.getAttribute('html', 'dir');
    // 'ltr', '' ou null = direction normale (gauche à droite)
    expect(dir === 'ltr' || dir === null || dir === '').toBe(true);
  });

});
