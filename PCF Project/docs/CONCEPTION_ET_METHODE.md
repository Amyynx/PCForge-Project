# 📐 Dossier de Conception, Croquis des Pages et Répartition des Tâches

**Projet :** PCForge / ConfigMaster TN  
**Binôme :** Amine Allah Fazai & Arselen Brahmia  
**Framework :** Vue.js 3 + Vite + Vue Router 4  

---

## 1. L'Idée du Projet (3 à 5 lignes — Étape 1 du Cahier des Charges)

**PCForge / ConfigMaster TN** est une application web destinée aux étudiants en informatique, gamers et passionnés de matériel PC en Tunisie. Elle permet d'explorer les composants PC par catégorie, de comparer les prix pratiqués en **Tunisie (en Dinars - DT)** avec les prix **internationaux (en Euros - € et Dollars - $)**, et d'assembler sa propre configuration PC. Grâce à un **simulateur de performance intégré**, l'application indique automatiquement la consommation électrique en Watts ainsi que la liste des **jeux vidéo** capables de tourner sur le PC configuré (avec estimation des FPS en 1080p, 1440p et 4K).

---

## 2. Liste des Fonctionnalités Utilisateur (Étape 2 du Cahier des Charges)

1. **Parcourir le catalogue** des composants PC (Processeurs, Cartes Graphiques, Cartes Mères, RAM, SSD, Alimentations, Boîtiers) chargés depuis `src/data/composants.json`.
2. **Rechercher et filtrer** les composants par mot-clé, par catégorie, par marque, par budget maximum en Dinars (DT), et les trier par prix ou performance.
3. **Comparer les prix Tunisie vs Monde** grâce au sélecteur de devise en haut de page (`🇹🇳 TND + 🌍 EUR`, `TND`, `EUR`, `USD`) et consulter l'écart en pourcentage sur la page de détail de chaque composant.
4. **Assembler son PC sur-mesure** dans le Configurateur (ou charger l'une des 3 configurations types en 1 clic) avec calcul automatique du prix total et de la puissance électrique en Watts.
5. **Simuler les performances en jeu** : voir en direct combien de FPS sa configuration obtient sur 8 jeux célèbres (*Valorant, CS2, GTA V, EA Sports FC 25, Elden Ring, Red Dead Redemption 2, Cyberpunk 2077, Alan Wake 2*) en 1080p, 1440p ou 4K.
6. **Gérer ses Favoris** : sauvegarder ou retirer des composants favoris (`localStorage`).
7. **Publier un composant ou envoyer une demande** via un formulaire vérifiant tous les champs (champs vides refusés, email valide, prix positifs, message d'au moins 15 caractères).
8. **Changer de thème visuel** entre le Mode Sombre Gaming et le Mode Clair.

---

## 3. Croquis des Pages / Wireframes (Étape 3 du Cahier des Charges)

### Page 1 : Accueil (`Accueil.vue`)
```text
+-----------------------------------------------------------------------+
| [⚡ PCForge TN]   Accueil | Composants | Mon PC | Favoris | Contact   |
|                                            [🇹🇳 TND + 🌍 EUR v] [☀️]  |
+-----------------------------------------------------------------------+
|  HERO : Explorez, comparez et assemblez    |  APERÇU CONFIG EN DIRECT |
|  votre PC sur-mesure                       |  Total TN : 3 309 DT     |
|  [🛠️ Monter mon PC] [🖥️ Catalogue (16)]   |  Total EU : 855 €        |
|                                            |  Jeux compatibles : 8/8  |
+-----------------------------------------------------------------------+
|  EXPLORER PAR CATÉGORIE                                               |
|  [🧠 CPU] [🎮 GPU] [🔌 Carte Mère] [⚡ RAM] [💾 SSD] [🔋 PSU] [🖥️ Case]|
+-----------------------------------------------------------------------+
|  3 CONFIGURATIONS PRÊTES EN 1 CLIC                                    |
|  [ Budget 1080p ~2623 DT ] [ Gamer RTX 4060 ~3309 DT ] [ Ultra 4K ]   |
+-----------------------------------------------------------------------+
|  PIED DE PAGE : Amine Allah Fazai & Arselen Brahmia | Liens rapides   |
+-----------------------------------------------------------------------+
```

### Page 2 : Catalogue des Composants (`Catalogue.vue`)
```text
+-----------------------------------------------------------------------+
|  BARRE DE RECHERCHE & FILTRES                                         |
|  [🔍 Rechercher: RTX, Ryzen... ] [Marque v] [Tri v] [Budget: 3000 DT] |
|  (Toutes) (Processeur) (Carte Graphique) (Carte Mère) (RAM) (SSD)...  |
+-----------------------------------------------------------------------+
|  GRILLE DE CARTES (Composant réutilisé : CarteComposant.vue)          |
|  +--------------------+  +--------------------+  +------------------+ |
|  | [GPU] [NVIDIA] [★] |  | [CPU] [Intel]  [☆] |  | [GPU] [AMD]  [☆] | |
|  |   (Image SVG GPU)  |  |   (Image SVG CPU)  |  |  (Image SVG GPU) | |
|  | RTX 4060 8 Go      |  | Core i5-13400F     |  | RX 7800 XT 16 Go | |
|  | 🇹🇳 1290 DT / 319 € |  | 🇹🇳 725 DT / 195 €  |  | 🇹🇳 2150 DT / 529€| |
|  | [Détails] [+ PC]   |  | [Détails] [+ PC]   |  | [Détails] [+ PC] | |
|  +--------------------+  +--------------------+  +------------------+ |
+-----------------------------------------------------------------------+
```

### Page 3 : Détail d'un Composant (`DetailComposant.vue`)
```text
+-----------------------------------------------------------------------+
|  [← Retour au Catalogue]                     [🛠️ Voir Configurateur] |
+-----------------------------------------------------------------------+
|  VISUEL & SCORES           |  TITRE & RÉSUMÉ DU COMPOSANT             |
|  [Image SVG Grand Format]  |  +-------------------------------------+ |
|  Indice Perf : [====89%]   |  | COMPARATEUR TUNISIE vs MONDE        | |
|  Consommation : 115 W      |  | 🇹🇳 1290 DT | 🇪🇺 319 € | 🇺🇸 329 $    | |
|                            |  | Boutiques : MyTek, Tunisianet...    | |
|                            |  +-------------------------------------+ |
|                            |  [🛠️ Ajouter à mon PC] [★ Favoris]       |
|                            |  [Fiche Technique]  [Points Forts]       |
+-----------------------------------------------------------------------+
```

### Page 4 : Configurateur PC & Simulateur de Jeux (`Configurateur.vue`)
```text
+-----------------------------------------------------------------------+
|  BARRE PRESETS : [Budget 1080p] [Gamer RTX 4060] [Ultra 4K] [Vider]   |
+-----------------------------------------------------------------------+
|  1. VOS 7 COMPOSANTS PC                 |  2. BILAN PRIX & PUISSANCE  |
|  🧠 Processeur : [i5-13400F - 725 DT v] |  🇹🇳 Total TN : 3 309 DT     |
|  🎮 Carte Graph: [RTX 4060 - 1290 DT v] |  🇪🇺 Total EU : 855 €        |
|  🔌 Carte Mère : [MSI B550M - 420 DT v] |  ⚡ Conso : 335 W (PSU OK)  |
|  ⚡ Mémoire RAM: [16 Go DDR4 - 175 DTv] |  Score Gaming : ( 74 / 100 )|
+-----------------------------------------------------------------------+
|  3. QUELS JEUX PEUVENT TOURNER SUR VOTRE PC ?   [1080p] [1440p] [4K]  |
|  +---------------------------------+ +------------------------------+ |
|  | Valorant        🟢 Ultra Fluide | | Cyberpunk 2077 🟡 Jouable    | |
|  | ~234 FPS en 1080p [==========]  | | ~63 FPS en 1080p [=======  ] | |
|  +---------------------------------+ +------------------------------+ |
+-----------------------------------------------------------------------+
```

### Page 5 & 6 : Favoris (`Favoris.vue`) & Formulaire (`ContactAjout.vue`)
```text
+-----------------------------------------------------------------------+
|  FORMULAIRE VALIDÉ : (1. Ajouter un Composant) (2. Demander un Devis) |
|  Nom complet * : [__________________]  Email * : [__________________] |
|  Nom Composant*: [__________________]  Marque *: [__________________] |
|  Catégorie *   : [Carte Graphique v ]  Prix DT*: [1590] Prix €*: [399]|
|  Description * : [__________________________________________________] |
|  [➕ Publier dans le Catalogue]   [✨ Remplir un exemple de test]      |
+-----------------------------------------------------------------------+
```

---

## 4. Répartition du Travail dans le Binôme (Étape 4 du Cahier des Charges)

> **Règle importante du cahier des charges :** En binôme, les deux membres ont participé au code et chacun connaît l'intégralité du projet pour l'interrogation individuelle.

| Partie / Tâche du Projet | Responsable Principal | Participation & Revue |
| :--- | :--- | :--- |
| **1. Architecture Vue.js + Vite & Routage (`main.js`, `App.vue`)** | **Amine Allah Fazai** & **Arselen Brahmia** | Création commune du projet et définition des 6 routes Vue Router |
| **2. Base de données JSON (`composants.json`, `jeux.json`) & Images SVG (`assets/`)** | **Amine Allah Fazai** | Relevé des prix Tunisie (DT) vs Europe (€), caractéristiques et jeux |
| **3. État global (`store.js`), Devises, Favoris et `localStorage`** | **Arselen Brahmia** | Fonctions d'ajout au PC, calcul d'écart de prix TN/Monde et sauvegarde |
| **4. Composants Réutilisables (`Navbar.vue`, `Footer.vue`, `CarteComposant.vue`, `CarteJeu.vue`)** | **Amine Allah Fazai** | Création des cartes avec props Vue et menu responsive mobile |
| **5. Pages `Accueil.vue`, `Catalogue.vue` (Recherche & Filtres) et `DetailComposant.vue`** | **Amine Allah Fazai** | Filtres dynamiques (`computed`), barre de budget DT et comparateur de prix |
| **6. Pages `Configurateur.vue` (Simulateur Jeux FPS & Watts), `Favoris.vue` et `ContactAjout.vue` (Formulaire validé)** | **Arselen Brahmia** | Calcul des FPS en 1080p/1440p/4K, jauge Watts et validation JavaScript du formulaire |
| **7. Design CSS Responsive (`style.css`), Tests (Section 6) et Présentation PDF** | **Amine Allah Fazai** & **Arselen Brahmia** | Vérification mobile F12, zéro erreur console, captures d'écran et diapositives |

---

## 5. Guide de Réponses pour l'Interrogation Individuelle (Section 9 du PDF)

Voici les réponses exactes aux questions listées par l'enseignante à la page 5 du cahier des charges :

### Sur la conception
- **Pourquoi avez-vous choisi ce framework (Vue.js avec Vite) ?**  
  *Réponse :* Nous avons choisi **Vue.js 3 avec Vite** car sa syntaxe en composants monofichiers (`.vue` regroupant `<template>`, `<script setup>` et le style) est très claire, proche du HTML/JS standard, rapide à compiler et idéale pour organiser une application réactive en pages et composants réutilisables.
- **Qu'est-ce qu'un composant ? Montrez-en un que vous réutilisez.**  
  *Réponse :* Un composant est un bloc d'interface indépendant et réutilisable qui reçoit des données (via `defineProps`). Par exemple, **`src/components/CarteComposant.vue`** est réutilisé dans **4 pages différentes** (`Accueil.vue`, `Catalogue.vue`, `DetailComposant.vue` pour les produits similaires, et `Favoris.vue`), ainsi que `Navbar.vue`, `Footer.vue` et `CarteJeu.vue`.
- **Comment passe-t-on d'une page à l'autre ?**  
  *Réponse :* Grâce à la bibliothèque officielle **Vue Router** configurée dans `src/main.js`. Les liens utilisent `<RouterLink to="/catalogue">` (ou une route dynamique `/composant/:id`) et la page active s'affiche dans `<RouterView />` à l'intérieur de `src/App.vue` sans recharger toute la page web.
- **Où sont stockées vos données ?**  
  *Réponse :* Les données initiales sont stockées dans **`src/data/composants.json`** (16 composants PC avec prix en TND, EUR, USD) et **`src/data/jeux.json`** (8 jeux vidéo). Ensuite, **`src/data/store.js`** charge ces données dans un objet réactif `reactive()` et synchronise les choix de l'utilisateur (configuration PC, favoris, devise, nouveaux composants ajoutés) dans le **`localStorage`** du navigateur.

### Sur le contenu et le code
- **Comment fonctionne la recherche ou le filtre dans `Catalogue.vue` ?**  
  *Réponse :* Nous utilisons une propriété calculée **`computed` (`composantsFiltres`)** dans `src/pages/Catalogue.vue`. À chaque frappe dans le champ de recherche (`v-model="texteRecherche"`) ou changement de catégorie/marque/budget, `.filter()` et `.sort()` mettent automatiquement à jour la liste affichée.
- **Comment vérifiez-vous les champs du formulaire dans `ContactAjout.vue` ?**  
  *Réponse :* Dans `src/pages/ContactAjout.vue`, la fonction `validerFormulaire()` est appelée à la soumission (`@submit.prevent="soumettreFormulaire"`). Elle vérifie qu'aucun champ obligatoire n'est vide, teste l'adresse email avec une expression régulière (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), vérifie que les prix en Dinars et Euros sont strictement supérieurs à `0`, et que la description fait au moins `15` caractères. En cas d'erreur, un message explicite s'affiche sous chaque champ et en haut du formulaire.
- **Comment avez-vous rendu le site responsive ?**  
  *Réponse :* Dans `src/style.css`, nous utilisons **CSS Grid** avec `repeat(auto-fill, minmax(280px, 1fr))`, **Flexbox**, et deux **Media Queries** (`@media (max-width: 960px)` pour tablette et `@media (max-width: 768px)` pour téléphone). Sur téléphone, les grilles passent sur une seule colonne (`1fr`) et le menu de navigation se transforme en **menu hamburger déroulant** (`menuMobileOuvert`).
- **Astuce pour l'exercice en direct : « Changez en direct une couleur, un texte ou un bouton » :**  
  - *Changer la couleur principale de tout le site :* Ouvrez `src/style.css` à la **ligne 18** et modifiez `--color-primary: #3b82f6;` (par exemple en `#10b981` pour du vert émeraude ou `#e11d48` pour du rouge).
  - *Changer un texte sur la page d'accueil :* Ouvrez `src/pages/Accueil.vue` à la **ligne 7** et modifiez le titre `<h1>`.
