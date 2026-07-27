# 📋 Audit Pro — Système de Gestion d'Audit

**Audit Pro** est une application web complète de gestion d'audit, de conformité et de risques. Elle permet aux organisations de planifier, exécuter et suivre des audits, gérer les non-conformités, les actions correctives, les risques, et assurer la conformité légale et réglementaire.

---

## 📑 Table des matières

- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Modules fonctionnels](#-modules-fonctionnels)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Routes API](#-routes-api)
- [Base de données](#-base-de-données)
- [Pages frontend](#-pages-frontend)
- [Sécurité](#-sécurité)
- [Scripts disponibles](#-scripts-disponibles)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)                │
│                    Port 5173                             │
├─────────────────────────────────────────────────────────┤
│                       API Proxy                          │
│                   Vite → http://localhost:4000            │
├─────────────────────────────────────────────────────────┤
│              Backend (Express + TypeScript)              │
│                     Port 4000                            │
├─────────────────────────────────────────────────────────┤
│                    MongoDB (Mongoose)                    │
└─────────────────────────────────────────────────────────┘
```

L'architecture suit un modèle **REST** avec :
- **Frontend SPA** React avec routage côté client
- **Backend API** RESTful avec middleware de sécurité
- **Base de données** MongoDB avec ODM Mongoose
- **Authentification** JWT (Access + Refresh tokens)

---

## 🛠 Stack technique

### Frontend
| Technologie | Version | Utilisation |
|---|---|---|
| React | 19.x | Framework UI |
| TypeScript | 6.x | Typage statique |
| Vite | 8.x | Bundler / dev server |
| Tailwind CSS | 3.x | Styles utilitaires |
| React Router | 7.x | Routage SPA |
| Axios | 1.x | Client HTTP |
| Recharts | 3.x | Graphiques |
| Lucide React | 1.x | Icônes |
| clsx / tailwind-merge | - | Gestion de classes CSS |

### Backend
| Technologie | Version | Utilisation |
|---|---|---|
| Node.js / Express | 4.x | Serveur HTTP |
| TypeScript | 5.x | Typage statique |
| Mongoose | 8.x | ODM MongoDB |
| JWT (jsonwebtoken) | 9.x | Authentification |
| bcryptjs | 2.x | Hachage mots de passe |
| Joi | 17.x | Validation |
| Nodemailer | 9.x | Envoi d'emails |
| Winston | 3.x | Logs |
| Helmet | 7.x | Sécurité HTTP |
| express-rate-limit | 7.x | Rate limiting |
| Swagger (swagger-jsdoc) | 6.x | Documentation API |
| Morgan | 1.x | Logging HTTP |

---

## 📦 Modules fonctionnels

| Module | Description |
|---|---|
| **Authentification** | Inscription, connexion, refresh token, email vérification, mot de passe oublié/réinitialisation |
| **Tableau de bord** | Vue d'ensemble avec KPIs, graphiques (barres, lignes, aires, camembert, matrice risques, jauge conformité) |
| **Audits** | Planification, suivi, statuts (Planifié, En cours, Terminé, Annulé), score de conformité |
| **Normes** | Gestion des normes ISO (9001, 14001, etc.) avec clauses et exigences |
| **Sites** | Gestion des sites et installations (adresse, ville, pays, responsable) |
| **Processus** | Processus métier liés aux sites |
| **Non-conformités** | Signalement, sévérité (Critique, Majeure, Mineure, Faible), statuts |
| **Actions correctives** | Actions correctives/préventives/d'amélioration liées aux NC |
| **Risques** | Identification, évaluation (Probabilité × Impact), matrice de risques |
| **Conformité légale** | Exigences légales et réglementaires avec suivi de conformité |
| **Rapports** | Génération de rapports (PDF, Excel, CSV) |
| **Notifications** | Alertes système (INFO, WARNING, ERROR, SUCCESS) |
| **Utilisateurs** | Gestion des comptes, rôles, statuts |
| **Rôles & Permissions** | RBAC avec permissions granulaires |
| **Journal d'audit** | Traçabilité des actions système |

---

## 📁 Structure du projet

```
Gestion_Audit/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.ts          # Configuration applicative
│   │   │   └── database.ts        # Connexion MongoDB
│   │   ├── core/
│   │   │   ├── auth/              # Authentification JWT
│   │   │   ├── email/             # Service d'emails
│   │   │   ├── http/              # Error handler, async handler
│   │   │   └── utils/             # Logger, pagination
│   │   ├── modules/
│   │   │   ├── audits/            # Module audits
│   │   │   ├── auditEntries/      # Entrées d'audit (checklist)
│   │   │   ├── auditLog/          # Journal d'audit système
│   │   │   ├── auth/              # Authentification
│   │   │   ├── correctiveActions/ # Actions correctives
│   │   │   ├── dashboard/         # Dashboard
│   │   │   ├── legal/             # Conformité légale
│   │   │   ├── nonConformities/   # Non-conformités
│   │   │   ├── norms/             # Normes & checklists
│   │   │   ├── notifications/     # Notifications
│   │   │   ├── processes/         # Processus
│   │   │   ├── reports/           # Rapports
│   │   │   ├── risks/             # Risques
│   │   │   ├── roles/             # Rôles
│   │   │   ├── sites/             # Sites
│   │   │   └── users/             # Utilisateurs
│   │   ├── routes.ts              # Agrégation des routes
│   │   ├── app.ts                 # Configuration Express
│   │   ├── server.ts              # Point d'entrée serveur
│   │   ├── seed.ts                # Script d'amorçage BDD
│   │   ├── seed-data/             # Données de démo (JSON)
│   │   └── swagger/               # Documentation Swagger
│   ├── db_structure.md            # Schéma complet BDD
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Charts.tsx         # Composants graphiques (Recharts)
│   │   │   └── Navigation.tsx     # Barre latérale de navigation
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx     # Contexte d'authentification
│   │   ├── lib/
│   │   │   └── api.ts             # Client Axios avec intercepteurs
│   │   ├── pages/
│   │   │   ├── Login.tsx          # Connexion
│   │   │   ├── Register.tsx       # Inscription
│   │   │   ├── ForgotPassword.tsx # Mot de passe oublié
│   │   │   ├── ResetPassword.tsx  # Réinitialisation mot de passe
│   │   │   ├── EmailVerification.tsx # Vérification email
│   │   │   ├── Dashboard.tsx      # Tableau de bord
│   │   │   ├── Audits.tsx         # Liste des audits
│   │   │   ├── AuditDetail.tsx    # Détail d'un audit
│   │   │   ├── NewAudit.tsx       # Création d'audit
│   │   │   ├── Norms.tsx          # Gestion des normes
│   │   │   ├── Sites.tsx          # Gestion des sites
│   │   │   ├── Processes.tsx      # Gestion des processus
│   │   │   ├── NonConformities.tsx # Non-conformités
│   │   │   ├── NewNonConformity.tsx # Signalement NC
│   │   │   ├── CorrectiveActions.tsx # Actions correctives
│   │   │   ├── NewCorrectiveAction.tsx # Nouvelle action
│   │   │   ├── Risks.tsx          # Risques
│   │   │   ├── NewRisk.tsx        # Ajout risque
│   │   │   ├── Legal.tsx          # Conformité légale
│   │   │   ├── NewLegalRequirement.tsx # Nouvelle exigence
│   │   │   ├── Reports.tsx        # Rapports
│   │   │   ├── NewReport.tsx      # Génération rapport
│   │   │   ├── Notifications.tsx  # Notifications
│   │   │   ├── Users.tsx          # Utilisateurs
│   │   │   └── Roles.tsx          # Rôles & permissions
│   │   ├── App.tsx                # Routage principal
│   │   ├── main.tsx               # Point d'entrée React
│   │   └── index.css              # Design system Tailwind
│   ├── vite.config.ts             # Configuration Vite + proxy API
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

---

## 🔧 Installation

### Prérequis

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** (local ou Atlas)

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd Gestion_Audit
```

### 2. Installer les dépendances backend

```bash
cd backend
npm install
```

### 3. Installer les dépendances frontend

```bash
cd ../frontend
npm install
```

### 4. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Serveur
PORT=4000
NODE_ENV=development

# Base de données
MONGO_URI=mongodb://localhost:27017/audit_management

# JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
REFRESH_TOKEN_SECRET=votre_secret_refresh_tres_long_et_securise
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (Mailtrap pour développement)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_AUTH_USER=votre_user_mailtrap
EMAIL_AUTH_PASS=votre_pass_mailtrap
EMAIL_FROM=noreply@auditpro.com

# Frontend
FRONTEND_URL=http://localhost:5173
```

Créez un fichier `.env` dans le dossier `frontend/` (optionnel) :

```env
VITE_API_BASE_URL=
```

> **Note** : Le proxy Vite (`vite.config.ts`) redirige automatiquement `/api` vers `http://localhost:4000`. Aucune configuration supplémentaire n'est nécessaire en développement.

### 5. Amorcer la base de données avec des données de démonstration

```bash
cd backend
npm run seed
```

---

## 🚀 Démarrage

### Lancer le backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur **http://localhost:4000**.

### Lancer le frontend

```bash
cd frontend
npm run dev
```

L'application frontend démarre sur **http://localhost:5173**.

### Documentation Swagger

Une fois le backend démarré, la documentation interactive Swagger est disponible sur :

**http://localhost:4000/api-docs**

### Comptes de démonstration

Après avoir exécuté la seed, vous pouvez utiliser ces comptes :

| Email | Mot de passe | Rôle |
|---|---|---|
| admin@auditpro.com | password123 | ADMIN |
| manager@auditpro.com | password123 | MANAGER |
| auditor@auditpro.com | password123 | AUDITOR |
| user@auditpro.com | password123 | USER |

---

## 🌐 Routes API

### Authentification
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/refresh` | Rafraîchir token |
| POST | `/api/auth/logout` | Déconnexion |
| POST | `/api/auth/forgot-password` | Mot de passe oublié |
| POST | `/api/auth/reset-password` | Réinitialiser mot de passe |
| POST | `/api/auth/verify-email` | Vérifier email |
| POST | `/api/auth/resend-verification` | Renvoyer lien vérification |
| GET | `/api/auth/me` | Profil utilisateur |

### Utilisateurs & Rôles
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/users` | Lister utilisateurs |
| POST | `/api/users` | Créer utilisateur |
| PUT | `/api/users/:id` | Modifier utilisateur |
| POST | `/api/users/:id/activate` | Activer utilisateur |
| POST | `/api/users/:id/deactivate` | Désactiver utilisateur |
| GET | `/api/roles` | Lister rôles |
| POST | `/api/roles` | Créer rôle |
| PUT | `/api/roles/:id` | Modifier rôle |
| DELETE | `/api/roles/:id` | Supprimer rôle |

### Normes
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/norms` | Lister normes |
| POST | `/api/norms` | Créer norme |
| PUT | `/api/norms/:id` | Modifier norme |

### Sites
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/sites` | Lister sites |
| POST | `/api/sites` | Créer site |
| PUT | `/api/sites/:id` | Modifier site |
| POST | `/api/sites/:id/activate` | Activer site |
| POST | `/api/sites/:id/deactivate` | Désactiver site |

### Processus
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/processes` | Lister processus |
| POST | `/api/processes` | Créer processus |
| PUT | `/api/processes/:id` | Modifier processus |
| POST | `/api/processes/:id/activate` | Activer processus |
| POST | `/api/processes/:id/deactivate` | Désactiver processus |

### Audits
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/audits` | Lister audits |
| POST | `/api/audits` | Créer audit |
| GET | `/api/audits/:id` | Détail audit |
| POST | `/api/audits/:id/start` | Démarrer audit |
| POST | `/api/audits/:id/complete` | Terminer audit |
| POST | `/api/audits/:id/cancel` | Annuler audit |
| POST | `/api/audits/:id/calculate-score` | Calculer score conformité |

### Non-conformités
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/non-conformities` | Lister NC |
| POST | `/api/non-conformities` | Créer NC |

### Actions correctives
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/corrective-actions` | Lister actions |
| POST | `/api/corrective-actions` | Créer action |

### Risques
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/risks` | Lister risques |
| POST | `/api/risks` | Créer risque |

### Juridique
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/legal/requirements` | Lister exigences légales |
| POST | `/api/legal/requirements` | Créer exigence |

### Rapports
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/reports` | Lister rapports |
| POST | `/api/reports` | Générer rapport |

### Notifications
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/notifications` | Lister notifications |
| PATCH | `/api/notifications/:id/read` | Marquer comme lue |
| PATCH | `/api/notifications/read-all` | Tout marquer comme lu |
| DELETE | `/api/notifications/:id` | Supprimer notification |

### Dashboard
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/dashboard/overview` | Statistiques dashboard |

### Health Check
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/health` | Statut du serveur |

---

## 🗄 Base de données

### Collections MongoDB

| Collection | Description |
|---|---|
| `users` | Utilisateurs système |
| `roles` | Rôles et permissions |
| `norms` | Normes (ISO, etc.) |
| `norm_clauses` | Clauses de normes |
| `norm_checklists` | Questions de check-list |
| `sites` | Sites et installations |
| `processes` | Processus métier |
| `audits` | Audits |
| `audit_entries` | Réponses aux check-lists d'audit |
| `non_conformities` | Non-conformités |
| `corrective_actions` | Actions correctives |
| `risks` | Risques |
| `risk_links` | Liens entre risques et entités |
| `legal_requirements` | Exigences légales |
| `legal_compliances` | Évaluations de conformité légale |
| `reports` | Rapports générés |
| `notifications` | Notifications utilisateurs |
| `audit_logs` | Journal des actions système |

Voir `backend/db_structure.md` pour le schéma détaillé complet.

---

## 🖥 Pages frontend

### Pages publiques
| Route | Page | Description |
|---|---|---|
| `/login` | Login | Connexion |
| `/register` | Register | Inscription |
| `/forgot-password` | ForgotPassword | Mot de passe oublié |
| `/reset-password/:token` | ResetPassword | Réinitialisation mot de passe |
| `/verify-email/:token` | EmailVerification | Vérification email |

### Pages protégées
| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Tableau de bord avec KPIs |
| `/audits` | Audits | Liste des audits |
| `/audits/new` | NewAudit | Création d'audit |
| `/audits/:id` | AuditDetail | Détail d'un audit |
| `/norms` | Norms | Gestion des normes |
| `/sites` | Sites | Gestion des sites |
| `/processes` | Processes | Gestion des processus |
| `/non-conformities` | NonConformities | Liste des NC |
| `/non-conformities/new` | NewNonConformity | Signaler une NC |
| `/corrective-actions` | CorrectiveActions | Liste des actions |
| `/corrective-actions/new` | NewCorrectiveAction | Nouvelle action |
| `/risks` | Risks | Liste des risques |
| `/risks/new` | NewRisk | Ajouter un risque |
| `/legal` | Legal | Conformité légale |
| `/legal/requirements/new` | NewLegalRequirement | Nouvelle exigence |
| `/reports` | Reports | Rapports |
| `/reports/new` | NewReport | Générer rapport |
| `/notifications` | Notifications | Notifications |
| `/users` | Users | Gestion utilisateurs |
| `/roles` | Roles | Gestion rôles |

---

## 🔒 Sécurité

- **Helmet** : En-têtes de sécurité HTTP
- **Rate Limiting** : Limitation du nombre de requêtes (100 req / 15 min par défaut)
- **CORS** : Configuration des origines autorisées
- **JWT** : Authentification par tokens (Access Token 1h, Refresh Token 7j)
- **Bcrypt** : Hachage des mots de passe (10 rounds de salt)
- **Validation Joi** : Validation des entrées côté serveur
- **Intercepteurs Axios** : Rafraîchissement automatique des tokens expirés

---

## 📜 Scripts disponibles

### Backend

```bash
npm run dev      # Démarrage en développement (nodemon)
npm run build    # Compilation TypeScript
npm run start    # Démarrage en production
npm run seed     # Amorçage de la base de données
npm run lint     # Analyse statique du code
npm run format   # Formatage Prettier
```

### Frontend

```bash
npm run dev      # Démarrage serveur de développement (Vite)
npm run build    # Build de production
npm run lint     # Analyse statique ESLint
npm run preview  # Prévisualisation du build
```

---

## 🎨 Design System

L'interface utilise un **design system** sur mesure avec Tailwind CSS :

- **Palette** : Tons foncés/navire (`#0B1220`) et dorés/brass (`#B8873D`)
- **Typographie** : Inter (sans-serif), Fraunces (serif), IBM Plex Mono (monospace)
- **Composants** : Boutons, cartes, formulaires, badges, tableaux, modales, graphes
- **Graphiques** : 6 types de graphiques (barres, lignes, aires, camembert, matrice risques, jauge)
- **Animations** : Transitions douces, squelettes de chargement, micro-interactions

---

## ✨ Fonctionnalités clés

- ✅ **Interface 100% en français**
- ✅ **Design premium** avec palette sur mesure
- ✅ **Tableau de bord interactif** avec 6 types de graphiques
- ✅ **Gestion complète du cycle d'audit** (planification → exécution → clôture)
- ✅ **RBAC** (Contrôle d'accès basé sur les rôles)
- ✅ **Score de conformité** calculé automatiquement
- ✅ **Matrice des risques** (Probabilité × Impact)
- ✅ **Graphes de tendances** et jauge de conformité
- ✅ **Documentation Swagger** interactive
- ✅ **Données de démonstration** (seed)
- ✅ **Responsive design** (mobile, tablette, desktop)
- ✅ **Mode sombre** (barre latérale foncée)
- ✅ **Vérification d'email** et réinitialisation de mot de passe

---

<p align="center">Développé avec ❤️ — Audit Pro Management System</p>
