<template>
  <article
    class="card-jeu fade-in-up"
    :class="{ 'jeu-expanded': detailsOuverts }"
    @click="detailsOuverts = !detailsOuverts"
    role="button"
    tabindex="0"
    @keydown.enter="detailsOuverts = !detailsOuverts"
  >
    <!-- Vraie jaquette officielle du jeu -->
    <div class="jeu-banner">
      <img
        v-if="jeu.imageUrl && !erreurImage"
        :src="jeu.imageUrl"
        :alt="jeu.titre"
        class="jeu-img"
        loading="lazy"
        @error="erreurImage = true"
      />
      <div v-else class="jeu-img-fallback" :style="{ background: jeu.couleur }">
        <span>{{ jeu.titre }}</span>
      </div>

      <!-- Verdict simple pour un utilisateur normal -->
      <span class="jeu-status-pill" :class="statutCompatibilite.classe">
        {{ statutCompatibilite.label }}
      </span>
    </div>

    <!-- Barre principale épurée : Titre + FPS + Flèche pour déplier -->
    <div class="jeu-content">
      <div class="jeu-title-row">
        <div class="jeu-title-group">
          <h4 class="jeu-titre">{{ jeu.titre }}</h4>
          <span class="jeu-genre">{{ jeu.genre }}</span>
        </div>

        <div class="fps-badge-box" :class="statutCompatibilite.classeTexte">
          <strong class="fps-big">{{ fpsEstimes > 0 ? `~${fpsEstimes}` : '--' }}</strong>
          <span class="fps-unit">FPS</span>
        </div>
      </div>

      <!-- Tiroir qui s'ouvre uniquement quand on clique sur la carte du jeu -->
      <Transition name="drawer-slide">
        <div v-if="detailsOuverts" class="jeu-drawer" @click.stop>
          <p class="jeu-desc">{{ jeu.description }}</p>
          <div class="fps-bar-track">
            <div
              class="fps-bar-fill"
              :class="statutCompatibilite.classe"
              :style="{ width: Math.min(100, Math.round((fpsEstimes / 180) * 100)) + '%' }"
            ></div>
          </div>
          <div class="jeu-reqs">
            <span>Résolution : <strong>{{ resolution }}</strong></span>
            <span>RAM : <strong>{{ jeu.ramRecommandeeGo }} Go</strong></span>
            <span>Disque : <strong>{{ jeu.stockageGo }} Go</strong></span>
          </div>
        </div>
      </Transition>

      <div class="jeu-expand-hint">
        <span>{{ detailsOuverts ? 'Masquer les détails' : 'Cliquer pour voir les détails' }}</span>
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          :class="{ 'rotate-180': detailsOuverts }"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  jeu: {
    type: Object,
    required: true
  },
  scoreMachine: {
    type: Number,
    required: true
  },
  resolution: {
    type: String,
    default: '1080p'
  }
})

const erreurImage = ref(false)
const detailsOuverts = ref(false)

const fpsEstimes = computed(() => {
  if (props.scoreMachine <= 0) return 0
  const facteurResolution =
    props.resolution === '1080p' ? 1.0 :
    props.resolution === '1440p' ? 0.72 : 0.45

  const ratioPerf = props.scoreMachine / props.jeu.scoreRequis
  return Math.max(18, Math.round(props.jeu.fpsBase1080p * ratioPerf * facteurResolution))
})

const statutCompatibilite = computed(() => {
  if (props.scoreMachine <= 0) {
    return {
      label: 'Choisir CPU + GPU',
      classe: 'statut-attente',
      classeTexte: ''
    }
  }
  if (fpsEstimes.value >= 75) {
    return {
      label: 'Très Fluide',
      classe: 'statut-ultra',
      classeTexte: 'text-success'
    }
  }
  if (fpsEstimes.value >= 45) {
    return {
      label: 'Jouable',
      classe: 'statut-moyen',
      classeTexte: 'text-warning'
    }
  }
  return {
    label: 'Ralentissements',
    classe: 'statut-faible',
    classeTexte: 'text-danger'
  }
})
</script>
