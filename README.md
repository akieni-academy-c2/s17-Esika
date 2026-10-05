# ESIKA — la location longue durée, sans démarcheur

**## Équipe**

| Nom | Rôle |
|---|---|
| Cédric Hubert NGOUBY | Product Manager |
| Robert Phillipe Najibe IBOVI IKAMA | Business Analyst |
| Grâce Chatel NDOUOLO | Business Analyst |
| José Gloire BOKITOMO | **Développeur FullStact (Repo Admin - frontend)** — Développement des interfaces conformément aux wireframes et intégration des endpoints. |
| Virgile Yann APEMBET-ALECK | **Développeur FullStack (Lead FullStack - backend)** — Réalisation des endpoints et mise en place de l'infrastructure (base de données et stockages des images), conception de la base de données. |

**ESIKA** est une plateforme d'annonces de **location longue durée à Brazzaville et à Pointe-Noire**. Les propriétaires publient eux-mêmes leurs logements, avec le **prix réel** et le **total à réunir pour entrer** ; les locataires les contactent **directement**, par appel ou WhatsApp, sans commission ni démarcheur.

> Projet réalisé en squad dans le cadre du **Sprint Produit S17** — Akieni Academy, Cohorte 2 (28/09 → 05/10/2026).

---

**## Le principe**

| | |
|---|---|
| **Zéro commission** | Aucun frais d'agence ni de démarcheur. |
| **Total à l'entrée affiché** | Sur chaque annonce : `loyer × (mois de caution + mois d'avance)`. |
| **Contact direct** | Le numéro du propriétaire se débloque avec un **Pass Contact** : **2 000 FCFA**, valable **7 jours**, sur **toutes** les annonces (paiement Mobile Money MTN / Airtel, **simulé** dans cette version). |
| **Ne payez jamais avant la visite** | Caution et loyer se règlent au propriétaire, après la visite, contre reçu. Le Pass Contact est le seul paiement sur ESIKA. |
| **Confiance** | Numéros vérifiés, annonces à jour, signalement en un clic, modération par l'équipe. |

**## Fonctionnalités**

**Locataire**
- Recherche par ville, quartier ou repère, loyer, type de logement, équipements, budget d'entrée, ameublement, fiabilité ; tri ; vue grille ou liste.
- Fiche détaillée : galerie photo, fiabilité de l'annonce, équipements, carte de prix, annonces similaires.
- Achat du Pass Contact, puis appel ou message WhatsApp pré-rempli.
- Enregistrer, partager et **signaler** une annonce.

**Propriétaire**
- Publication guidée en 5 étapes (logement, localisation, prix et entrée, équipements, 3 à 6 photos), avec aperçu côté locataire et brouillon.
- Gestion des annonces : modifier le prix, mettre en pause, passer en « Loué », confirmer la disponibilité.
- Possibilité d'être accompagné par un conseiller sur WhatsApp.

**Administration**
- Traitement des signalements : masquer l'annonce, contacter le propriétaire, classer sans suite.

**Transversal** : mobile-first, accessibilité (focus visibles, `aria-*`, réduction des animations), pages d'aide anti-arnaque et FAQ, pages légales.

**## Statut du projet (04/10/2026)**

| Partie | État |
|---|---|
| **Frontend** | **Terminé** : toutes les pages, alignées sur les wireframes. |
| **Inscription et connexion** | Branchées sur le **vrai backend** (téléphone + mot de passe). |
| **Annonces, Pass Contact, signalements, admin** | Fonctionnent en **données simulées** côté front ; le backend de ces modules est en cours de livraison. |

Le site se lance donc de trois façons (voir « Modes de fonctionnement »), y compris sans backend pour une démonstration.

**## Stack technique**

| Couche | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, `react-router-dom` 7, `axios`, CSS classique (sans framework), ESLint |
| **Backend** | Node.js, Express 5, TypeScript (exécuté nativement par Node), JWT, `bcrypt`, `pg` |
| **Base de données** | PostgreSQL (hébergée sur Supabase) |
| **Outils** | Git / GitHub, Postman, Jira, Confluence |

**## Structure du dépôt**

```text
s17-esika-project/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── config/
│       ├── context/
│       ├── layouts/
│       ├── lib/
│       ├── mocks/
│       ├── modules/
│       ├── routes/
│       └── styles/
└── backend/
    ├── src/
    │   ├── config/
    │   ├── middleware/
    │   └── modules/
    └── docs/
