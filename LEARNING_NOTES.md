# Notes d'apprentissage — FournisNet

Concepts rencontrés pendant le développement du projet.
Chaque entrée = un truc que j'ai appris, avec POURQUOI et COMMENT le réutiliser.

---

## PowerShell — Appel de méthode statique .NET

**Rencontré lors de :** configuration de JAVA_HOME pour Maven Wrapper

### Ce que c'est

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\...\jbr-17", "User")
```

**Nom officiel :** Static Method Invocation (appel de méthode statique .NET)

**Syntaxe :** `[NomDeLaClasse]::NomDeLaMethode(arg1, arg2, ...)`

PowerShell tourne sur le framework .NET.
Ça veut dire que depuis PowerShell, tu peux appeler DIRECTEMENT n'importe quelle
classe .NET de la bibliothèque standard — sans avoir besoin d'un import ou d'un require.

### Décomposition de la commande

```
[System.Environment]                   → la classe .NET (entre crochets = type .NET)
              ::                       → opérateur d'accès aux membres STATIQUES
                SetEnvironmentVariable → la méthode
                ("JAVA_HOME",          → nom de la variable
                 "C:\...\jbr-17",      → valeur à définir
                 "User")               → portée : "User" | "Machine" | "Process"
```

**Portées disponibles :**
| Valeur      | Portée                                      | Droits nécessaires |
|-------------|---------------------------------------------|--------------------|
| `"Process"` | Ce terminal seulement (= `$env:VAR = ...`)  | Aucun              |
| `"User"`    | Ton compte Windows, permanent               | Aucun              |
| `"Machine"` | Tout le système, permanent                  | Administrateur     |

### Différence avec `$env:VAR = "..."`

```powershell
$env:JAVA_HOME = "C:\..."    # TEMPORAIRE — disparaît quand tu fermes le terminal
                             # Équivaut à portée "Process"

[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\...", "User")
                             # PERMANENT — survit aux redémarrages
                             # Écrit dans le registre Windows (HKCU\Environment)
```

### Autres méthodes utiles de System.Environment

```powershell
[System.Environment]::GetEnvironmentVariable("JAVA_HOME", "User")   # lire
[System.Environment]::SetEnvironmentVariable("MA_VAR", $null, "User") # supprimer
[System.Environment]::GetFolderPath("Desktop")
[System.Environment]::GetFolderPath("ApplicationData")   # = AppData\Roaming
[System.Environment]::OSVersion
[System.Environment]::MachineName
```

### Règle à retenir

> Si tu cherches à faire quelque chose en PowerShell et tu ne trouves pas de cmdlet,
> cherche si la bibliothèque .NET a une classe pour ça.
> La syntaxe est toujours : `[System.NomDuNamespace.NomDeLaClasse]::Méthode()`

---

## PowerShell — Opérateur && non disponible en version 5.1

**Rencontré lors de :** tentative de `cd FournisNet && .\mvnw.cmd spring-boot:run`

```powershell
# ❌ Ne fonctionne PAS en PowerShell 5.1 (Windows PowerShell)
cd dossier && commande

# ✅ Alternatives
cd dossier; commande          # séquentiel sans condition (toujours exécuté)

# ✅ Si tu veux le comportement exact de && (B seulement si A réussit)
cd dossier; if ($?) { commande }
# $? = variable automatique PowerShell = true si la dernière commande a réussi
```

**Note :** `&&` fonctionne dans Bash/Zsh, PowerShell 7+ (`pwsh.exe`), Git Bash.
PowerShell 5.1 (`powershell.exe`) = version intégrée à Windows → pas de `&&`.

---

## Maven Wrapper (mvnw) — Pourquoi ça existe

**Rencontré lors de :** lancement du backend Spring Boot

```powershell
.\mvnw.cmd spring-boot:run    # Windows
./mvnw spring-boot:run        # Linux / Mac (GitHub Actions)
```

`mvn` = Maven installé globalement. `mvnw` = Maven Wrapper = script qui télécharge
automatiquement la bonne version de Maven si elle n'est pas présente.

Avantages :
- Pas besoin d'installer Maven → n'importe qui peut cloner le repo et build
- La version est fixée dans `.mvn/wrapper/maven-wrapper.properties`
- En CI/CD le runner n'a pas Maven → mvnw le télécharge automatiquement

**Flags Maven utiles :**
```bash
./mvnw verify -B --no-transfer-progress    # compile + tests, logs propres
./mvnw package -B -DskipTests             # compile + package SANS tests
./mvnw spring-boot:run -DskipTests &      # démarre l'app en arrière-plan
```

---

## Playwright — Auto-wait et pourquoi `await` est partout

**Rencontré lors de :** écriture des tests E2E

Playwright est **entièrement asynchrone**. Chaque action navigateur retourne une Promise.

```typescript
await page.goto('/login');                    // navigation
await page.fill('input', 'valeur');           // frappe dans un champ
await page.click('button');                   // clic
await expect(locator).toBeVisible();          // assertion
```

**Auto-wait :** Playwright réessaie automatiquement pendant X secondes si un élément
n'est pas encore là. Pas besoin de `sleep()` sauf cas très particuliers.

```typescript
// ✅ Playwright attend automatiquement
await expect(page.locator('.mon-bouton')).toBeVisible();

// ❌ Pas besoin de ça
await page.waitForTimeout(2000);
await expect(page.locator('.mon-bouton')).toBeVisible();
```

---

## Angular — Bug [(ngModel)] avec des objets dans un `<select>`

**Rencontré lors de :** formulaire d'édition de produit — la catégorie sélectionnée
ne s'affichait pas dans le `<select>` en mode édition.

Angular compare par référence (`===`). Une copie d'objet (`{ ...produit }`) a une
référence différente même si les données sont identiques → aucune option pré-sélectionnée.

```html
<!-- ❌ Comparaison par référence → échoue avec des copies -->
<select [(ngModel)]="editingProduit.categorie">
  <option *ngFor="let c of categories" [ngValue]="c">{{ c.nom }}</option>
</select>

<!-- ✅ Comparaison par valeur (primitif) → toujours correct -->
<select [(ngModel)]="editingProduit.categorieId">
  <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.nom }}</option>
