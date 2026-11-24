<template>
  <div class="container section">
    <div class="empty-state fade-in-up" style="padding: 64px 24px;">
      <span class="hero-pill">Erreur 404</span>
      <h1 style="font-size: 2rem; margin-bottom: 8px;">Page introuvable</h1>
      <p style="color: var(--text-muted); max-width: 480px; margin-bottom: 16px;">
        L'adresse demandée n'existe pas ou a été déplacée. Utilisez les boutons ci-dessous pour revenir vers l'application.
      </p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
        <RouterLink to="/" class="btn btn-primary btn-lg">
          Retourner à l'Accueil
        </RouterLink>
        <RouterLink to="/catalogue" class="btn btn-outline btn-lg">
          Ouvrir le Catalogue
        </RouterLink>
        <RouterLink to="/configurateur" class="btn btn-outline btn-lg">
          Mon PC &amp; Jeux
        </RouterLink>
      </div>
    </div>
  </div>
</template>
