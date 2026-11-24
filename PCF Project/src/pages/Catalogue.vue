<template>
  <div class="page-catalogue container section">
    <div class="page-title-block">
      <h1>Catalogue des Pièces PC ({{ store.composants.length }})</h1>
      <p>
        Choisissez une catégorie, une gamme de prix (Entrée, Milieu ou Haut de gamme) ou tapez un nom.
      </p>
    </div>

    <!-- Barre principale ultra simple : Recherche + Filtre Gamme rapide + Bouton Filtres avancés -->
    <div class="simple-search-bar">
      <input
        id="input-recherche"
        v-model="texteRecherche"
        type="text"
        class="form-input search-input-lg"
        placeholder="Rechercher une pièce (ex: RTX 4060, RTX 4090, Ryzen 5, DDR5, SSD 2 To...)"
        aria-label="Rechercher un composant"
      />

      <select
        v-model="gammeSelectionnee"
        class="form-select"
        style="width: auto; min-width: 210px; border-radius: 99px; background-color: var(--bg-card);"
        aria-label="Filtrer par gamme de prix"
      >
        <option value="Toutes">Toutes les gammes de prix</option>
        <option value="Entrée de gamme">Entrée de gamme (Budget)</option>
        <option value="Milieu de gamme">Milieu de gamme (Équilibré)</option>
        <option value="Haut de gamme">Haut de gamme (Pro / Ultra)</option>
      </select>

      <button
        type="button"
        class="btn btn-outline"
        @click="afficherFiltresAvances = !afficherFiltresAvances"
      >
        {{ afficherFiltresAvances ? 'Masquer les filtres' : 'Plus de filtres (Marque, Budget, Tri)' }}
      </button>

      <button
        v-if="filtresActifs"
        type="button"
        class="btn btn-danger btn-sm"
        @click="reinitialiserFiltres"
      >
        Réinitialiser
      </button>
    </div>

    <!-- Tiroir repliable pour les filtres avancés (Marque, Tri, Budget) -->
    <Transition name="drawer-slide">
      <div v-if="afficherFiltresAvances" class="advanced-filters-drawer">
        <div class="filter-group">
          <label for="select-marque">Marque</label>
          <select id="select-marque" v-model="marqueSelectionnee" class="form-select">
            <option value="Toutes">Toutes les marques ({{ marquesDisponibles.length }})</option>
            <option v-for="marque in marquesDisponibles" :key="marque" :value="marque">
              {{ marque }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="select-tri">Trier par</label>
          <select id="select-tri" v-model="triSelectionne" class="form-select">
            <option value="defaut">Recommandés</option>
            <option value="prix-asc">Prix le plus bas</option>
            <option value="prix-desc">Prix le plus élevé</option>
            <option value="perf-desc">Meilleure note (/100)</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="range-budget">Budget Maximum : <strong>{{ budgetMaxTND }} DT</strong></label>
          <input
            id="range-budget"
            v-model.number="budgetMaxTND"
            type="range"
            min="80"
            max="8000"
            step="50"
            class="range-slider"
          />
        </div>
      </div>
    </Transition>

    <!-- Onglets par Catégorie toujours visibles et simples -->
    <div class="category-tabs">
      <button
        v-for="cat in categoriesAvecCompteur"
        :key="cat.nom"
        type="button"
        class="tab-btn"
        :class="{ active: categorieSelectionnee === cat.nom }"
        @click="changerCategorie(cat.nom)"
      >
        {{ cat.nom }} ({{ cat.total }})
      </button>
    </div>

    <!-- Compteur de résultats -->
    <div class="results-bar">
      <span>
        <strong>{{ composantsFiltres.length }}</strong> pièce(s) affichée(s) sur {{ store.composants.length }}
      </span>
      <RouterLink to="/configurateur" class="link-accent">
        Voir mon PC &amp; Tester les {{ store.jeux.length }} Jeux →
      </RouterLink>
    </div>

    <!-- Grille des composants -->
    <div v-if="composantsFiltres.length > 0" class="cards-grid">
      <CarteComposant
        v-for="comp in composantsFiltres"
        :key="comp.id"
        :composant="comp"
      />
    </div>

    <div v-else class="empty-state">
      <h3>Aucune pièce trouvée</h3>
      <p>Essayez d'effacer votre recherche ou d'augmenter le budget maximum.</p>
      <button type="button" class="btn btn-primary" @click="reinitialiserFiltres">
        Tout réafficher
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../data/store.js'
import CarteComposant from '../components/CarteComposant.vue'

const route = useRoute()
const router = useRouter()

const texteRecherche = ref('')
const categorieSelectionnee = ref('Toutes')
const gammeSelectionnee = ref('Toutes')
const marqueSelectionnee = ref('Toutes')
const triSelectionne = ref('defaut')
const budgetMaxTND = ref(8000)
const afficherFiltresAvances = ref(false)

const categoriesListe = [
  'Toutes',
  'Processeur',
  'Carte Graphique',
  'Carte Mère',
  'Mémoire RAM',
  'Stockage SSD',
  'Alimentation',
  'Boîtier'
]

const categoriesAvecCompteur = computed(() => {
  return categoriesListe.map(nom => {
    const total = nom === 'Toutes'
      ? store.composants.length
      : store.composants.filter(c => c.categorie === nom).length
    return { nom, total }
  })
})

onMounted(() => {
  if (route.query.categorie && categoriesListe.includes(route.query.categorie)) {
    categorieSelectionnee.value = route.query.categorie
  }
})

watch(() => route.query.categorie, (nouvelleCat) => {
  if (nouvelleCat && categoriesListe.includes(nouvelleCat)) {
    categorieSelectionnee.value = nouvelleCat
  } else if (!nouvelleCat) {
    categorieSelectionnee.value = 'Toutes'
  }
})

function changerCategorie(cat) {
  categorieSelectionnee.value = cat
  if (cat === 'Toutes') {
    router.replace({ path: '/catalogue', query: {} })
  } else {
    router.replace({ path: '/catalogue', query: { categorie: cat } })
  }
}

const marquesDisponibles = computed(() => {
  const marques = new Set(store.composants.map(c => c.marque))
  return Array.from(marques).sort()
})

const filtresActifs = computed(() => {
  return (
    texteRecherche.value.trim() !== '' ||
    categorieSelectionnee.value !== 'Toutes' ||
    gammeSelectionnee.value !== 'Toutes' ||
    marqueSelectionnee.value !== 'Toutes' ||
    triSelectionne.value !== 'defaut' ||
    budgetMaxTND.value < 8000
  )
})

function reinitialiserFiltres() {
  texteRecherche.value = ''
  categorieSelectionnee.value = 'Toutes'
  gammeSelectionnee.value = 'Toutes'
  marqueSelectionnee.value = 'Toutes'
  triSelectionne.value = 'defaut'
  budgetMaxTND.value = 8000
  router.replace({ path: '/catalogue', query: {} })
}

const composantsFiltres = computed(() => {
  const q = texteRecherche.value.trim().toLowerCase()

  let liste = store.composants.filter(comp => {
    const correspondTexte =
      !q ||
      comp.nom.toLowerCase().includes(q) ||
      comp.resume.toLowerCase().includes(q) ||
      comp.marque.toLowerCase().includes(q) ||
      comp.categorie.toLowerCase().includes(q) ||
      (comp.boutiquesTN && comp.boutiquesTN.toLowerCase().includes(q))

    const correspondCategorie =
      categorieSelectionnee.value === 'Toutes' ||
      comp.categorie === categorieSelectionnee.value

    const correspondGamme =
      gammeSelectionnee.value === 'Toutes' ||
      comp.gamme === gammeSelectionnee.value

    const correspondMarque =
      marqueSelectionnee.value === 'Toutes' ||
      comp.marque === marqueSelectionnee.value

    const correspondBudget = comp.prixTND <= budgetMaxTND.value

    return correspondTexte && correspondCategorie && correspondGamme && correspondMarque && correspondBudget
  })

  if (triSelectionne.value === 'prix-asc') {
    liste = [...liste].sort((a, b) => a.prixTND - b.prixTND)
  } else if (triSelectionne.value === 'prix-desc') {
    liste = [...liste].sort((a, b) => b.prixTND - a.prixTND)
  } else if (triSelectionne.value === 'perf-desc') {
    liste = [...liste].sort((a, b) => b.scorePerformance - a.scorePerformance)
  }

  return liste
})
</script>
