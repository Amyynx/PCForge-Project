<template>
  <div class="page-configurateur container section">
    <div class="page-title-block">
      <h1>Mon PC &amp; Test des {{ store.jeux.length }} Jeux Vidéo</h1>
      <p>
        Choisissez vos pièces (ou chargez un PC prêt en un clic) pour voir le prix en Tunisie et les jeux compatibles.
      </p>
    </div>

    <!-- Barre de chargement rapide en 1 clic -->
    <div class="preset-toolbar">
      <span class="toolbar-label">Charger un PC prêt :</span>
      <div class="toolbar-buttons">
        <button type="button" class="btn btn-outline btn-sm" @click="chargerPresetConfig('budget')">
          PC Étudiant 1080p (2 623 DT)
        </button>
        <button type="button" class="btn btn-outline btn-sm" @click="chargerPresetConfig('equilibre')">
          PC Gamer RTX 4060 (3 334 DT)
        </button>
        <button type="button" class="btn btn-outline btn-sm" @click="chargerPresetConfig('ultra')">
          PC Ultra 4K (7 360 DT)
        </button>
        <button type="button" class="btn btn-danger btn-sm" @click="viderConfig">
          Tout vider
        </button>
      </div>
    </div>

    <div class="config-layout">
      <!-- Colonne gauche : Les 7 pièces expliquées simplement -->
      <div class="config-slots-panel">
        <h2>1. Les 7 Pièces de votre PC</h2>

        <div
          v-for="slot in listeSlots"
          :key="slot.categorie"
          class="slot-row"
          :class="{ 'slot-filled': getComposantChoisi(slot.categorie) }"
        >
          <div class="slot-header">
            <span class="slot-code-badge">{{ slot.code }}</span>
            <div class="slot-meta">
              <strong>{{ slot.categorie }} <small class="slot-role-hint">({{ slot.explication }})</small></strong>
              <span v-if="getComposantChoisi(slot.categorie)" class="slot-chosen-name">
                {{ getComposantChoisi(slot.categorie).nom }}
              </span>
              <span v-else class="slot-empty-text">Aucune pièce choisie</span>
            </div>
          </div>

          <div class="slot-controls">
            <select
              :aria-label="`Choisir ${slot.categorie}`"
              :value="store.maConfig[slot.categorie] || ''"
              class="form-select slot-select"
              @change="changerSlot(slot.categorie, $event.target.value)"
            >
              <option value="">-- Choisir {{ slot.categorie }} --</option>
              <option
                v-for="opt in getOptionsParCategorie(slot.categorie)"
                :key="opt.id"
                :value="opt.id"
              >
                {{ opt.nom }} — {{ opt.prixTND }} DT ({{ opt.prixEUR }} €)
              </option>
            </select>

            <div v-if="getComposantChoisi(slot.categorie)" class="slot-actions">
              <span class="slot-price-tag">
                {{ getComposantChoisi(slot.categorie).prixTND }} DT
              </span>
              <RouterLink
                :to="`/composant/${getComposantChoisi(slot.categorie).id}`"
                class="btn-reveal btn-reveal-outline"
                aria-label="Voir la fiche détail"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <span class="reveal-label">Détails</span>
              </RouterLink>
              <button
                type="button"
                class="btn-reveal btn-reveal-danger"
                aria-label="Retirer ce composant"
                @click="retirerDeConfig(slot.categorie)"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                <span class="reveal-label">Retirer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne droite : Score simple + Bouton pour déplier les détails techniques -->
      <aside class="config-summary-panel">
        <div class="summary-card">
          <h2>2. Note du PC &amp; Prix Total</h2>

          <!-- Jauge circulaire claire -->
          <div class="pc-score-hero">
            <div class="radial-gauge-box">
              <svg viewBox="0 0 120 120" class="radial-svg">
                <circle cx="60" cy="60" r="50" class="radial-bg" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  class="radial-progress"
                  :stroke="diagnosticScore.couleur"
                  :stroke-dasharray="314"
                  :stroke-dashoffset="314 - (314 * scoreGamingGlobal) / 100"
                />
              </svg>
              <div class="radial-center-text">
                <strong>{{ scoreGamingGlobal }}</strong>
                <span>/ 100</span>
              </div>
            </div>

            <div class="score-verdict">
              <span class="badge-tier" :class="diagnosticScore.classe">{{ diagnosticScore.rang }}</span>
              <h3>{{ diagnosticScore.titre }}</h3>
              <p>{{ diagnosticScore.conseilResolution }}</p>
            </div>
          </div>

          <!-- Prix Tunisie vs Monde -->
          <div class="summary-prices">
            <div class="sum-row">
              <span>Prix Total en Tunisie</span>
              <strong class="sum-tnd">{{ totalTND }} DT</strong>
            </div>
            <div class="sum-row">
              <span>Prix Total en Europe</span>
              <strong class="sum-world">{{ totalEUR }} €</strong>
            </div>
            <div class="sum-row">
              <span>Prix International</span>
              <strong class="sum-world">{{ totalUSD }} $</strong>
            </div>
          </div>

          <!-- Bouton pour afficher/masquer le détail technique du score et des Watts -->
          <button
            type="button"
            class="btn btn-outline btn-block btn-sm"
            style="margin-bottom: 14px;"
            @click="afficherDetailsScore = !afficherDetailsScore"
          >
            {{ afficherDetailsScore ? 'Masquer les détails techniques' : 'Comment est calculée cette note ? (Voir détails)' }}
          </button>

          <!-- Tiroir repliable pour les curieux (Sous-scores + Watts + Équilibre) -->
          <Transition name="drawer-slide">
            <div v-if="afficherDetailsScore" class="subscores-breakdown">
              <div class="subscore-item">
                <div class="subscore-label-row">
                  <span>Carte Graphique — Jeux (50%)</span>
                  <strong>{{ scoreGpu }} / 100</strong>
                </div>
                <div class="mini-progress-track">
                  <div class="mini-progress-fill" :style="{ width: scoreGpu + '%' }"></div>
                </div>
              </div>

              <div class="subscore-item">
                <div class="subscore-label-row">
                  <span>Processeur — Rapidité (30%)</span>
                  <strong>{{ scoreCpu }} / 100</strong>
                </div>
                <div class="mini-progress-track">
                  <div class="mini-progress-fill" :style="{ width: scoreCpu + '%' }"></div>
                </div>
              </div>

              <div class="subscore-item">
                <div class="subscore-label-row">
                  <span>Mémoire RAM &amp; Disque SSD (20%)</span>
                  <strong>{{ scoreRamSsd }} / 100</strong>
                </div>
                <div class="mini-progress-track">
                  <div class="mini-progress-fill" :style="{ width: scoreRamSsd + '%' }"></div>
                </div>
              </div>

              <div class="bottleneck-box">
                <strong>Équilibre :</strong> {{ diagnosticEquilibre }}
              </div>

              <div class="bottleneck-box">
                <strong>Électricité ({{ consommationTotaleW }} W) :</strong> {{ statutAlimentation.message }}
              </div>
            </div>
          </Transition>

          <!-- Actions Devis : Copier, Imprimer ou Demander un Avis (auto-rempli) -->
          <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <button
              type="button"
              class="btn btn-outline btn-sm"
              style="flex: 1;"
              @click="copierDevisTexte"
            >
              Copier le Devis
            </button>
            <button
              type="button"
              class="btn btn-outline btn-sm"
              style="flex: 1;"
              @click="imprimerDevis"
            >
              Imprimer / PDF
            </button>
          </div>

          <RouterLink to="/contact-ajout?mode=devis" class="btn btn-primary btn-block">
            Demander un Avis ou Devis sur ce PC
          </RouterLink>
        </div>
      </aside>
    </div>

    <!-- Section 3 : Les 50 Jeux Vidéo avec leurs vraies jaquettes -->
    <section class="games-simulator-section">
      <div class="simulator-header">
        <div>
          <h2>3. Quels jeux tournent sur ce PC ? ({{ jeuxFiltres.length }} jeux)</h2>
          <p>
            Cliquez sur n'importe quel jeu pour ouvrir ses détails techniques.
          </p>
        </div>

        <div class="simulator-controls">
          <input
            v-model="rechercheJeu"
            type="text"
            class="form-input game-search-input"
            placeholder="Chercher un jeu (ex: GTA, Cyberpunk, FC 25...)"
            aria-label="Rechercher un jeu"
          />

          <select v-model="filtreCategorieJeu" class="form-select game-filter-select" aria-label="Filtrer par catégorie de jeu">
            <option value="Tous">Tous les genres ({{ store.jeux.length }})</option>
            <option value="Fluides">Jeux Très Fluides sur mon PC</option>
            <option value="eSport">eSport &amp; Compétitif</option>
            <option value="AAA">Grands Jeux &amp; Monde Ouvert</option>
          </select>

          <div class="resolution-switcher">
            <button
              v-for="res in ['1080p', '1440p', '4K']"
              :key="res"
              type="button"
              class="res-btn"
              :class="{ active: resolutionChoisie === res }"
              @click="resolutionChoisie = res"
            >
              {{ res }}
            </button>
          </div>
        </div>
      </div>

      <!-- Grille des jeux (12 affichés par défaut + bouton pour déplier les 50) -->
      <div class="games-grid">
        <CarteJeu
          v-for="jeu in jeuxAffiches"
          :key="jeu.id"
          :jeu="jeu"
          :scoreMachine="scoreGamingGlobal"
          :resolution="resolutionChoisie"
        />
      </div>

      <!-- Bouton pour afficher les 50 jeux ou réduire la liste -->
      <div v-if="jeuxFiltres.length > 12" class="show-more-games-bar">
        <button
          type="button"
          class="btn btn-outline btn-lg"
          @click="afficherTousLesJeux = !afficherTousLesJeux"
        >
          {{ afficherTousLesJeux ? 'Réduire la liste à 12 jeux' : `Afficher les ${jeuxFiltres.length} jeux du catalogue` }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  store,
  retirerDeConfig,
  viderConfig,
  chargerPresetConfig,
  afficherNotification
} from '../data/store.js'
import CarteJeu from '../components/CarteJeu.vue'

