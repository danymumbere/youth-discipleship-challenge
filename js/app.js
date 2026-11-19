// js/app.js
// Orchestrateur principal : routage, initialisation, et coordination des modules.

import { BIBLE_VERSES } from "./data.js";
import { fetchTodaysVerse, generateChallengeText } from "./bible.js";
import * as UI from "./ui.js";
import * as Storage from "./storage.js";
import * as Share from "./share.js";

/**
 * Initialisation de l’application au chargement du DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Enregistrement du Service Worker
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (err) {
      console.error("Échec de l’enregistrement du Service Worker :", err);
    }
  }

  // 2. Initialisation des préférences (Thème et Contraste)
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedContrast = localStorage.getItem("highContrast") === "true";
  
  const themeSelect = document.getElementById("theme-select");
  const toggleContrastBtn = document.getElementById("toggle-contrast");

  if (themeSelect) themeSelect.value = savedTheme;
  UI.applyTheme(savedTheme);
  UI.applyHighContrast(savedContrast);

  // 3. Chargement des données initiales
  await initDailyChallenge();
  updateProgressDisplay();

  // 4. Configuration des écouteurs d’événements
  setupEventListeners();

  // 5. Gestion de l’état hors ligne
  window.addEventListener("online", () => UI.hideOfflineBanner());
  window.addEventListener("offline", () => UI.showOfflineBanner());
});

/**
 * Configure les écouteurs d’événements pour l’interface.
 */
function setupEventListeners() {
  // Navigation : Bouton pour démarrer le défi
  document.getElementById("verse-btn").addEventListener("click", () => {
    UI.showSection("daily-challenge");
  });

  // Thème : Changement de sélection
  document.getElementById("theme-select").addEventListener("change", (e) => {
    const theme = e.target.value;
    localStorage.setItem("theme", theme);
    UI.applyTheme(theme);
  });

  // Contraste : Bascule
  document.getElementById("toggle-contrast").addEventListener("click", () => {
    const isHighContrast = localStorage.getItem("highContrast") === "true";
    const newState = !isHighContrast;
    localStorage.setItem("highContrast", newState.toString());
    UI.applyHighContrast(newState);
  });

  // Partage : Bouton de badge
  document.getElementById("daily-badge").addEventListener("click", async () => {
    const verse = await fetchTodaysVerse();
    const challengeText = generateChallengeText(verse);
    const message = Share.buildShareMessage(verse, challengeText);
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mon défi biblique", text: message });
      } catch (err) {
        console.warn("Partage annulé ou échoué :", err);
      }
    } else {
      alert("Le partage natif n’est pas supporté sur cet appareil.");
    }
  });
}

/**
 * Charge et affiche le défi du jour.
 */
async function initDailyChallenge() {
  try {
    const verse = await fetchTodaysVerse();
    const challengeText = generateChallengeText(verse);
    
    const descEl = document.getElementById("challenge-description");
    if (descEl) {
      descEl.textContent = challengeText;
    }

    // Configuration de la vidéo (YouTube embed)
    const videoEl = document.getElementById("reflection-video");
    if (videoEl) {
      // URL exemple basée sur le domaine public ou contenu éducatif
      videoEl.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1";
    }
  } catch (error) {
    const errorEl = document.getElementById("error-msg");
    if (errorEl) {
      errorEl.textContent = "Impossible de charger le défi du jour. Vérifiez votre connexion.";
      UI.showSection("error-msg");
    }
  }
}

/**
 * Met à jour les éléments d’affichage de la progression.
 */
function updateProgressDisplay() {
  const stats = Storage.getProgress();
  
  const streakEl = document.getElementById("current-streak");
  const scoreEl = document.getElementById("total-score");
  const barEl = document.getElementById("progress-bar");

  if (streakEl) streakEl.textContent = `Série actuelle : ${stats.streak} jours`;
  if (scoreEl) scoreEl.textContent = `Score total : ${stats.totalScore}`;
  if (barEl) barEl.style.width = `${Math.min(stats.streak * 10, 100)}%`;
}

/**
 * Marque le défi comme complété et met à jour le score.
 */
export async function completeChallenge() {
  Storage.incrementScore();
  updateProgressDisplay();
  UI.showSection("challenge-completion");
}