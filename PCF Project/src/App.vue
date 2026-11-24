<template>
  <div class="app-layout" :class="{ 'light-theme': !store.modeSombre }">
    <!-- Menu de navigation présent sur toutes les pages (Obligatoire) -->
    <Navbar />

    <!-- Notification visuelle lors d'une action utilisateur -->
    <Transition name="toast-fade">
      <div v-if="store.notification" class="toast-notification" role="status">
        <span>{{ store.notification }}</span>
        <button type="button" class="toast-close" @click="store.notification = ''" aria-label="Fermer">✕</button>
      </div>
    </Transition>

    <!-- Contenu dynamique de la page active avec transition douce -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Pied de page présent sur toutes les pages (Obligatoire) -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { store } from './data/store.js'
</script>