const resolutionChoisie = ref('1080p')
const filtreCategorieJeu = ref('Tous')
const rechercheJeu = ref('')
const afficherDetailsScore = ref(false)
const afficherTousLesJeux = ref(false)

const listeSlots = [
  { categorie: 'Processeur', code: 'CPU', explication: 'Le cerveau du PC' },
  { categorie: 'Carte Graphique', code: 'GPU', explication: 'La puissance pour les jeux' },
  { categorie: 'Carte Mère', code: 'MB', explication: 'Relie toutes les pièces' },
  { categorie: 'Mémoire RAM', code: 'RAM', explication: 'Pour ouvrir plusieurs logiciels' },
  { categorie: 'Stockage SSD', code: 'SSD', explication: 'Mémoire pour Windows et vos jeux' },
  { categorie: 'Alimentation', code: 'PSU', explication: 'Fournit le courant électrique' },
  { categorie: 'Boîtier', code: 'CASE', explication: 'Protège et refroidit le PC' }
]

function getOptionsParCategorie(categorie) {
  return store.composants.filter(c => c.categorie === categorie)
}

function getComposantChoisi(categorie) {
  const id = store.maConfig[categorie]
  if (!id) return null
  return store.composants.find(c => c.id === id) || null
}

function changerSlot(categorie, nouvelId) {
  if (!nouvelId) {
    retirerDeConfig(categorie)
  } else {
    store.maConfig[categorie] = nouvelId
    const comp = store.composants.find(c => c.id === nouvelId)
    if (comp) {
      afficherNotification(`${comp.nom} choisi pour [${categorie}]`)
    }
  }
}