```

**## Prise en main**

**### Prérequis**
- **Node.js 22.18 ou plus** et npm.
- Un fichier `.env` pour le backend.

**### 1. Backend**

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Variables du `backend/.env` :

| Variable | Rôle |
|---|---|
| `PORT` | Port du serveur (utiliser `3000`) |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD` | Connexion PostgreSQL |
| `JWT_SECRET_KEY` | Secret de signature des tokens |

**### 2. Frontend**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**## Modes de fonctionnement**

| Mode | `VITE_USE_MOCKS` | `VITE_REAL_AUTH` | Effet |
|---|---|---|---|
| **Démo autonome** | `true` | `false` | Tout est simulé dans le navigateur. |
| **Hybride** | `true` | `true` | Inscription et connexion via le backend ; le reste est simulé. |
| **Complet** | `false` | — | Toutes les données passent par l'API. |

`VITE_API_URL` indique l'adresse du backend, par défaut `http://localhost:3000/api`.

**## Comptes et codes de démonstration**

- **Code de vérification SMS : `123456`** (SMS simulé).
- **Mot de passe** : 8 caractères minimum.
- **Back-office admin : `06 000 0000`** avec n'importe quel mot de passe lorsque `VITE_USE_MOCKS=true`.
- **Mobile Money (simulé) :** un numéro du type `06 123 4567`.
- Les données simulées sont stockées dans le navigateur ; `localStorage.clear()` les remet à zéro.

**## API**

La documentation et la collection Postman se trouvent dans `backend/docs/`.

| Méthode et route | Rôle |
|---|---|
| `POST /api/tenant/signup` · `POST /api/tenant/signin` | Inscription et connexion d'un locataire |
| `POST /api/announcer/signup` · `POST /api/announcer/signin` | Inscription et connexion d'un propriétaire |

Format du téléphone : `+242` suivi du numéro à 9 chiffres.

**## Qualité et performance**

```bash
cd frontend
npm run lint
npm run build
```

Objectifs : mobile-first, chargement < 3 s en 3G, images en WebP < 200 Ko, pages chargées à la demande (`React.lazy`).

**## Organisation du travail**

- Branches `main` et `develop` **protégées**.
- Une branche `feature/T<n°>-description` par tâche.
- Commits au format `type: message`.
- Toute modification passe par une **Pull Request relue** par l'autre développeur.
- Ne jamais commiter `.env`, `node_modules` ni de fichier de verrouillage d'un autre gestionnaire de paquets.

**## Limites connues et suite**

- Le **Pass Contact** et le **SMS** sont **simulés** : aucun paiement ni message réel.
- Le numéro WhatsApp du support et les horaires du support sont à renseigner avant toute mise en ligne.
- Les pages **Conditions d'utilisation** et **Confidentialité** sont des brouillons à faire valider.
- À venir : modification d'une annonce déjà publiée, installation en application (PWA), connexion administrateur côté backend, remplacement du visuel d'accueil par une vraie photo.

**## Sécurité**

- Les secrets (`.env`, identifiants de base de données, clés JWT) ne doivent **jamais** être commités ni partagés.
- Changer les identifiants de la base partagée après la démonstration.
- Le mot de passe saisi à l'inscription n'est conservé qu'en mémoire le temps de créer le compte, jamais sur disque.

---

*Projet pédagogique — Akieni Academy, Cohorte 2 · Sprint S17.*
