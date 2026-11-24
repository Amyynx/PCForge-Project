<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <!-- Logo épuré et moderne sans emoji -->
      <RouterLink to="/" class="brand" @click="menuMobileOuvert = false">
        <div class="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.2" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-title">PCForge <span class="badge-tn">TN</span></span>
          <span class="brand-subtitle">Comparateur &amp; Configurateur</span>
        </div>
      </RouterLink>

      <!-- Navigation claire et minimaliste -->
      <nav class="nav-links" :class="{ 'nav-open': menuMobileOuvert }">
        <RouterLink to="/" class="nav-item" @click="menuMobileOuvert = false">
          Accueil
        </RouterLink>
        <RouterLink to="/catalogue" class="nav-item" @click="menuMobileOuvert = false">
          Composants
          <span class="nav-pill-muted">{{ store.composants.length }}</span>
        </RouterLink>
        <RouterLink to="/configurateur" class="nav-item" @click="menuMobileOuvert = false">
          Configurateur &amp; Jeux
          <span class="nav-badge">{{ nbComposantsChoisis }}/7</span>
        </RouterLink>
        <RouterLink to="/favoris" class="nav-item" @click="menuMobileOuvert = false">
          Favoris
          <span v-if="store.favoris.length > 0" class="nav-badge badge-fav">{{ store.favoris.length }}</span>
        </RouterLink>
        <RouterLink to="/contact-ajout" class="nav-item" @click="menuMobileOuvert = false">
          Ajouter / Contact
        </RouterLink>
      </nav>

      <!-- Contrôles : Devise + Thème avec révélation du texte au survol -->
      <div class="nav-actions">
        <label for="select-devise" class="sr-only">Affichage des devises</label>
        <select
          id="select-devise"
          v-model="store.devise"
          class="currency-select"
          title="Comparer les prix en Tunisie (DT) et à l'international (€ / $)"
        >
          <option value="TND_EUR">TND (DT) + EUR (€)</option>
          <option value="TND">Tunisie (DT)</option>
          <option value="EUR">Europe (€)</option>
          <option value="USD">International ($)</option>
        </select>

        <!-- Bouton Thème : Icône seule, texte révélé au survol de la souris -->
        <button
          type="button"
          class="btn-reveal"
          @click="basculerTheme"
          :aria-label="store.modeSombre ? 'Activer le thème clair' : 'Activer le thème sombre'"
        >
          <svg v-if="store.modeSombre" viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" stroke-width="2" fill="none">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <span class="reveal-label">{{ store.modeSombre ? 'Thème Clair' : 'Thème Sombre' }}</span>
        </button>

        <!-- Menu Hamburger Mobile -->
        <button
          type="button"
          class="hamburger-btn"
          @click="menuMobileOuvert = !menuMobileOuvert"
          aria-label="Menu de navigation"
        >
          <svg v-if="!menuMobileOuvert" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, afficherNotification } from '../data/store.js'

const menuMobileOuvert = ref(false)

const nbComposantsChoisis = computed(() => {
  return Object.values(store.maConfig).filter(Boolean).length
})

function basculerTheme() {
  store.modeSombre = !store.modeSombre
  afficherNotification(store.modeSombre ? 'Thème sombre activé' : 'Thème clair activé')
}
</script>