const listeComposantsChoisis = computed(() => {
  return listeSlots
    .map(s => getComposantChoisi(s.categorie))
    .filter(Boolean)
})

const totalTND = computed(() => listeComposantsChoisis.value.reduce((s, c) => s + c.prixTND, 0))
const totalEUR = computed(() => listeComposantsChoisis.value.reduce((s, c) => s + c.prixEUR, 0))
const totalUSD = computed(() => listeComposantsChoisis.value.reduce((s, c) => s + c.prixUSD, 0))

const consommationTotaleW = computed(() => {
  if (listeComposantsChoisis.value.length === 0) return 0
  return listeComposantsChoisis.value.reduce((s, c) => s + (c.consommationW || 0), 35)
})

const statutAlimentation = computed(() => {
  const psu = getComposantChoisi('Alimentation')
  const conso = consommationTotaleW.value
  const recoW = Math.ceil((conso * 1.35) / 50) * 50

  if (conso === 0) {
    return {
      classe: 'power-neutral',
      message: 'Choisissez des pièces pour calculer la puissance.'
    }
  }
  if (!psu) {
    return {
      classe: 'power-warn',
      message: `Alimentation conseillée : au moins ${Math.max(500, recoW)} W.`
    }
  }
  const puissancePsu = psu.puissanceFournieW || 650
  if (puissancePsu >= conso + 120) {
    return {
      classe: 'power-ok',
      message: `Votre alimentation (${puissancePsu}W) est parfaite.`
    }
  }
  return {
    classe: 'power-danger',
    message: `Votre alimentation (${puissancePsu}W) est un peu juste pour ${conso}W. Choisissez 850W.`
  }
})

const scoreGpu = computed(() => {
  const gpu = getComposantChoisi('Carte Graphique')
  return gpu ? gpu.scorePerformance : 0
})

const scoreCpu = computed(() => {
  const cpu = getComposantChoisi('Processeur')
  return cpu ? cpu.scorePerformance : 0
})

const scoreRamSsd = computed(() => {
  const ram = getComposantChoisi('Mémoire RAM')
  const ssd = getComposantChoisi('Stockage SSD')
  if (!ram && !ssd) return 0
  const r = ram ? ram.scorePerformance : 65
  const s = ssd ? ssd.scorePerformance : 70
  return Math.round(r * 0.6 + s * 0.4)
})

