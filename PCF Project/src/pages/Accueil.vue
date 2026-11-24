<template>
  <div class="page-accueil">
    <!-- Section Hero simple et directe -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content fade-in-up">
          <span class="hero-pill">Tunisie (DT) &amp; International (€ / $)</span>
          <h1 class="hero-title">
            Choisissez votre PC et vérifiez <span class="text-gradient">quels jeux tournent dessus</span>
          </h1>
          <p class="hero-subtitle">
            Pas besoin d'être un expert en informatique : comparez les prix des pièces en Tunisie et dans le monde,
            chargez un PC prêt en un clic et testez {{ store.jeux.length }} jeux vidéo populaires.
          </p>
          <div class="hero-buttons">
            <RouterLink to="/configurateur" class="btn btn-primary btn-lg">
              Mon PC &amp; Test des {{ store.jeux.length }} Jeux
            </RouterLink>
            <RouterLink to="/catalogue" class="btn btn-outline btn-lg">
              Explorer les {{ store.composants.length }} Pièces
            </RouterLink>
          </div>
        </div>

        <!-- Résumé simple de la configuration active -->
        <div class="hero-card fade-in-up">
          <div class="hero-card-header">
            <span>Votre PC Actuel</span>
            <span class="badge-tier" :class="rangMachine.classe">{{ rangMachine.titre }}</span>
          </div>

          <div class="hero-stats-grid">
            <div class="hero-stat-box">
              <span class="stat-label">Prix en Tunisie</span>
              <strong class="stat-val text-accent">{{ totalTND }} DT</strong>
            </div>
            <div class="hero-stat-box">
              <span class="stat-label">Prix en Europe</span>
              <strong class="stat-val">{{ totalEUR }} €</strong>
            </div>
            <div class="hero-stat-box">
              <span class="stat-label">Note du PC</span>
              <strong class="stat-val">{{ scoreGlobal }} / 100</strong>
            </div>
            <div class="hero-stat-box">
              <span class="stat-label">Jeux Compatibles</span>
              <strong class="stat-val text-success">{{ nbJeuxFluides }} / {{ store.jeux.length }}</strong>
            </div>
          </div>

          <RouterLink to="/configurateur" class="btn btn-primary btn-block">
            Voir les jeux compatibles avec ce PC
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Section 1 : 3 PC Prêts à l'emploi pour les débutants -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2>1. Vous débutez ? Choisissez un PC prêt en un clic</h2>
            <p>Sélectionnez votre budget pour charger automatiquement toutes les pièces compatibles.</p>
          </div>
        </div>

        <div class="presets-grid">
          <div class="preset-card fade-in-up">
            <div class="preset-top">
              <span class="preset-badge">Budget Étudiant</span>
              <span class="preset-score-pill">Note : 64/100</span>
            </div>
            <h3>PC Essentiel 1080p</h3>
            <p>Parfait pour les études, la programmation et les jeux comme Valorant, CS2, GTA V ou FC 25.</p>
            <div class="preset-price-compare">
              <strong>2 623 DT</strong>
              <span>(689 € en Europe)</span>
            </div>
            <button type="button" class="btn btn-outline btn-block" @click="appliquerPreset('budget')">
              Tester ce PC avec les jeux
            </button>
          </div>

          <div class="preset-card preset-featured fade-in-up">
            <div class="preset-top">
              <span class="preset-badge badge-hot">Le Plus Populaire</span>
              <span class="preset-score-pill">Note : 75/100</span>
            </div>
            <h3>PC Gamer &amp; IA (RTX 4060)</h3>
            <p>Fait tourner tous les jeux modernes en qualité Élevée/Ultra ainsi que les logiciels 3D et IA.</p>
            <div class="preset-price-compare">
              <strong>3 334 DT</strong>
              <span>(858 € en Europe)</span>
            </div>
            <button type="button" class="btn btn-primary btn-block" @click="appliquerPreset('equilibre')">
              Tester ce PC avec les jeux
            </button>
          </div>

          <div class="preset-card fade-in-up">
            <div class="preset-top">
              <span class="preset-badge">Performance Maximale</span>
              <span class="preset-score-pill">Note : 96/100</span>
            </div>
            <h3>PC Ultra 2K / 4K</h3>
            <p>Puissance extrême sans compromis pour jouer en Ultra pendant plusieurs années.</p>
            <div class="preset-price-compare">
              <strong>7 360 DT</strong>
              <span>(1 799 € en Europe)</span>
            </div>
            <button type="button" class="btn btn-outline btn-block" @click="appliquerPreset('ultra')">
              Tester ce PC avec les jeux
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2 : Explorer par Catégorie -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <div>
            <h2>2. Parcourir les Pièces par Catégorie</h2>
            <p>Cliquez sur une catégorie pour voir les modèles et leurs prix en Tunisie.</p>
          </div>
          <RouterLink to="/catalogue" class="btn btn-outline">Voir tout le catalogue</RouterLink>
        </div>

        <div class="categories-grid">
          <RouterLink
            v-for="cat in categoriesResume"
            :key="cat.nom"
            :to="`/catalogue?categorie=${encodeURIComponent(cat.nom)}`"
            class="category-card fade-in-up"
          >
            <span class="cat-tag">{{ cat.role }}</span>
            <h3>{{ cat.nom }}</h3>
            <p>Dès {{ cat.prixMin }} DT</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Section 3 : Composants Populaires -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2>3. Les Pièces les plus choisies</h2>
            <p>Survolez les boutons d'une carte ou cliquez sur le bouton info pour découvrir les détails.</p>
          </div>
          <RouterLink to="/catalogue" class="btn btn-outline">Tout voir ({{ store.composants.length }})</RouterLink>
        </div>

        <div class="cards-grid">
          <CarteComposant
            v-for="comp in composantsVedettes"
            :key="comp.id"
            :composant="comp"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store, chargerPresetConfig } from '../data/store.js'
