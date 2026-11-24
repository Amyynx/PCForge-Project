<template>
  <div class="page-favoris container section">
    <div class="page-title-block">
      <h1>Mes Composants Favoris ({{ composantsFavoris.length }})</h1>
      <p>
        Retrouvez ici les composants que vous avez sauvegardés pour suivre leurs tarifs en Tunisie
        et à l'international ou les intégrer à votre configuration.
      </p>
    </div>

    <div v-if="composantsFavoris.length > 0">
      <div class="results-bar">
        <span>
          Valeur cumulée de votre sélection :
          <strong>{{ totalFavorisTND }} DT</strong> (Tunisie) / <strong>{{ totalFavorisEUR }} €</strong> (Europe)
        </span>
        <button type="button" class="btn btn-danger btn-sm" @click="viderTousLesFavoris">
          Vider la liste des favoris
        </button>
      </div>

      <div class="cards-grid">
        <CarteComposant
          v-for="comp in composantsFavoris"
          :key="comp.id"
          :composant="comp"
        />
      </div>
    </div>

    <div v-else class="empty-state">
      <h3>Votre sélection de favoris est vide</h3>
      <p>
        Cliquez sur l'icône étoile en haut à droite de n'importe quelle carte de composant dans le catalogue
        pour le conserver ici.
      </p>
      <RouterLink to="/catalogue" class="btn btn-primary">
        Explorer le Catalogue des Composants
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, afficherNotification } from '../data/store.js'
import CarteComposant from '../components/CarteComposant.vue'

const composantsFavoris = computed(() => {
  return store.composants.filter(c => store.favoris.includes(c.id))
})

const totalFavorisTND = computed(() => {
  return composantsFavoris.value.reduce((acc, c) => acc + c.prixTND, 0)
})

const totalFavorisEUR = computed(() => {
  return composantsFavoris.value.reduce((acc, c) => acc + c.prixEUR, 0)
})

function viderTousLesFavoris() {
  store.favoris.splice(0, store.favoris.length)
  afficherNotification('Liste des favoris vidée')
}
</script>
