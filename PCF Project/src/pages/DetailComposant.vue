<template>
  <div class="page-detail container section">
    <div class="breadcrumb-bar">
      <RouterLink to="/catalogue" class="btn btn-outline btn-sm">
        ← Retour au Catalogue
      </RouterLink>
      <RouterLink to="/configurateur" class="btn btn-outline btn-sm">
        Ouvrir le Configurateur PC
      </RouterLink>
    </div>

    <div v-if="composant" class="detail-wrapper fade-in-up">
      <div class="detail-grid">
        <!-- Colonne gauche : Photo produit et indicateurs techniques -->
        <div class="detail-visual-box">
          <div class="detail-badges">
            <span class="badge-categorie">{{ composant.categorie }}</span>
            <span class="badge-marque">{{ composant.marque }}</span>
            <span class="badge-gamme">{{ composant.gamme }}</span>
          </div>

          <img
            :src="imageSource"
            :alt="composant.nom"
            class="detail-img"
            @error="basculerSurSvgLocal"
          />

          <div class="detail-score-bars">
            <div class="score-line">
              <div class="score-line-header">
                <span>Indice de Performance Matériel</span>
                <strong>{{ composant.scorePerformance }} / 100</strong>
              </div>
              <div class="fps-bar-track">
                <div
                  class="fps-bar-fill statut-ultra"
                  :style="{ width: composant.scorePerformance + '%' }"
                ></div>
              </div>
            </div>

            <div class="score-line">
              <div class="score-line-header">
                <span>{{ composant.puissanceFournieW ? 'Puissance Alimentation' : 'Enveloppe Thermique (TDP)' }}</span>
                <strong>{{ composant.puissanceFournieW ? composant.puissanceFournieW + ' W' : composant.consommationW + ' W' }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne droite : Détails, Comparatif Prix Tunisie vs Monde et Actions -->
        <div class="detail-info-box">
          <h1 class="detail-title">{{ composant.nom }}</h1>
          <p class="detail-lead">{{ composant.resume }}</p>

          <div class="price-comparison-card">
            <h3>Comparateur de Prix : Tunisie vs International</h3>
            <div class="price-comparison-grid">
              <div class="price-col">
                <span class="price-country">Marché Tunisien (TND)</span>
                <strong class="price-big-tnd">{{ composant.prixTND }} DT</strong>
                <span class="price-shops">Revendeurs : {{ composant.boutiquesTN }}</span>
              </div>
              <div class="price-col">
                <span class="price-country">Marché Européen (EUR)</span>
                <strong class="price-big-world">{{ composant.prixEUR }} €</strong>
                <span class="price-shops">Tarif moyen Europe</span>
              </div>
              <div class="price-col">
                <span class="price-country">Marché International (USD)</span>
                <strong class="price-big-world">{{ composant.prixUSD }} $</strong>
                <span class="price-shops">Prix public conseillé MSRP</span>
              </div>
            </div>

            <div class="price-analysis-note">
              <strong>Analyse comparative :</strong> Au taux de référence (1 € ≈ 3.42 DT), l'écart observé en Tunisie est de
              <strong>{{ ecartPourcent >= 0 ? '+' + ecartPourcent : ecartPourcent }}%</strong> (logistique, douane et TVA).
              <br />
              <em>Conseil d'achat : {{ composant.conseilMarcheTN }}</em>
            </div>
          </div>

          <div class="detail-actions">
            <button
              v-if="!estDansMaConfig"
              type="button"
              class="btn btn-primary btn-lg"
              @click="ajouterAConfig(composant)"
            >
              Ajouter à ma Configuration PC
            </button>
            <button
              v-else
              type="button"
              class="btn btn-success btn-lg"
              @click="retirerDeConfig(composant.categorie)"
            >
              Sélectionné dans mon PC (Retirer)
            </button>

            <button
              type="button"
              class="btn btn-outline btn-lg"
              @click="basculerFavori(composant.id)"
            >
              {{ enFavori ? 'Retirer des Favoris' : 'Sauvegarder en Favori' }}
            </button>
          </div>

          <div class="specs-columns">
            <div class="specs-box">
              <h3>Spécifications Techniques</h3>
              <ul>
                <li v-for="(spec, idx) in composant.specifications" :key="idx">
                  {{ spec }}
                </li>
              </ul>
            </div>

            <div class="specs-box">
              <h3>Points Forts</h3>
              <ul>
                <li v-for="(pt, idx) in composant.pointsForts" :key="idx">
                  {{ pt }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Produits similaires -->
      <div v-if="composantsSimilaires.length > 0" class="similar-section">
        <h2>Autres modèles de la catégorie « {{ composant.categorie }} »</h2>
        <div class="cards-grid">
          <CarteComposant
            v-for="sim in composantsSimilaires"
            :key="sim.id"
            :composant="sim"
          />
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <h2>Composant introuvable</h2>
      <p>Ce composant n'existe pas ou a été retiré du catalogue.</p>
      <RouterLink to="/catalogue" class="btn btn-primary">
        Retourner au Catalogue
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  store,
  getImageComposant,
  getVisuelComposant,
  basculerFavori,
  estEnFavori,
  ajouterAConfig,
  retirerDeConfig,
  calculerEcartTunisieMonde
} from '../data/store.js'
import CarteComposant from '../components/CarteComposant.vue'

const route = useRoute()

const composant = computed(() => {
  return store.composants.find(c => c.id === route.params.id)
})

const imageSource = ref(getVisuelComposant(composant.value))

watch(composant, (nouveau) => {
  imageSource.value = getVisuelComposant(nouveau)
})

function basculerSurSvgLocal() {
  if (composant.value) {
    imageSource.value = getImageComposant(composant.value.image)
  }
}

const enFavori = computed(() => composant.value ? estEnFavori(composant.value.id) : false)
const estDansMaConfig = computed(() => {
  if (!composant.value) return false
  return store.maConfig[composant.value.categorie] === composant.value.id
})

const ecartPourcent = computed(() => {
  if (!composant.value) return 0
  return calculerEcartTunisieMonde(composant.value)
})

const composantsSimilaires = computed(() => {
  if (!composant.value) return []
  return store.composants.filter(
    c => c.categorie === composant.value.categorie && c.id !== composant.value.id
  )
})
</script>