</select>
```

> **Règle :** Dans un `<select>` Angular avec `[(ngModel)]`, lier par **ID (primitif)**,
> jamais par l'objet entier, sauf si tu es sûr que les références sont identiques.

---

## Angular — Recherche réactive avec Subject + debounceTime

**Rencontré lors de :** barre de recherche dans le catalogue

```typescript
private searchSubject = new Subject<string>();

ngOnInit() {
  this.searchSubject.pipe(
    debounceTime(400),          // attend 400ms d'inactivité
    distinctUntilChanged(),     // ignore si valeur identique
    switchMap(term => this.produitService.search(term))  // annule la requête précédente
  ).subscribe(results => this.produits = results);
}

onSearch(term: string) {
  this.searchSubject.next(term);
}
```

| Opérateur        | Ce qu'il fait                                        |
|------------------|------------------------------------------------------|
| `Subject`        | Observable qu'on contrôle avec `.next()`             |
| `debounceTime`   | Attend X ms d'inactivité avant de laisser passer     |
| `distinctUntilChanged` | Ignore si même valeur que la précédente        |
| `switchMap`      | Annule la requête en cours, démarre la nouvelle      |

> `switchMap` > `mergeMap` pour les recherches : toujours le résultat de la DERNIÈRE frappe.

---

## Angular — InjectionToken

**Rencontré lors de :** migration ngx-translate v17 — `TRANSLATE_HTTP_LOADER_CONFIG`

Un **Injection Token** est une clé unique pour injecter une **valeur** (pas une classe)
dans le système DI d'Angular.

```typescript
providers: [
  {
    provide: TRANSLATE_HTTP_LOADER_CONFIG,
    useValue: { prefix: './assets/i18n/', suffix: '.json' }
  }
]
```

> `InjectionToken` = façon d'injecter une valeur (string, objet, boolean) via DI Angular.
> On le voit dans les librairies pour la configuration.

---

## Angular — CommonJS dependencies warning

**Rencontré lors de :** `WARNING in @stomp/stompjs depends on 'webstomp-client'...`

Angular utilise ES Modules (ESM) pour le tree-shaking. Les librairies en CommonJS
(ancien `require()`) ne peuvent pas être tree-shakées → bundle potentiellement plus gros.

```json
"build": {
  "options": {
    "allowedCommonJsDependencies": ["@stomp/stompjs", "sockjs-client"]
  }
}
```

---

## Angular — Budget de taille de bundle

**Rencontré lors de :** CI/CD — `Error: bundle initial exceeded maximum budget`

Angular impose des limites de taille sur les fichiers JS compilés pour éviter
d'expédier accidentellement un bundle énorme aux utilisateurs.

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "1.5mb",   // avertissement si dépassé
    "maximumError": "2mb"        // ERREUR (build échoue) si dépassé
  }
]
```

Notre bundle = 1.10 MB (Bootstrap + ngx-translate + SockJS + Flaticon).
La limite par défaut (1 MB) était trop basse pour ce stack → on a augmenté à 2 MB.

> La limite par défaut (500kb warning / 1mb error) est pour les apps légères.
> Un projet avec Bootstrap + WebSocket + i18n dépasse facilement 1 MB.

---

## Spring Boot — @Query JPQL vs Derived Queries

**Rencontré lors de :** filtre `groupNode=false` dans le catalogue paginé

