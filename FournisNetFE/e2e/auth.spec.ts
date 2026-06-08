/**
 * TEST E2E — Authentification (Login / Logout)
 */

import { test, expect } from '@playwright/test';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
const WRONG_PASS = 'motdepassefaux';

// ── Sélecteurs adaptés au vrai HTML de login.component.html ─────────────────
// Le formulaire utilise :
//   <input class="lg-input" name="username" ...>
//   <input class="lg-input" name="password" type="password" ...>
//   <button class="btn lg-btn ..." (click)="submit()">  ← PAS type="submit" !
const SEL_USERNAME = 'input[name="username"]';
const SEL_PASSWORD = 'input[name="password"]';
const SEL_SUBMIT   = 'button.lg-btn';  // classe CSS réelle du bouton

// Helper : attend que l'appli Angular soit bootstrappée (le formulaire est visible)
// Angular prend ~1-2s pour monter le composant après navigation
async function waitForLoginForm(page: any) {
  // waitForSelector → attend que l'élément soit présent dans le DOM
  // timeout: 15000 → on donne 15s à Angular pour démarrer et rendre le formulaire
  await page.waitForSelector(SEL_USERNAME, { timeout: 15000 });
}

// ── Groupe : Login ──────────────────────────────────────────────────────────
test.describe('Page de Login', () => {

  test.beforeEach(async ({ page }) => {
    // waitUntil: 'domcontentloaded' → n'attend pas tous les assets (images, fonts...)
    //   juste que le HTML soit parsé. Plus rapide que 'load' ou 'networkidle'.
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    // Puis on attend explicitement que Angular ait rendu le formulaire
    await waitForLoginForm(page);
  });

  // ── TEST 1 : La page s'affiche correctement ──────────────────────────────
  test('affiche le formulaire de connexion', async ({ page }) => {
    // On a déjà attendu le formulaire dans beforeEach
    // toBeVisible() vérifie que l'élément est visible (pas caché, pas display:none)
    await expect(page.locator(SEL_USERNAME)).toBeVisible();
    await expect(page.locator(SEL_PASSWORD)).toBeVisible();
    await expect(page.locator(SEL_SUBMIT)).toBeVisible();
  });

  // ── TEST 2 : Login réussi ────────────────────────────────────────────────
  test('redirige vers le dashboard après login valide', async ({ page }) => {
    await page.fill(SEL_USERNAME, ADMIN_USER);
    await page.fill(SEL_PASSWORD, ADMIN_PASS);
    await page.click(SEL_SUBMIT);

    // Attend la redirection — timeout 15s pour laisser le temps à l'API de répondre
    await page.waitForURL(/\/(home|$)/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/(home|$)/);
  });

  // ── TEST 3 : Login raté ──────────────────────────────────────────────────
  test('affiche une erreur avec un mauvais mot de passe', async ({ page }) => {
    await page.fill(SEL_USERNAME, ADMIN_USER);
    await page.fill(SEL_PASSWORD, WRONG_PASS);
    await page.click(SEL_SUBMIT);

    // Attend le message d'erreur — Angular affiche *ngIf="error" dans un .alert
    // { timeout: 10000 } → override le timeout par défaut de 5s pour cette seule assertion
    await expect(
      page.locator('.alert-danger, [class*="alert"]')
    ).toBeVisible({ timeout: 10000 });
  });

  // ── TEST 4 : Champs vides ────────────────────────────────────────────────
  test('reste sur la page login si les champs sont vides', async ({ page }) => {
    // On clique sans rien remplir
    await page.click(SEL_SUBMIT);
    // Petit délai pour que la navigation éventuelle ait le temps de se faire
    await page.waitForTimeout(1500);
    // On vérifie qu'on est toujours sur /login
    await expect(page).toHaveURL(/\/login/);
  });

  // ── TEST 5 : Contenu de la page login ────────────────────────────────────
  test('affiche les comptes de démo', async ({ page }) => {
    // Dans login.component.html, il y a une section .lg-demo-info avec les comptes admin/user
    const demoSection = page.locator('.lg-demo-info');
    await expect(demoSection).toBeVisible();
    // Vérifie que "admin" apparaît dans cette section
    await expect(demoSection).toContainText('admin');
  });

});

// ── Groupe : Logout ──────────────────────────────────────────────────────────
test.describe('Navigation après login', () => {

  // beforeEach : se connecter complètement avant chaque test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await waitForLoginForm(page);
    await page.fill(SEL_USERNAME, ADMIN_USER);
    await page.fill(SEL_PASSWORD, ADMIN_PASS);
    await page.click(SEL_SUBMIT);
    await page.waitForURL(/\/(home|$)/, { timeout: 15000 });
  });

  test('le dashboard s\'affiche après connexion', async ({ page }) => {
    // Vérifie qu'on est bien sur la page d'accueil (pas redirigé vers login)
    await expect(page).not.toHaveURL(/\/login/);
    // La navbar doit être visible
    await expect(page.locator('nav, [class*="navbar"], [class*="nav"]').first()).toBeVisible();
  });

  test('peut naviguer vers le catalogue', async ({ page }) => {
    // Route réelle du catalogue : /pieces  (CarsComponent monté sur /pieces)
    const catalogueLink = page.locator('a[routerLink="/pieces"], a[href*="pieces"]').first();
    if (await catalogueLink.count() > 0) {
      await catalogueLink.click();
    } else {
      await page.goto('/pieces');
    }
    await page.waitForURL(/\/pieces/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/pieces/);
  });

});