// js/storage.js
/**
 * Persistence wrapper for Youth Discipleship Challenge.
 * Stores user progress (score, streak, earned badges), theme preferences,
 * and offline cache list using IndexedDB and localStorage.
 *
 * Provides CRUD operations for progress data and simple getters/setters
 * for theme and cache.
 */

const DB_NAME = 'YouthDiscipleshipChallenge';
const DB_VERSION = 1;
const STORE_NAME = 'progress';
const THEME_KEY = 'themePreference';
const OFFLINE_CACHE_KEY = 'offlineCache';

/**
 * Opens (or creates) the IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Retrieves the current user progress object.
 * Returns null if no progress record exists.
 * @returns {Promise<{id:string, streak:number, totalScore:number, badges:Array<{name:string, image:string, earnedAt:string}>>|null>}
 */
async function getProgress() {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const record = await new Promise((resolve, reject) => {
      const req = store.get('user');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    await tx.done;
    return record || null;
  } catch (e) {
    console.error('Failed to read progress', e);
    return null;
  }
}

/**
 * Creates or updates the user progress record.
 * Merges the provided partial data with existing data.
 * @param {Partial<{streak:number, totalScore:number, badges:Array<{name:string, image:string, earnedAt:string}>}>} data
 */
async function updateProgress(data) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const existing = (await getProgress()) || { id: 'user', streak: 0, totalScore: 0, badges: [] };
    const merged = {
      ...existing,
      ...data,
      badges: [...(existing.badges || []), ...(data.badges || [])],
    };
    await new Promise((resolve, reject) => {
      const req = store.put(merged);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    await tx.done;
  } catch (e) {
    console.error('Failed to update progress', e);
  }
}

/**
 * Increments the daily streak and total score.
 * Call this when a user completes a challenge for the current day.
 */
async function incrementStreak() {
  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const progress = (await getProgress()) || { id: 'user', streak: 0, totalScore: 0, badges: [], lastDate: null };
    const lastDate = progress.lastDate;
    let newStreak = progress.streak;
    if (lastDate !== today) {
      newStreak += 1;
    }
    await updateProgress({
      streak: newStreak,
      totalScore: progress.totalScore + 1,
      lastDate: today,
    });
  } catch (e) {
    console.error('Failed to increment streak', e);
  }
}

/**
 * Records an earned badge for the user.
 * Badge object should contain at least `name` and `image` (URL or base64).
 * @param {{name:string, image:string}} badge
 */
async function addBadge(badge) {
  try {
    const earnedAt = new Date().toISOString();
    await updateProgress({
      badges: [{ ...badge, earnedAt }],
    });
  } catch (e) {
    console.error('Failed to add badge', e);
  }
}

/**
 * Returns the list of badges earned by the user.
 * @returns {Promise<Array<{name:string, image:string, earnedAt:string}>>}
 */
async function getBadges() {
  try {
    const progress = await getProgress();
    return progress?.badges || [];
  } catch (e) {
    console.error('Failed to read badges', e);
    return [];
  }
}

/**
 * Saves the user's theme preference.
 * Valid values: 'light', 'dark', 'high-contrast'.
 * @param {string} theme
 */
function setTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}

/**
 * Retrieves the user's theme preference.
 * Defaults to 'light' if not set.
 * @returns {string}
 */
function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch (e) {
    console.error('Failed to read theme', e);
    return 'light';
  }
}

/**
 * Stores the list of resources to be cached for offline support.
 * @param {Array<string>} resources Array of URL strings.
 */
function setOfflineCache(resources) {
  try {
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(resources));
  } catch (e) {
    console.error('Failed to save offline cache list', e);
  }
}

/**
 * Retrieves the offline cache list.
 * Returns an empty array if none is stored.
 * @returns {Array<string>}
 */
function getOfflineCache() {
  try {
    const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read offline cache list', e);
    return [];
  }
}

/**
 * Clears all persisted user data (progress, theme, cache).
 * Useful for testing or user reset.
 */
async function clearAll() {
  try {
    // Clear IndexedDB store
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await new Promise((resolve, reject) => {
      const req = tx.objectStore(STORE_NAME).clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    await tx.done;

    // Clear localStorage keys
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(OFFLINE_CACHE_KEY);
  } catch (e) {
    console.error('Failed to clear all data', e);
  }
}

/**
 * Deletes the entire IndexedDB database (removes all stored data).
 */
function deleteDatabase() {
  indexedDB.deleteDatabase(DB_NAME);
}

// Export all public functions
export {
  getProgress,
  updateProgress,
  incrementStreak,
  addBadge,
  getBadges,
  setTheme,
  getTheme,
  setOfflineCache,
  getOfflineCache,
  clearAll,
  deleteDatabase,
};