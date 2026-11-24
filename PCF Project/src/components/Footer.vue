<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <div class="brand-footer">
          <div class="brand-icon-sm">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="3" />
              <rect x="9" y="9" width="6" height="6" />
            </svg>
          </div>
          <strong>PCForge / ConfigMaster TN</strong>
        </div>
        <p class="footer-desc">
          Application web d'exploration de composants PC, comparateur de prix
          <strong>Tunisie (TND) vs International (EUR / USD)</strong>, configurateur sur-mesure
          et simulateur de compatibilité de jeux vidéo.
        </p>
        <p class="footer-team">
          Réalisé par : <strong>Amine Allah Fazai</strong> &amp; <strong>Arselen Brahmia</strong>
        </p>
      </div>

      <div class="footer-col">
        <h4>Navigation</h4>
        <ul class="footer-links">
          <li><RouterLink to="/">Accueil</RouterLink></li>
          <li><RouterLink to="/catalogue">Catalogue des Composants ({{ store.composants.length }})</RouterLink></li>
          <li><RouterLink to="/configurateur">Configurateur PC &amp; Test Jeux ({{ store.jeux.length }})</RouterLink></li>
          <li><RouterLink to="/favoris">Mes Favoris ({{ store.favoris.length }})</RouterLink></li>
          <li><RouterLink to="/contact-ajout">Ajouter un Composant / Contact</RouterLink></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Catégories</h4>
        <ul class="footer-links">
          <li><RouterLink to="/catalogue?categorie=Processeur">Processeurs (AMD &amp; Intel)</RouterLink></li>
          <li><RouterLink to="/catalogue?categorie=Carte Graphique">Cartes Graphiques (RTX &amp; Radeon)</RouterLink></li>
          <li><RouterLink to="/catalogue?categorie=Carte Mère">Cartes Mères (AM4, AM5, LGA1700)</RouterLink></li>
          <li><RouterLink to="/catalogue?categorie=Mémoire RAM">Mémoire RAM (DDR4 &amp; DDR5)</RouterLink></li>
          <li><RouterLink to="/catalogue?categorie=Stockage SSD">Stockage SSD NVMe M.2</RouterLink></li>
        </ul>
      </div>
    </div>

    <div class="container footer-bottom">
      <span>© 2026 PCForge TN — Mini-Projet Développement Web (Vue.js 3 + Vite)</span>
      <span>100% Responsive &amp; Fonctionnel • Taux de référence : 1 € ≈ 3.42 DT</span>
    </div>
  </footer>
</template>

<script setup>
import { store } from '../data/store.js'
</script>
