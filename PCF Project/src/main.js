import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Importation des pages de l'application (Minimum obligatoire : 4 pages)
import Accueil from './pages/Accueil.vue'
import Catalogue from './pages/Catalogue.vue'
import DetailComposant from './pages/DetailComposant.vue'
import Configurateur from './pages/Configurateur.vue'
import Favoris from './pages/Favoris.vue'
import ContactAjout from './pages/ContactAjout.vue'
import PageIntrouvable from './pages/PageIntrouvable.vue'

// Définition des routes de navigation + route 404 de sécurité
const routes = [
  { path: '/', name: 'Accueil', component: Accueil },
  { path: '/catalogue', name: 'Catalogue', component: Catalogue },
  { path: '/composant/:id', name: 'DetailComposant', component: DetailComposant },
  { path: '/configurateur', name: 'Configurateur', component: Configurateur },
  { path: '/favoris', name: 'Favoris', component: Favoris },
  { path: '/contact-ajout', name: 'ContactAjout', component: ContactAjout },
  { path: '/:pathMatch(.*)*', name: 'PageIntrouvable', component: PageIntrouvable }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
