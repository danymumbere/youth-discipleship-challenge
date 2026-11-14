// js/share.js
import { generateShareMessage } from './bible.js';
import { getProgress } from './storage.js';

/**
 * Constante utilisée pour la clé de stockage des événements de partage.
 */
const SHARE_EVENT_KEY = 'shareEvents';

/**
 * Constante pour le chemin de base des images de badges (si elles ne sont pas des data URLs).
 */
const BADGE_IMAGES_PATH = './assets/badges/';

/**
 * Construit un message partageable à partir d'un verset et du texte du défi quotidien.
 *
 * @param {object} verse - Objet contenant `reference` et `text`.
 * @param {string} challengeText - Texte du défi généré pour la journée.
 * @returns {string} Message formaté pour le partage sur les réseaux sociaux.
 */
export function buildShareMessage(verse, challengeText) {
  return generateShareMessage(verse, challengeText);
}

/**
 * Génère une image partageable (canvas) qui inclut le badge et le score actuel.
 *
 * @param {object} badge - Objet contenant `name` et `image` (data URL ou nom de fichier).
 * @param {number} score - Score total actuel de l'utilisateur.
 * @returns {Promise<string>} URL de données de l'image générée (PNG).
 */
export async function buildShareImage(badge, score) {
  try {
    // Création d'un canvas hors écran avec un ratio adapté aux stories Instagram (9:16)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // Détermine si le thème sombre est actif
    const isDark = localStorage.getItem('themePreference') === 'dark';
    const bgColor = isDark ? '#1a1a1a' : '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Charge l'image du badge (peut être un data URL)
    const img = new Image();
    const imgSrc = badge.image.startsWith('data:')
      ? badge.image
      : `${BADGE_IMAGES_PATH}${badge.image}`;
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Échec du chargement de l'image du badge"));
      img.src = imgSrc;
    });

    // Redimensionne et centre le badge
    const badgeSize = 720;
    const badgeX = (width - badgeSize) / 2;
    const badgeY = 200;
    ctx.drawImage(img, badgeX, badgeY, badgeSize, badgeSize);

    // Affiche le nom du badge au-dessus du badge
    ctx.font = '48px sans-serif';
    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(badge.name, width / 2, badgeY - 30);

    // Affiche le score en bas de l'image
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText(`Score : ${score}`, width / 2, height - 80);

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('buildShareImage a échoué :', error);
    // Retourne une image de secours simple en cas d'erreur
    return fallbackShareImage(score);
  }
}

/**
 * Génère une image de secours contenant uniquement le score lorsque le canvas échoue.
 *
 * @param {number} score - Score total actuel.
 * @returns {string} URL de données de l'image PNG de secours.
 */
function fallbackShareImage(score) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 72px sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Youth Discipleship\nChallenge\nScore: ${score}`, canvas.width / 2, canvas.height / 2);
  return canvas.toDataURL('image/png');
}

/**
 * Ouvre la feuille de partage native (Web Share API, WhatsApp, etc.) avec les données fournies.
 *
 * @param {object} options - Options de partage.
 * @param {string} options.message - Texte à partager.
 * @param {string} [options.url] - URL optionnelle à joindre.
 * @param {string} [options.title] - Titre optionnel.
 * @returns {Promise<void>}
 */
export async function share({ message, url, title }) {
  try {
    const shareData = {};
    if (message) shareData.text = message;
    if (title) shareData.title = title;
    if (url) shareData.url = url;

    // Tente d'utiliser l'API Web Share native
    if (navigator.share) {
      await navigator.share(shareData);
      await logShareEvent({
        type: 'web',
        message,
        url,
        title,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Détecte un environnement mobile pour ouvrir WhatsApp avec un URL pré-remplie
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      await logShareEvent({
        type: 'whatsapp_fallback',
        message,
        url,
        title,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // En dernier recours, copie le message dans le presse-papiers
    if (navigator.clipboard && message) {
      await navigator.clipboard.writeText(message);
      console.log('Message copié dans le presse-papiers');
      await logShareEvent({
        type: 'clipboard',
        message,
        url,
        title,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Le partage a échoué :', error);
    // Enregistre l'erreur localement pour le débogage
    await logShareEvent({
      type: 'error',
      error: error.message,
      message,
      url,
      title,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Enregistre un événement de partage dans le stockage local pour l'analyse.
 *
 * @param {object} event - Détails de l'événement de partage.
 */
export async function logShareEvent(event) {
  try {
    const existing = localStorage.getItem(SHARE_EVENT_KEY);
    const events = existing ? JSON.parse(existing) : [];
    events.push(event);
    // Conserve uniquement les 50 événements les plus récents pour limiter l'utilisation du stockage
    if (events.length > 50) {
      events.splice(0, events.length - 50);
    }
    localStorage.setItem(SHARE_EVENT_KEY, JSON.stringify(events));
  } catch (e) {
    console.error("Échec de l'enregistrement de l'événement de partage", e);
  }
}

/**
 * Récupère la liste des événements de partage enregistrés localement.
 *
 * @returns {Array} Tableau des événements de partage.
 */
export function getShareEvents() {
  try {
    const data = localStorage.getItem(SHARE_EVENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Échec de la lecture des événements de partage', e);
    return [];
  }
}