```java
// Derived query — Spring génère le SQL depuis le nom de méthode
List<Produit> findByNom(String nom);  // → SELECT * FROM produit WHERE nom = ?

// @Query — JPQL explicite (parle des classes Java, pas des tables)
@Query("SELECT p FROM Produit p WHERE p.groupNode = false")
Page<Produit> findAllProducts(Pageable pageable);
```

JPQL = SQL mais en termes de classes Java. Les jointures sont implicites via `@ManyToOne`.

---

## WebSocket / STOMP — Temps réel dans l'application

**Rencontré lors de :** alertes de stock en temps réel

```
HTTP : requête → réponse → connexion fermée
WebSocket : connexion permanente ouverte dans les deux sens
STOMP : protocole au-dessus de WebSocket, ajoute la notion de topics (pub/sub)
```

Le serveur publie sur `/topic/stock-alerts`, tous les clients abonnés reçoivent.

**Fix critique :** `sockjs-client` utilise `global` (variable Node.js) dans le navigateur.
Solution : ajouter dans `index.html` **avant** `<app-root>` :
```html
<script>var global = globalThis;</script>
```
Sans ça → page blanche, erreur `global is not defined`.

---

## Docker — Multi-stage Build

**Rencontré lors de :** création des Dockerfiles

```dockerfile
# Stage 1 — builder (contient Node.js + node_modules)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build    # → génère dist/

# Stage 2 — image finale (contient UNIQUEMENT le résultat)
FROM nginx:alpine
COPY --from=builder /app/dist/fournisnet-front /usr/share/nginx/html
```

| Version          | Taille image |
|------------------|--------------|
| Sans multi-stage | ~800 MB      |
| Avec multi-stage | ~25 MB       |

> Stage 1 = outils de build. Stage 2 = ce qui tourne en production. Standard dans l'industrie.

---

## GitHub Actions — La variable `process.env.CI`

**Rencontré lors de :** configuration de `playwright.config.ts`

```typescript
forbidOnly: !!process.env.CI,   // !! = convertit en boolean
retries: process.env.CI ? 2 : 0,
```

GitHub Actions injecte automatiquement `CI=true` dans tous les runners.
Ton code détecte ainsi "je suis en CI" vs "je tourne en local".

---

## GitHub Actions — Services Docker (MySQL en CI)

**Rencontré lors de :** job `e2e-tests` — le backend a besoin de MySQL

Les `services:` dans un job GitHub Actions démarrent un container Docker
**en parallèle** du job, accessible via `localhost`.

```yaml
services:
  mysql:
    image: mysql:8.0
    env:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: DB_FourniNet
    ports:
      - 3306:3306
    options: >-
      --health-cmd="mysqladmin ping -h localhost -u root --password=root"
      --health-interval=10s
      --health-retries=5
```

Le `options: --health-cmd` est crucial : GitHub Actions attend que MySQL soit
**vraiment prêt** avant de lancer les steps. Sans ça, Spring Boot tente de
se connecter avant que MySQL ait fini de démarrer → `Connection refused`.

---

## GitHub Actions — Health check de serveur : nc vs curl

**Rencontré lors de :** attente que le backend Spring Boot soit prêt

```yaml
# ❌ nc (netcat) n'est pas garanti d'être installé sur tous les runners
timeout 120 bash -c 'until nc -z localhost 8083; do sleep 3; done'

# ❌ curl --fail (-f) échoue sur les 404/405 → boucle infinie si l'endpoint n'existe pas
timeout 120 bash -c 'until curl -sf http://localhost:8083/actuator/health; do sleep 5; done'

# ✅ curl sans --fail → retourne 0 dès qu'il reçoit n'importe quelle réponse HTTP
timeout 120 bash -c 'until curl -s -o /dev/null http://localhost:8083; do sleep 3; done'
```

**Exit code 124** = timeout expiré. Si un process background tourne mais que
la commande de vérification échoue toujours → le `timeout` tue tout après X secondes.

> **Règle :** Pour vérifier qu'un serveur HTTP est prêt en CI, utiliser
> `curl -s -o /dev/null URL` (sans `--fail`). Disponible sur tous les runners.

---

## GitHub Actions — Spring Boot Actuator vs port check

**Rencontré lors de :** health check du backend

Spring Boot Actuator est une dépendance **optionnelle** qui expose `/actuator/health`.
Si elle n'est pas dans le `pom.xml`, l'URL retourne 404.

Ne jamais supposer qu'Actuator est disponible en CI. Utiliser à la place :
- `curl -s -o /dev/null http://localhost:PORT` (vérifie que le serveur répond)
- Ou ajouter la dépendance Actuator dans `pom.xml` si tu veux le vrai health check

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

---

## GitHub Actions — @SpringBootTest et base de données

