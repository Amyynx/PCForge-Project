<template>
  <article class="card-composant fade-in-up" :class="{ 'card-selected': estDansMaConfig }">
    <!-- Photo du produit + Badge Catégorie + Bouton Favori discret -->
    <div class="card-media">
      <RouterLink :to="`/composant/${composant.id}`" class="card-img-wrapper">
        <img
          :src="imageSource"
          :alt="composant.nom"
          class="card-img"
          loading="lazy"
          @error="basculerSurSvgLocal"
        />
        <div class="card-media-overlay">
          <span class="badge-categorie">{{ composant.categorie }}</span>
        </div>
      </RouterLink>

      <!-- Bouton Favori à révélation de texte au survol -->
      <button
        type="button"
        class="btn-reveal btn-fav-floating"
        :class="{ active: enFavori }"
        @click="basculerFavori(composant.id)"
        :aria-label="enFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" :fill="enFavori ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span class="reveal-label">{{ enFavori ? 'Sauvegardé' : 'Favori' }}</span>
      </button>
    </div>

    <!-- Vue principale ultra-simple : Nom + Prix principal -->
    <div class="card-body">
      <div class="card-brand-line">{{ composant.marque }} • {{ composant.gamme }}</div>
      <RouterLink :to="`/composant/${composant.id}`" class="card-title-link">
        <h3 class="card-title">{{ composant.nom }}</h3>
      </RouterLink>

      <!-- Prix épuré en un coup d'œil -->
      <div class="card-price-main">
        <strong class="price-tnd" v-if="store.devise !== 'EUR' && store.devise !== 'USD'">
          {{ composant.prixTND }} DT
        </strong>
        <span class="price-world-pill" v-if="store.devise === 'TND_EUR' || store.devise === 'EUR'">
          {{ composant.prixEUR }} €
        </span>
        <span class="price-world-pill" v-if="store.devise === 'USD'">
          {{ composant.prixUSD }} $
        </span>
      </div>

      <!-- Tiroir repliable (caché par défaut, s'ouvre en cliquant sur le bouton Info) -->
      <Transition name="drawer-slide">
        <div v-if="detailsOuverts" class="card-drawer">
          <p class="card-resume">{{ composant.resume }}</p>
          <div class="drawer-specs-row">
            <span>Indice : <strong>{{ composant.scorePerformance }}/100</strong></span>
            <span>{{ composant.puissanceFournieW ? composant.puissanceFournieW + ' W' : composant.consommationW + ' W' }}</span>
          </div>
          <div class="drawer-shops" v-if="composant.boutiquesTN">
            Dispo : {{ composant.boutiquesTN }}
          </div>
        </div>
      </Transition>
    </div>

    <!-- Pied de carte : 3 boutons icônes qui révèlent leur texte au survol -->
    <div class="card-footer">
      <!-- 1. Bouton pour déplier/replier l'aperçu rapide sur place -->
      <button
        type="button"
        class="btn-reveal btn-reveal-outline"
        :class="{ 'btn-active-drawer': detailsOuverts }"
        @click="detailsOuverts = !detailsOuverts"
        aria-label="Afficher ou masquer l'aperçu rapide"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <span class="reveal-label">{{ detailsOuverts ? 'Masquer info' : 'Aperçu rapide' }}</span>
      </button>

      <!-- 2. Bouton vers la page détail complète -->
      <RouterLink
        :to="`/composant/${composant.id}`"
        class="btn-reveal btn-reveal-outline"
        aria-label="Ouvrir la fiche complète"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span class="reveal-label">Fiche complète</span>
      </RouterLink>

      <!-- 3. Bouton Ajouter / Retirer du PC -->
      <button
        v-if="!estDansMaConfig"
        type="button"
        class="btn-reveal btn-reveal-primary"
        @click="ajouterAConfig(composant)"
        aria-label="Choisir pour mon PC"
      >
        <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" stroke-width="2.2" fill="none">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span class="reveal-label">Choisir pour mon PC</span>
      </button>

      <button
        v-else
        type="button"
        class="btn-reveal btn-reveal-success"
        @click="retirerDeConfig(composant.categorie)"
        aria-label="Retirer de mon PC"
      >
        <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" stroke-width="2.2" fill="none">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span class="reveal-label">Dans mon PC</span>
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  store,
  getImageComposant,
  getVisuelComposant,
  basculerFavori,
  estEnFavori,
  ajouterAConfig,
  retirerDeConfig
} from '../data/store.js'

const props = defineProps({
  composant: {
    type: Object,
    required: true
  }
})

const detailsOuverts = ref(false)
const imageSource = ref(getVisuelComposant(props.composant))

watch(() => props.composant, (nouveau) => {
  imageSource.value = getVisuelComposant(nouveau)
})

function basculerSurSvgLocal() {
  imageSource.value = getImageComposant(props.composant.image)
}

const enFavori = computed(() => estEnFavori(props.composant.id))
const estDansMaConfig = computed(() => store.maConfig[props.composant.categorie] === props.composant.id)
</script>
