// js/bible.js
export const CACHE_KEY = 'youthDiscipleshipChallenge_verse';

/**
 * Récupère un verset aléatoire depuis l'API Bible gratuite (bible-api.com).
 * En cas d'erreur réseau, retourne un verset de secours.
 *
 * @returns {Promise<{reference: string, text: string}>}
 */
export async function fetchRandomVerse() {
  try {
    const response = await fetch('https://bible-api.com/random');
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const reference = data.reference || `${data.book} ${data.chapter}:${data.verse}`;
    return { reference, text: data.text };
  } catch (error) {
    console.warn('Bible API indisponible, utilisation d’un verset de secours.', error);
    // Verset de secours en français (Jean 3:16)
    return {
      reference: 'Jean 3:16',
      text: 'Car Dieu a tant aimé le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse pas, mais ait la vie éternelle.',
    };
  }
}

/**
 * Récupère le verset mis en cache pour aujourd’hui depuis le localStorage.
 * @returns {Promise<{reference:string, text:string}|null>}
 */
export async function getCachedVerse() {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return null;
    const { date, verse } = JSON.parse(stored);
    const today = new Date().toDateString();
    if (date !== today) return null;
    return verse;
  } catch (e) {
    console.error('Impossible de lire le cache localStorage', e);
    return null;
  }
}

/**
 * Sauvegarde un verset dans le cache localStorage avec la date courante.
 * @param {object} verse - Objet contenant `reference` et `text`.
 */
export async function cacheVerse(verse) {
  try {
    const today = new Date().toDateString();
    const payload = JSON.stringify({ date: today, verse });
    localStorage.setItem(CACHE_KEY, payload);
  } catch (e) {
    console.error('Échec du stockage du cache localStorage', e);
  }
}

/**
 * Récupère le verset pour la journée (depuis le cache ou l’API) et met à jour le cache si nécessaire.
 * @returns {Promise<{reference:string, text:string}>}
 */
export async function fetchTodaysVerse() {
  const cached = await getCachedVerse();
  if (cached) {
    return cached;
  }
  const fresh = await fetchRandomVerse();
  await cacheVerse(fresh);
  return fresh;
}

/**
 * Génère un texte de défi quotidien à partir d’un verset.
 * @param {object} verse - Objet contenant `reference` et `text`.
 * @returns {string} Texte du défi en français.
 */
export function generateChallengeText(verse) {
  return `Lisez ${verse.reference} : "${verse.text}". Réfléchissez à la manière dont ce verset peut vous guider aujourd’hui.`;
}

/**
 * Formate un verset pour l’affichage (référence + texte).
 * @param {object} verse
 * @returns {string}
 */
export function formatVerseDisplay(verse) {
  return `${verse.reference} — ${verse.text}`;
}

/**
 * Génère un message prêt à être partagé sur les réseaux sociaux contenant le verset et le texte du défi.
 * @param {object} verse
 * @param {string} challengeText
 * @returns {string}
 */
export function generateShareMessage(verse, challengeText) {
  return `Youth Discipleship Challenge de aujourd’hui :\n${formatVerseDisplay(verse)}\n\n${challengeText}\n#YouthDiscipleship #ChallengeBiblique`;
}

/**
 * Supprime le cache local (utile pour les tests ou le changement de thème).
 */
export function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.error('Impossible de supprimer le cache localStorage', e);
  }
}