<template>
  <div class="page-contact container section">
    <div class="page-title-block">
      <h1>Contribuer au Catalogue &amp; Demander un Devis</h1>
      <p>
        Ajoutez une nouvelle référence matériel avec son prix en Tunisie (DT) et à l'international (€),
        ou contactez notre équipe pour un avis sur votre configuration.
      </p>
    </div>

    <div class="form-mode-tabs">
      <button
        type="button"
        class="tab-btn"
        :class="{ active: modeFormulaire === 'ajout' }"
        @click="changerMode('ajout')"
      >
        1. Ajouter un Composant au Catalogue
      </button>
      <button
        type="button"
        class="tab-btn"
        :class="{ active: modeFormulaire === 'contact' }"
        @click="changerMode('contact')"
      >
        2. Demander un Avis / Devis Config
      </button>
    </div>

    <div class="form-layout">
      <form class="form-card fade-in-up" novalidate @submit.prevent="soumettreFormulaire">
        <h2 v-if="modeFormulaire === 'ajout'">Nouvelle Référence Matériel (Tunisie &amp; Monde)</h2>
        <h2 v-else>Demande de Conseil ou Devis Configuration</h2>

        <div v-if="messageErreurGlobal" class="alert alert-error" role="alert">
          <strong>Formulaire incomplet :</strong> {{ messageErreurGlobal }}
        </div>

        <div v-if="messageSucces" class="alert alert-success" role="status">
          <strong>Confirmation :</strong> {{ messageSucces }}
          <div v-if="dernierComposantCree" class="success-actions">
            <RouterLink :to="`/composant/${dernierComposantCree.id}`" class="btn btn-primary btn-sm">
              Consulter la fiche créée →
            </RouterLink>
            <RouterLink to="/catalogue" class="btn btn-outline btn-sm">
              Ouvrir le catalogue
            </RouterLink>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-field">
            <label for="champ-auteur">Votre Nom &amp; Prénom *</label>
            <input
              id="champ-auteur"
              v-model="form.auteurNom"
              type="text"
              class="form-input"
              :class="{ 'input-error': erreurs.auteurNom }"
              placeholder="Ex: Amine Allah Fazai"
            />
            <span v-if="erreurs.auteurNom" class="error-text">{{ erreurs.auteurNom }}</span>
          </div>

          <div class="form-field">
            <label for="champ-email">Votre Adresse Email *</label>
            <input
              id="champ-email"
              v-model="form.auteurEmail"
              type="email"
              class="form-input"
              :class="{ 'input-error': erreurs.auteurEmail }"
              placeholder="Ex: etudiant@universite.tn"
            />
            <span v-if="erreurs.auteurEmail" class="error-text">{{ erreurs.auteurEmail }}</span>
          </div>
        </div>

        <template v-if="modeFormulaire === 'ajout'">
          <div class="form-row-2">
            <div class="form-field">
              <label for="champ-nom-comp">Désignation du Composant *</label>
              <input
                id="champ-nom-comp"
                v-model="form.nom"
                type="text"
                class="form-input"
                :class="{ 'input-error': erreurs.nom }"
                placeholder="Ex: AMD Radeon RX 7700 XT 12 Go"
              />
              <span v-if="erreurs.nom" class="error-text">{{ erreurs.nom }}</span>
            </div>

            <div class="form-field">
              <label for="champ-marque">Marque *</label>
              <input
                id="champ-marque"
                v-model="form.marque"
                type="text"
                class="form-input"
                :class="{ 'input-error': erreurs.marque }"
                placeholder="Ex: AMD, NVIDIA, MSI, ASUS, Corsair..."
              />
              <span v-if="erreurs.marque" class="error-text">{{ erreurs.marque }}</span>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-field">
              <label for="champ-categorie">Catégorie *</label>
              <select id="champ-categorie" v-model="form.categorie" class="form-select">
                <option value="Processeur">Processeur</option>
                <option value="Carte Graphique">Carte Graphique</option>
                <option value="Carte Mère">Carte Mère</option>
                <option value="Mémoire RAM">Mémoire RAM</option>
                <option value="Stockage SSD">Stockage SSD</option>
                <option value="Alimentation">Alimentation</option>
                <option value="Boîtier">Boîtier</option>
              </select>
            </div>

            <div class="form-field">
              <label for="champ-prix-tnd">Prix en Tunisie (DT) *</label>
              <input
                id="champ-prix-tnd"
                v-model="form.prixTND"
                type="number"
                min="1"
                class="form-input"
                :class="{ 'input-error': erreurs.prixTND }"
                placeholder="Ex: 1750"
              />
              <span v-if="erreurs.prixTND" class="error-text">{{ erreurs.prixTND }}</span>
            </div>

            <div class="form-field">
              <label for="champ-prix-eur">Prix Europe (€) *</label>
              <input
                id="champ-prix-eur"
                v-model="form.prixEUR"
                type="number"
                min="1"
                class="form-input"
                :class="{ 'input-error': erreurs.prixEUR }"
                placeholder="Ex: 439"
              />
              <span v-if="erreurs.prixEUR" class="error-text">{{ erreurs.prixEUR }}</span>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-field">
              <label for="champ-perf">Score Performance (10 à 100)</label>
              <input
                id="champ-perf"
                v-model="form.scorePerformance"
                type="number"
                min="10"
                max="100"
                class="form-input"
              />
            </div>

            <div class="form-field">
              <label for="champ-conso">Consommation (Watts)</label>
              <input
                id="champ-conso"
                v-model="form.consommationW"
                type="number"
                min="0"
                max="1000"
                class="form-input"
              />
            </div>

            <div class="form-field">
              <label for="champ-boutiques">Revendeurs en Tunisie</label>
              <input
                id="champ-boutiques"
                v-model="form.boutiquesTN"
                type="text"
                class="form-input"
                placeholder="Ex: MyTek, Tunisianet, SBS..."
              />
            </div>
          </div>
        </template>

        <div class="form-field">
          <label for="champ-resume">
            {{ modeFormulaire === 'ajout' ? 'Description technique & usage recommandé (min. 15 caractères) *' : 'Votre message ou détails de votre budget en Tunisie (min. 15 caractères) *' }}
          </label>
          <textarea
            id="champ-resume"
            v-model="form.resume"
            rows="4"
            class="form-input"
            :class="{ 'input-error': erreurs.resume }"
            placeholder="Précisez les caractéristiques clés, les performances attendues ou votre question..."
          ></textarea>
          <span v-if="erreurs.resume" class="error-text">{{ erreurs.resume }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-lg">
            {{ modeFormulaire === 'ajout' ? 'Publier dans le Catalogue' : 'Envoyer ma Demande' }}
          </button>
          <button type="button" class="btn btn-outline btn-lg" @click="remplirExemple">
            Pré-remplir un exemple valide
          </button>
        </div>
      </form>

      <aside class="form-sidebar">
        <div class="info-card">
          <h3>Règles de Validation</h3>
          <p>Contrôles appliqués automatiquement avant tout envoi :</p>
          <ul class="check-list">
            <li>• Vérification des champs obligatoires non vides</li>
            <li>• Validation syntaxique de l'adresse email (<code>@</code> et domaine)</li>
            <li>• Contrôle des valeurs numériques positives (DT et €)</li>
            <li>• Longueur minimale de la description (15 caractères)</li>
          </ul>
        </div>

        <div v-if="historiqueMessages.length > 0" class="info-card">
          <h3>Historique de la session ({{ historiqueMessages.length }})</h3>
          <ul class="history-list">
            <li v-for="(item, idx) in historiqueMessages" :key="idx">
              <strong>{{ item.titre }}</strong>
              <span>Par {{ item.auteur }} à {{ item.date }}</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { store, ajouterNouveauComposant, afficherNotification } from '../data/store.js'

const route = useRoute()
const modeFormulaire = ref('ajout')
const messageErreurGlobal = ref('')
const messageSucces = ref('')
const dernierComposantCree = ref(null)
const historiqueMessages = ref([])

const form = reactive({
  auteurNom: '',
  auteurEmail: '',
  nom: '',
  marque: '',
  categorie: 'Carte Graphique',
  prixTND: '',
  prixEUR: '',
  scorePerformance: 85,
  consommationW: 220,
  boutiquesTN: 'MyTek, Tunisianet, MegaPC',
  resume: ''
})

const erreurs = reactive({
  auteurNom: '',
  auteurEmail: '',
  nom: '',
  marque: '',
  prixTND: '',
  prixEUR: '',
  resume: ''
})

function effacerErreurs() {
  Object.keys(erreurs).forEach(k => { erreurs[k] = '' })
  messageErreurGlobal.value = ''
}

function changerMode(nouveauMode) {
  modeFormulaire.value = nouveauMode
  effacerErreurs()
  messageSucces.value = ''
  if (nouveauMode === 'contact' && !form.resume) {
    preremplirDevisConfigActuelle()
  }
}

function preremplirDevisConfigActuelle() {
  const pieces = Object.entries(store.maConfig)
    .map(([cat, id]) => {
      const c = store.composants.find(item => item.id === id)
      return c ? `${cat}: ${c.nom} (${c.prixTND} DT)` : null
    })
    .filter(Boolean)

  if (pieces.length > 0) {
    const totalDT = Object.values(store.maConfig)
      .filter(Boolean)
      .map(id => store.composants.find(item => item.id === id))
      .filter(Boolean)
      .reduce((acc, c) => acc + c.prixTND, 0)

    form.resume = `Bonjour, je souhaite un avis et un devis pour ma configuration PC (${totalDT} DT en Tunisie) :\n- ` + pieces.join('\n- ')
  }
}

onMounted(() => {
  if (route.query.mode === 'devis') {
    modeFormulaire.value = 'contact'
    preremplirDevisConfigActuelle()
    afficherNotification('Votre configuration PC a été importée automatiquement dans le message.')
  }
})

function validerFormulaire() {
  effacerErreurs()
  let estValide = true

  if (!form.auteurNom || form.auteurNom.trim().length < 2) {
    erreurs.auteurNom = 'Veuillez saisir votre nom complet (au moins 2 caractères).'
    estValide = false
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.auteurEmail || !regexEmail.test(form.auteurEmail.trim())) {
    erreurs.auteurEmail = 'Veuillez saisir une adresse email valide (ex: nom@domaine.tn).'
    estValide = false
  }

  if (modeFormulaire.value === 'ajout') {
    if (!form.nom || form.nom.trim().length < 3) {
      erreurs.nom = 'Le nom du composant est obligatoire (min. 3 caractères).'
      estValide = false
    }
    if (!form.marque || form.marque.trim().length < 2) {
      erreurs.marque = 'La marque est obligatoire (ex: AMD, NVIDIA, MSI...).'
      estValide = false
    }
    if (!form.prixTND || Number(form.prixTND) <= 0) {
      erreurs.prixTND = 'Veuillez indiquer un prix en Dinars Tunisiens supérieur à 0.'
      estValide = false
    }
    if (!form.prixEUR || Number(form.prixEUR) <= 0) {
      erreurs.prixEUR = 'Veuillez indiquer un prix en Euros supérieur à 0.'
      estValide = false
    }
  }

  if (!form.resume || form.resume.trim().length < 15) {
    erreurs.resume = 'Ce champ doit contenir au moins 15 caractères.'
    estValide = false
  }

  if (!estValide) {
    messageErreurGlobal.value = 'Certains champs sont vides ou invalides. Veuillez vérifier les indications en rouge.'
  }

  return estValide
}

function soumettreFormulaire() {
  messageSucces.value = ''
  dernierComposantCree.value = null

  if (!validerFormulaire()) {
    return
  }

  if (modeFormulaire.value === 'ajout') {
    const cree = ajouterNouveauComposant({ ...form })
    dernierComposantCree.value = cree
    messageSucces.value = `Le composant "${cree.nom}" (${cree.prixTND} DT / ${cree.prixEUR} €) a été ajouté au catalogue.`
    historiqueMessages.value.unshift({
      titre: `Ajout : ${cree.nom} (${cree.prixTND} DT)`,
      auteur: form.auteurNom,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    })
  } else {
    messageSucces.value = `Merci ${form.auteurNom}. Votre demande a été enregistrée, nous vous répondrons sur ${form.auteurEmail}.`
    afficherNotification('Votre demande a bien été envoyée')
    historiqueMessages.value.unshift({
      titre: 'Demande de conseil / devis PC',
      auteur: form.auteurNom,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    })
  }

  form.nom = ''
  form.marque = ''
  form.prixTND = ''
  form.prixEUR = ''
  form.resume = ''
}

function remplirExemple() {
  effacerErreurs()
  form.auteurNom = 'Amine Allah Fazai'
  form.auteurEmail = 'amine.fazai@etudiant.tn'
  if (modeFormulaire.value === 'ajout') {
    form.nom = 'AMD Radeon RX 7700 XT 12 Go GDDR6'
    form.marque = 'AMD'
    form.categorie = 'Carte Graphique'
    form.prixTND = 1740
    form.prixEUR = 429
    form.scorePerformance = 85
    form.consommationW = 245
    form.boutiquesTN = 'MyTek, MegaPC, SBS Informatique'
    form.resume = 'Carte graphique 12 Go très performante pour jouer en 1440p Ultra sur tous les titres récents.'
  } else {
    form.resume = 'Bonjour, je dispose d’un budget de 3400 DT en Tunisie pour une configuration dédiée au développement web et aux jeux en 1080p.'
  }
  afficherNotification('Exemple pré-rempli prêt à être validé')
}
</script>
