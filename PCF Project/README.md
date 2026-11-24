# ⚡ PCForge / ConfigMaster TN — Mini-Projet Web

Application web responsive et interactive permettant d'explorer des composants PC par catégorie, de comparer les prix entre la **Tunisie (TND)** et le **marché international (EUR / USD)**, d'assembler sa propre configuration PC sur-mesure (avec calcul de la consommation en Watts) et d'estimer en temps réel quels **jeux vidéo** peuvent tourner sur le PC (en 1080p, 1440p et 4K).

---

## 👨‍💻 Membres du Binôme

- **Amine Allah Fazai**
- **Arselen Brahmia**

---

## 🛠️ Framework et Technologies Utilisés

- **Framework Applicatif :** **Vue.js 3** (Composition API `<script setup>`)
- **Outil de Build :** **Vite** (démarrage ultra-rapide)
- **Routage multi-pages :** **Vue Router 4** (`6 pages` distinctes)
- **Style & Responsive :** **CSS3 sur-mesure** avec Variables CSS (Thème Sombre / Clair) et Media Queries (`@media (max-width: 960px)` et `768px`)
- **Données & Persistance :** Fichiers JSON (`src/data/composants.json` et `src/data/jeux.json`) + sauvegarde automatique dans le `localStorage` du navigateur

---

## 🚀 Commandes pour Lancer l'Application

Assurez-vous d'avoir **Node.js** installé sur votre machine, puis ouvrez un terminal dans le dossier du projet :

```bash
# 1. Installer les dépendances (uniquement la première fois)
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Ouvrez ensuite le lien affiché dans le terminal (par défaut `http://localhost:5173`) dans votre navigateur.

---

## ✨ Liste des Fonctionnalités

1. **Architecture en 6 Pages avec Navigation & Pied de page réutilisés :**
   - `Accueil` (`/`) : Présentation du concept, aperçu en direct du PC en cours, exploration rapide par catégorie, et **3 configurations types (Budget, Gamer RTX 4060, Ultra 4K)** chargeables en un clic.
   - `Catalogue des Composants` (`/catalogue`) : Liste des 16 composants PC à partir de `composants.json`.
   - `Détail d'un Composant` (`/composant/:id`) : Fiche technique complète, analyse de l'écart de prix **Tunisie (DT) vs Europe (€) vs USA ($)**, boutiques locales (MyTek, Tunisianet, SBS, MegaPC) et modèles similaires.
   - `Configurateur PC & Simulateur de Jeux` (`/configurateur`) : Sélection des 7 pièces du PC, calcul automatique du coût total (DT / € / $), vérification de la puissance de l'alimentation en **Watts**, et **Simulateur de Jeux FPS** (1080p / 1440p / 4K).
   - `Mes Favoris` (`/favoris`) : Liste des composants sauvegardés avec calcul de la valeur cumulée et suppression en un clic.
   - `Ajouter un Composant / Contact` (`/contact-ajout`) : Formulaire complet avec **validation JavaScript des champs** (refus des champs vides, vérification du format d'email, prix positifs en DT et €, longueur minimale du message) permettant d'ajouter un nouveau composant directement dans le catalogue.

2. **Recherche et Filtres Multicritères :**
   - Recherche instantanée par mot-clé (nom, marque, technologie, boutique en Tunisie).
   - Filtre par catégorie (Processeur, Carte Graphique, Carte Mère, Mémoire RAM, Stockage SSD, Alimentation, Boîtier).
   - Filtre par marque et curseur de budget maximum en Dinars Tunisiens (DT).
   - Tri par prix croissant, prix décroissant ou indice de performance.

3. **Actions Utilisateur & Bonus :**
   - Ajout / retrait de composants dans le configurateur PC (`maConfig`).
   - Ajout / retrait des favoris (`★`).
   - Sélecteur global de devise dans la barre de navigation (**TND + EUR**, **TND seul**, **EUR seul**, **USD seul**).
   - Bascule **Mode Sombre / Mode Clair** (`☀️ / 🌙`).
   - Persistance complète via `localStorage`.

---

## 📁 Organisation des Dossiers

```text
FAZAI_BRAHMIA_MiniProjet/
├── index.html                  # Point d'entrée HTML (lang="fr")
├── package.json                # Dépendances Vue 3, Vue Router 4 et Vite
├── vite.config.js              # Configuration de Vite
├── README.md                   # Documentation du projet
├── docs/                       # Dossier exigé par le cahier des charges
│   └── CONCEPTION_ET_METHODE.md # Croquis des pages, répartition du binôme & préparation soutenance
└── src/
    ├── main.js                 # Initialisation de Vue et des routes
    ├── App.vue                 # Composant racine (Navbar + RouterView + Footer)
    ├── style.css               # Feuille de style responsive (Variables CSS + Media Queries)
    ├── assets/                 # Illustrations SVG locales des composants (100% hors-ligne)
    ├── data/                   # Données JSON et état global réactif
    │   ├── composants.json     # 16 composants avec prix Tunisie (TND) et Monde (EUR/USD)
    │   ├── jeux.json           # 8 jeux vidéo de référence pour le simulateur FPS
    │   └── store.js            # Gestion de la configuration, des favoris et de la devise
    ├── components/             # Composants réutilisés
    │   ├── Navbar.vue          # Menu responsive + sélecteur devise + mode sombre
    │   ├── Footer.vue          # Pied de page présent sur toutes les pages
    │   ├── CarteComposant.vue  # Carte réutilisée dans Accueil, Catalogue, Détail et Favoris
    │   └── CarteJeu.vue        # Carte réutilisée pour chaque jeu dans le simulateur FPS
    └── pages/                  # Les pages de l'application
        ├── Accueil.vue
        ├── Catalogue.vue
        ├── DetailComposant.vue
        ├── Configurateur.vue
        ├── Favoris.vue
        └── ContactAjout.vue
```