import CarteComposant from '../components/CarteComposant.vue'

const router = useRouter()

const composantsVedettes = computed(() => {
  return [
    store.composants.find(c => c.id === 'gpu-rtx-4060-8gb'),
    store.composants.find(c => c.id === 'cpu-intel-i5-13400f'),
    store.composants.find(c => c.id === 'gpu-rx-7800-xt-16gb'),
    store.composants.find(c => c.id === 'ssd-crucial-p3-plus-1tb')
  ].filter(Boolean)
})

const listeCategories = [
  { nom: 'Processeur', role: 'Le Cerveau' },
  { nom: 'Carte Graphique', role: 'Pour les Jeux' },
  { nom: 'Carte Mère', role: 'La Base' },
  { nom: 'Mémoire RAM', role: 'Multitâche' },
  { nom: 'Stockage SSD', role: 'Disque Rapide' },
  { nom: 'Alimentation', role: 'Énergie' },
  { nom: 'Boîtier', role: 'Design & Air' }
]

const categoriesResume = computed(() => {
  return listeCategories.map(cat => {
    const items = store.composants.filter(c => c.categorie === cat.nom)
    const prixMin = items.length > 0 ? Math.min(...items.map(i => i.prixTND)) : 0
    return {
      ...cat,
      count: items.length,
      prixMin
    }
  })
})

const composantsConfigActuelle = computed(() => {
  return Object.values(store.maConfig)
    .filter(Boolean)
    .map(id => store.composants.find(c => c.id === id))
    .filter(Boolean)
})

const totalTND = computed(() => composantsConfigActuelle.value.reduce((acc, c) => acc + c.prixTND, 0))
const totalEUR = computed(() => composantsConfigActuelle.value.reduce((acc, c) => acc + c.prixEUR, 0))

const scoreGlobal = computed(() => {
  const cpu = store.composants.find(c => c.id === store.maConfig['Processeur'])
  const gpu = store.composants.find(c => c.id === store.maConfig['Carte Graphique'])
  const ram = store.composants.find(c => c.id === store.maConfig['Mémoire RAM'])
  const ssd = store.composants.find(c => c.id === store.maConfig['Stockage SSD'])
  if (!cpu || !gpu) return 0
  const sRam = ram ? ram.scorePerformance : 65
  const sSsd = ssd ? ssd.scorePerformance : 70
  return Math.round(gpu.scorePerformance * 0.50 + cpu.scorePerformance * 0.30 + sRam * 0.12 + sSsd * 0.08)
})

const rangMachine = computed(() => {
  const s = scoreGlobal.value
  if (s === 0) return { titre: 'À compléter', classe: 'tier-neutral' }
  if (s >= 90) return { titre: 'Excellent • 4K', classe: 'tier-s' }
  if (s >= 75) return { titre: 'Très Bon • 1440p', classe: 'tier-a' }
  if (s >= 60) return { titre: 'Bon • 1080p', classe: 'tier-b' }
  return { titre: 'Essentiel', classe: 'tier-c' }
})

const nbJeuxFluides = computed(() => {
  if (scoreGlobal.value === 0) return 0
  return store.jeux.filter(j => scoreGlobal.value >= j.scoreRequis - 6).length
})

function appliquerPreset(nomPreset) {
  chargerPresetConfig(nomPreset)
  router.push('/configurateur')
}
</script>