const scoreGamingGlobal = computed(() => {
  if (!scoreCpu.value || !scoreGpu.value) return 0
  const mem = scoreRamSsd.value || 68
  return Math.round(scoreGpu.value * 0.50 + scoreCpu.value * 0.30 + mem * 0.20)
})

const diagnosticScore = computed(() => {
  const s = scoreGamingGlobal.value
  if (s === 0) {
    return {
      rang: 'Incomplet',
      titre: 'Choisissez un Processeur et une Carte Graphique',
      conseilResolution: 'Ces 2 pièces permettent de calculer la note de votre PC.',
      classe: 'tier-neutral',
      couleur: '#64748b'
    }
  }
  if (s >= 90) {
    return {
      rang: 'Niveau Excellent',
      titre: 'PC Ultra Puissant (2K / 4K)',
      conseilResolution: 'Fait tourner les 50 jeux du catalogue en qualité maximale.',
      classe: 'tier-s',
      couleur: '#10b981'
    }
  }
  if (s >= 75) {
    return {
      rang: 'Niveau Très Bon',
      titre: 'PC Gamer Confortable (1080p & 2K)',
      conseilResolution: 'Tous les jeux actuels tournent de façon fluide.',
      classe: 'tier-a',
      couleur: '#3b82f6'
    }
  }
  if (s >= 60) {
    return {
      rang: 'Niveau Bon',
      titre: 'PC Gaming 1080p (Full HD)',
      conseilResolution: 'Parfait pour les jeux en ligne et la majorité des grands jeux en 1080p.',
      classe: 'tier-b',
      couleur: '#f59e0b'
    }
  }
  return {
    rang: 'Niveau Essentiel',
    titre: 'PC Études & Jeux Légers',
    conseilResolution: 'Adapté aux études, à Internet et aux jeux légers (Valorant, LoL, CS2).',
    classe: 'tier-c',
    couleur: '#ef4444'
  }
})

const diagnosticEquilibre = computed(() => {
  if (!scoreCpu.value || !scoreGpu.value) {
    return 'Sélectionnez un processeur et une carte graphique.'
  }
  const diff = Math.abs(scoreCpu.value - scoreGpu.value)
  if (diff <= 15) {
    return 'Le processeur et la carte graphique vont très bien ensemble.'
  }
  if (scoreGpu.value > scoreCpu.value + 15) {
    return 'La carte graphique est très puissante : un processeur un peu plus fort donnera encore plus de FPS.'
  }
  return 'Le processeur est très rapide et pourra supporter une carte graphique encore plus puissante.'
})

function genererTexteDevis() {
  const lignes = listeSlots.map(s => {
    const c = getComposantChoisi(s.categorie)
    return c ? `- ${s.categorie} : ${c.nom} (${c.prixTND} DT / ${c.prixEUR} €)` : `- ${s.categorie} : Non choisi`
  })
  return [
    '=== DEVIS CONFIGURATION PCFORGE TN ===',
    ...lignes,
    `--------------------------------------`,
    `Note du PC : ${scoreGamingGlobal.value}/100 (${diagnosticScore.value.titre})`,
    `Consommation estimée : ${consommationTotaleW.value} W`,
    `Total Tunisie : ${totalTND.value} DT`,
    `Total Europe : ${totalEUR.value} € (≈ ${totalUSD.value} $)`
  ].join('\n')
}

function copierDevisTexte() {
  const texte = genererTexteDevis()
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(texte).then(() => {
      afficherNotification('Récapitulatif de votre PC copié dans le presse-papiers !')
    }).catch(() => {
      afficherNotification('Devis généré prêt à partager.')
    })
  } else {
    afficherNotification('Devis généré prêt à partager.')
  }
}

function imprimerDevis() {
  window.print()
}

const jeuxFiltres = computed(() => {
  const q = rechercheJeu.value.trim().toLowerCase()
  return store.jeux.filter(j => {
    const matchTexte = !q || j.titre.toLowerCase().includes(q) || j.genre.toLowerCase().includes(q)
    if (!matchTexte) return false
    if (filtreCategorieJeu.value === 'eSport') return j.scoreRequis <= 56
    if (filtreCategorieJeu.value === 'AAA') return j.scoreRequis > 56
    if (filtreCategorieJeu.value === 'Fluides') {
      return scoreGamingGlobal.value >= j.scoreRequis - 4
    }
    return true
  })
})

const jeuxAffiches = computed(() => {
  if (afficherTousLesJeux.value || rechercheJeu.value.trim() !== '') {
    return jeuxFiltres.value
  }
  return jeuxFiltres.value.slice(0, 12)
})
</script>
