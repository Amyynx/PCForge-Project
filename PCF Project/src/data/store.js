import { reactive, watch } from 'vue'
import composantsInitiaux from './composants.json'
import jeuxListe from './jeux.json'

// Illustrations SVG locales de secours (si une photo externe ne charge pas hors-ligne)
import cpuImg from '../assets/cpu.svg'
import gpuImg from '../assets/gpu.svg'
import ramImg from '../assets/ram.svg'
import ssdImg from '../assets/ssd.svg'
import motherboardImg from '../assets/motherboard.svg'
import psuImg from '../assets/psu.svg'
import caseImg from '../assets/case.svg'

const imagesMap = {
  cpu: cpuImg,
  gpu: gpuImg,
  ram: ramImg,
  ssd: ssdImg,
  motherboard: motherboardImg,
  psu: psuImg,
  case: caseImg
}

function chargerLocalStorage(cle, valeurParDefaut) {
  try {
    const sauvegarde = localStorage.getItem(cle)
    return sauvegarde ? JSON.parse(sauvegarde) : valeurParDefaut
  } catch (e) {
    return valeurParDefaut
  }
}

const configVide = {
  'Processeur': null,
  'Carte Graphique': null,
  'Carte Mère': null,
  'Mémoire RAM': null,
  'Stockage SSD': null,
  'Alimentation': null,
  'Boîtier': null
}

// Clé v4 pour charger le catalogue complet (48 composants dans toutes les gammes + 50 jeux)
export const store = reactive({
  composants: chargerLocalStorage('pcforge_composants_v4', composantsInitiaux),
  jeux: jeuxListe,
  devise: chargerLocalStorage('pcforge_devise_v2', 'TND_EUR'),
  modeSombre: chargerLocalStorage('pcforge_theme_v3', false),
  favoris: chargerLocalStorage('pcforge_favoris_v2', ['gpu-rtx-4060-8gb', 'cpu-intel-i5-13400f']),
  maConfig: chargerLocalStorage('pcforge_maconfig_v2', {
    ...configVide,
    'Processeur': 'cpu-intel-i5-13400f',
    'Carte Graphique': 'gpu-rtx-4060-8gb',
    'Carte Mère': 'mb-gigabyte-b760m-ds3h',
    'Mémoire RAM': 'ram-corsair-16gb-ddr4',
    'Stockage SSD': 'ssd-crucial-p3-plus-1tb',
    'Alimentation': 'psu-msi-mag-a650bn',
    'Boîtier': 'case-msi-mag-forge-100r'
  }),
  notification: ''
})

watch(() => store.composants, (val) => localStorage.setItem('pcforge_composants_v4', JSON.stringify(val)), { deep: true })
watch(() => store.devise, (val) => localStorage.setItem('pcforge_devise_v2', JSON.stringify(val)))
watch(() => store.modeSombre, (val) => localStorage.setItem('pcforge_theme_v3', JSON.stringify(val)))
watch(() => store.favoris, (val) => localStorage.setItem('pcforge_favoris_v2', JSON.stringify(val)), { deep: true })
watch(() => store.maConfig, (val) => localStorage.setItem('pcforge_maconfig_v2', JSON.stringify(val)), { deep: true })

export function afficherNotification(texte) {
  store.notification = texte
  setTimeout(() => {
    if (store.notification === texte) {
      store.notification = ''
    }
  }, 3200)
}

export function getImageComposant(codeImage) {
  return imagesMap[codeImage] || cpuImg
}

// Retourne la photo haute définition du produit (avec repli automatique sur le SVG local)
export function getVisuelComposant(composant) {
  if (!composant) return cpuImg
  return composant.photoUrl || imagesMap[composant.image] || cpuImg
}

export function calculerEcartTunisieMonde(composant) {
  const tauxOfficiel = 3.42
  const equivalentEurEnTunisie = composant.prixTND / tauxOfficiel
  return Math.round(((equivalentEurEnTunisie - composant.prixEUR) / composant.prixEUR) * 100)
}

export function basculerFavori(idComposant) {
  const index = store.favoris.indexOf(idComposant)
  const comp = store.composants.find(c => c.id === idComposant)
  if (index === -1) {
    store.favoris.push(idComposant)
    afficherNotification(`Ajouté aux favoris : ${comp ? comp.nom : 'Composant'}`)
  } else {
    store.favoris.splice(index, 1)
    afficherNotification(`Retiré des favoris : ${comp ? comp.nom : 'Composant'}`)
  }
}

export function estEnFavori(idComposant) {
  return store.favoris.includes(idComposant)
}

export function ajouterAConfig(composant) {
  store.maConfig[composant.categorie] = composant.id
  afficherNotification(`${composant.nom} sélectionné pour [${composant.categorie}]`)
}