**Rencontré lors de :** `FournisNetApplicationTests.contextLoads()` échoue en CI

`@SpringBootTest` charge le **contexte Spring complet**, ce qui inclut la connexion
à la base de données. Sans MySQL disponible → `Connection refused` → test en erreur.

Options pour gérer ça :

```bash
# Option 1 (notre choix) — skiper les tests dans le job "compile"
./mvnw package -DskipTests
# Les tests d'intégration sont déjà couverts par le job e2e-tests.
# FournisNetApplicationTests est du boilerplate auto-généré (corps vide).

# Option 2 — utiliser une DB en mémoire H2 pour les tests uniquement
# (ajouter H2 en scope test dans pom.xml)
```

> Si ton job CI ne sert qu'à **vérifier que ça compile**, utilise `-DskipTests`.
> Garde les tests d'intégration dans un job dédié avec une vraie DB.

---

## Git — Monorepo : backend + frontend dans un seul repo

**Rencontré lors de :** push du projet sur GitHub

Un **monorepo** = un seul repo Git qui contient plusieurs projets (backend, frontend).
Avantages : un seul historique, CI/CD unifié, plus simple à gérer.

```
FournisNet-workspace/         ← racine du repo Git
├── FournisNet/               ← backend Spring Boot
├── FournisNetFE/             ← frontend Angular
├── .github/workflows/ci.yml  ← pipeline CI/CD (les deux projets)
├── docker-compose.yml
└── README.md
```

**Piège évité :** ne jamais init Git à la racine de ton dossier home (`C:\Users\DELL`).
Toujours init Git dans le dossier racine du projet uniquement.

---

## Git — Fichiers à NE JAMAIS committer

**Rencontré lors de :** push timeout HTTP 408 — 1 GB de cache Angular committé

Certains dossiers sont des artefacts de build ou de cache — jamais dans Git.

```
# .gitignore obligatoire pour un projet Angular + Spring Boot
FournisNetFE/node_modules/       # dépendances npm (~300 MB)
FournisNetFE/dist/               # build compilé
FournisNetFE/.angular/           # cache webpack Angular (~1 GB !)
FournisNetFE/test-results/       # résultats Playwright
FournisNetFE/playwright-report/  # rapports HTML Playwright

FournisNet/target/               # build Maven (.jar, .class)
```

**Symptôme si oublié :** `git push` timeout (HTTP 408) ou très lent.
**Fix :** `git rm -r --cached <dossier>` pour retirer du suivi Git sans supprimer le fichier.

> Le `.angular/` est le piège le plus courant — il peut dépasser 1 GB facilement.

---

## Git — Amender un commit (modifier le message)

**Rencontré lors de :** suppression de "Co-Authored-By" du message de commit

```bash
git commit --amend -m "Nouveau message"   # modifie le DERNIER commit local

# Si déjà pushé → force push nécessaire (réécrit l'historique)
git push origin main --force
git push origin main:master --force       # pour mettre à jour aussi master
```

**Quand utiliser :** uniquement sur des commits non partagés ou sur ton propre repo.
Sur un repo d'équipe avec d'autres développeurs → le force push casse leur historique.

---

## CORS — Cross-Origin Resource Sharing

**Rencontré lors de :** Angular (localhost:4200) ne pouvait pas appeler le backend (localhost:8083)

**CORS** = mécanisme de sécurité du navigateur. Il bloque les requêtes entre deux origines
différentes (domaine, port ou protocole différent) par défaut.

```
Angular http://localhost:4200  ──▶  Backend http://localhost:8083
                                    ↑ Origines différentes (port) → bloqué par le navigateur
```

**La requête OPTIONS (preflight) :** avant toute requête POST/PUT/DELETE,
le navigateur envoie d'abord une requête OPTIONS pour demander la permission.
Spring Security doit laisser passer les OPTIONS **sans authentification**.

```java
// Fix dans SecurityConfig.java
http.cors(cors -> cors.configurationSource(corsConfigurationSource()))

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

> CORS = côté serveur uniquement. Si ça bloque → configurer le backend, pas le frontend.

---

## JWT — JSON Web Token

**Rencontré lors de :** authentification dans l'application

Un JWT est un token signé qui contient des informations sur l'utilisateur.

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiJ9.signature
      HEADER              PAYLOAD (données utilisateur)        SIGNATURE
```

**Fonctionnement :**
1. Login → serveur génère un JWT signé avec une clé secrète
2. Le client stocke le JWT (localStorage ou cookie)
3. Chaque requête envoie le JWT dans le header : `Authorization: Bearer <token>`
4. Le serveur vérifie la signature → pas besoin de base de données pour valider

**Avantage :** stateless — le serveur ne stocke pas les sessions.
**Inconvénient :** impossible d'invalider un token avant son expiration (sauf avec blacklist).

---