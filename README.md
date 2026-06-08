# FournisNet

Plateforme de gestion des fournisseurs et du catalogue de pièces détachées automobiles.

Développé dans le cadre d'un stage chez **Infopro** (2026).

---

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Spring Boot 3.4.7 · Java 17 · Spring Security (JWT) · WebSocket/STOMP |
| Frontend | Angular 16 · Bootstrap 5 · ngx-translate (FR/EN/AR) |
| Base de données | MySQL 8.0 (via XAMPP en dev) |
| NLP | Ollama (llama3.2) — auto-catégorisation de produits |
| Tests E2E | Playwright |
| CI/CD | GitHub Actions |
| Déploiement | Docker Compose |

---

## Fonctionnalités

- **Authentification JWT** — login/register, rôles ADMIN / USER
- **Arborescence produits** — hiérarchie de nœuds et feuilles
- **Catalogue paginé** — recherche, filtres par catégorie, badges de stock
- **Gestion du stock** — édition inline, alertes en temps réel via WebSocket
- **Auto-catégorisation IA** — suggestion de catégorie via Ollama (llama3.2)
- **Multi-langue** — Français / Anglais / Arabe (RTL)
- **Dashboard** — statistiques temps réel

---

## Lancer le projet en local

### Prérequis

- Java 17 (JBR)
- Node.js 20+
- MySQL (XAMPP ou Docker)
- Ollama (optionnel — pour l'IA)

### Backend

```powershell
$env:JAVA_HOME = "C:\Users\DELL\.jdks\jbr-17.0.14"
cd FournisNet
.\mvnw.cmd spring-boot:run
# API disponible sur http://localhost:8083
```

### Frontend

```powershell
cd FournisNetFE
npm install
npm start
# App disponible sur http://localhost:4200
```

### Comptes de démo

| Rôle | Username | Password |
|---|---|---|
| Admin | admin | admin123 |
| User | user | user123 |

---

## Tests E2E (Playwright)

```powershell
cd FournisNetFE

# Lancer les tests (serveurs backend + frontend doivent tourner)
npm run test:e2e

# Voir le navigateur pendant les tests
npm run test:e2e:headed

# Interface graphique interactive
npm run test:e2e:ui

# Rapport HTML
npm run test:e2e:report
```

### Couverture des tests

| Fichier | Scénarios testés |
|---|---|
| `e2e/auth.spec.ts` | Login valide, mauvais mot de passe, champs vides, navigation |
| `e2e/catalogue.spec.ts` | Liste produits, recherche, badges stock, pagination, filtres |
| `e2e/i18n.spec.ts` | Dropdown langue, FR/EN/AR, direction RTL |

---

## Docker Compose

```bash
docker-compose up --build
# Frontend  → http://localhost:80
# Backend   → http://localhost:8083
# MySQL     → port 3306
```

---

## CI/CD — GitHub Actions

Le pipeline se déclenche automatiquement sur chaque push vers `main` ou `develop`.

```
push / pull_request
        │
        ▼
┌─────────────────┐    ┌──────────────────┐
│  backend-test   │    │  frontend-build  │
│  Maven compile  │    │  ng build prod   │
│  + unit tests   │    └────────┬─────────┘
└────────┬────────┘             │
         │              ┌───────▼──────────┐
         └──────────────►   e2e-tests      │
                        │  Playwright      │
                        │  (MySQL service) │
                        └───────┬──────────┘
                                │
                        ┌───────▼──────────┐
                        │   docker-build   │
                        │  Build images    │
                        └──────────────────┘
```

---

## Structure du projet

```
FournisNet-workspace/
├── FournisNet/               # Backend Spring Boot
│   ├── src/main/java/talan/fournisnet/
│   │   ├── Config/           # WebSocket
│   │   ├── Dto/              # Data Transfer Objects
│   │   ├── Entities/         # JPA Entities
│   │   ├── Repositories/     # Spring Data JPA
│   │   ├── Restcontrollers/  # REST API
│   │   ├── Security/         # JWT + Spring Security
│   │   └── Services/         # Business logic + Ollama
│   └── Dockerfile
├── FournisNetFE/             # Frontend Angular
│   ├── app/
│   │   ├── components/       # stock-toast, arborescence...
│   │   ├── pages/            # home, login, cars, produit-single...
│   │   ├── services/         # auth, produit, stock-ws, language...
│   │   └── classes/          # interfaces TypeScript
│   ├── e2e/                  # Tests Playwright
│   ├── src/assets/i18n/      # Traductions FR/EN/AR
│   ├── playwright.config.ts
│   └── Dockerfile
├── .github/workflows/ci.yml  # GitHub Actions
├── docker-compose.yml
└── LEARNING_NOTES.md         # Notes d'apprentissage
```