export function retirerDeConfig(categorie) {
  store.maConfig[categorie] = null
  afficherNotification(`Emplacement [${categorie}] libéré`)
}

export function viderConfig() {
  Object.keys(configVide).forEach(cat => {
    store.maConfig[cat] = null
  })
  afficherNotification('Configuration PC réinitialisée')
}

export function chargerPresetConfig(typePreset) {
  if (typePreset === 'budget') {
    store.maConfig = {
      'Processeur': 'cpu-ryzen-5-5600',
      'Carte Graphique': 'gpu-rx-6600-8gb',
      'Carte Mère': 'mb-msi-b550m-pro-vdh',
      'Mémoire RAM': 'ram-corsair-16gb-ddr4',
      'Stockage SSD': 'ssd-crucial-p3-plus-1tb',
      'Alimentation': 'psu-msi-mag-a650bn',
      'Boîtier': 'case-msi-mag-forge-100r'
    }
    afficherNotification('Configuration "Entrée de Gamme 1080p (2 623 DT)" chargée')
  } else if (typePreset === 'equilibre') {
    store.maConfig = {
      'Processeur': 'cpu-intel-i5-13400f',
      'Carte Graphique': 'gpu-rtx-4060-8gb',
      'Carte Mère': 'mb-gigabyte-b760m-ds3h',
      'Mémoire RAM': 'ram-corsair-16gb-ddr4',
      'Stockage SSD': 'ssd-crucial-p3-plus-1tb',
      'Alimentation': 'psu-msi-mag-a650bn',
      'Boîtier': 'case-msi-mag-forge-100r'
    }
    afficherNotification('Configuration "Gamer & IA RTX 4060 (3 334 DT)" chargée')
  } else if (typePreset === 'ultra') {
    store.maConfig = {
      'Processeur': 'cpu-ryzen-7-7800x3d',
      'Carte Graphique': 'gpu-rtx-4070-super',
      'Carte Mère': 'mb-asus-tuf-b650-plus',
      'Mémoire RAM': 'ram-kingston-32gb-ddr5',
      'Stockage SSD': 'ssd-samsung-990-pro-2tb',
      'Alimentation': 'psu-corsair-rm850e',
      'Boîtier': 'case-nzxt-h6-flow'
    }
    afficherNotification('Configuration "Ultra 2K/4K & Station IA (7 360 DT)" chargée')
  }
}

export function ajouterNouveauComposant(nouveau) {
  const mappingImages = {
    'Processeur': 'cpu',
    'Carte Graphique': 'gpu',
    'Carte Mère': 'motherboard',
    'Mémoire RAM': 'ram',
    'Stockage SSD': 'ssd',
    'Alimentation': 'psu',
    'Boîtier': 'case'
  }
  const photosParDefaut = {
    'Processeur': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=700&q=80',
    'Carte Graphique': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80',
    'Carte Mère': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80',
    'Mémoire RAM': 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=700&q=80',
    'Stockage SSD': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=700&q=80',
    'Alimentation': 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=700&q=80',
    'Boîtier': 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=700&q=80'
  }
  const composantComplet = {
    id: 'custom-' + Date.now(),
    nom: nouveau.nom,
    categorie: nouveau.categorie,
    marque: nouveau.marque,
    gamme: Number(nouveau.prixTND) > 1200 ? 'Haut de gamme' : Number(nouveau.prixTND) > 500 ? 'Milieu de gamme' : 'Entrée de gamme',
    prixTND: Number(nouveau.prixTND),
    prixEUR: Number(nouveau.prixEUR),
    prixUSD: Math.round(Number(nouveau.prixEUR) * 1.06),
    scorePerformance: Number(nouveau.scorePerformance) || 78,
    consommationW: Number(nouveau.consommationW) || 65,
    boutiquesTN: nouveau.boutiquesTN || 'Revendeurs Tunisie',
    image: mappingImages[nouveau.categorie] || 'cpu',
    photoUrl: nouveau.photoUrl || photosParDefaut[nouveau.categorie],
    resume: nouveau.resume,
    specifications: [
      `Catégorie : ${nouveau.categorie} (${nouveau.marque})`,
      `Prix en Tunisie : ${nouveau.prixTND} DT`,
      `Prix International : ${nouveau.prixEUR} €`,
      `Score de performance : ${nouveau.scorePerformance}/100`
    ],
    pointsForts: [
      'Composant ajouté via le catalogue collaboratif PCForge TN',
      `Disponible chez : ${nouveau.boutiquesTN || 'Revendeurs locaux'}`
    ],
    conseilMarcheTN: `Proposé par ${nouveau.auteurNom} (${nouveau.auteurEmail}).`
  }

  store.composants.unshift(composantComplet)
  afficherNotification(`Composant "${composantComplet.nom}" publié dans le catalogue`)
  return composantComplet
}
