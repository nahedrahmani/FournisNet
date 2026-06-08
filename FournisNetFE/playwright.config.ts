/**
 * PLAYWRIGHT CONFIG — explication de chaque mot clé
 *
 * Ce fichier configure le "test runner" de Playwright.
 * Il est lu automatiquement quand tu lances `npx playwright test`.
 */

// defineConfig → fonction fournie par Playwright qui valide ta config et t'offre l'autocomplétion IDE
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // ── Où chercher les fichiers de tests ───────────────────────────────────────
  // testDir : répertoire racine des tests E2E (on les sépare des tests unitaires Angular)
  testDir: './e2e',

  // ── Comportement global ──────────────────────────────────────────────────────
  // fullyParallel : true → chaque test dans chaque fichier tourne en parallèle (plus rapide)
  //                false → tests séquentiels dans un fichier (plus facile à déboguer)
  fullyParallel: false,

  // forbidOnly : si un test est marqué test.only() (= debug local), le CI échoue.
  //   !! → opérateur "double négation" qui convertit la string en boolean
  //   process.env.CI → variable d'environnement injectée par GitHub Actions
  forbidOnly: !!process.env.CI,

  // retries : nombre de ré-essais si un test échoue.
  //   En CI on réessaie 2× (flaky tests réseau), en local 0 (on veut voir l'erreur immédiatement)
  retries: process.env.CI ? 2 : 0,

  // workers : nombre de "workers" (threads) parallèles.
  //   En CI on limite à 1 pour éviter les conflits sur le même navigateur
  workers: process.env.CI ? 1 : undefined,

  // reporter : comment afficher les résultats
  //   'html' génère un rapport visuel dans playwright-report/index.html
  //   On l'ouvre avec : npx playwright show-report
  reporter: 'html',

  // ── Configuration partagée entre tous les tests ──────────────────────────────
  use: {
    // baseURL : URL de base → dans les tests on peut écrire page.goto('/login')
    //           au lieu de page.goto('http://localhost:4200/login')
    baseURL: 'http://localhost:4200',

    // trace : 'on-first-retry' → enregistre une "trace" (vidéo + snapshots) seulement
    //         si le test échoue ET est en train d'être ré-essayé.
    //         Une trace permet de rejouer le test échoué dans le viewer Playwright.
    trace: 'on-first-retry',

    // screenshot : 'only-on-failure' → capture d'écran automatique quand un test échoue.
    //              Précieux pour déboguer en CI où tu n'as pas l'interface.
    screenshot: 'only-on-failure',

    // headless : true → le navigateur tourne sans fenêtre visible (mode "fantôme")
    //            false → tu vois la fenêtre s'ouvrir (bien pour déboguer en local)
    headless: true,
  },

  // ── Projets = combinaisons navigateur/device à tester ───────────────────────
  // On ne teste qu'avec Chromium pour ce projet (plus rapide en CI)
  projects: [
    {
      name: 'chromium',
      // devices['Desktop Chrome'] → preset Playwright avec la taille d'écran standard Desktop
      use: { ...devices['Desktop Chrome'] },
    },
    // Pour tester Firefox ou mobile, tu ajouterais :
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],

  // ── webServer : démarre automatiquement Angular avant les tests ─────────────
  // Playwright peut démarrer le serveur de dev, attendre qu'il soit prêt,
  // puis arrêter le serveur après les tests.
  //
  // DÉCOMMENTE ce bloc quand tu veux lancer les tests sans serveur préalable :
  //
  // webServer: {
  //   command: 'npm start',        // commande pour démarrer Angular
  //   url: 'http://localhost:4200', // Playwright attend cette URL avant de lancer les tests
  //   reuseExistingServer: !process.env.CI, // en local on réutilise le serveur déjà lancé
  //   timeout: 120000,             // 2 minutes max pour démarrer
  // },
});