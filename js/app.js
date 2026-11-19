// js/app.js
import * as Bible from './bible.js';
import * as Data from './data.js';
import * as UI from './ui.js';
import * as Storage from './storage.js';
import * as Share from './share.js';

/**
 * Main Orchestrator for Youth Discipleship Challenge.
 * Handles routing, initialization, and event coordination.
 */

const APP_SECTIONS = [
  'home', 'daily-challenge', 'badges', 'progress', 'profile', 'settings', 'offline'
];

async function init() {
  // 1. Service Worker Registration
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  }

  // 2. Theme Initialization
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';

  // 3. Navigation Setup
  setupNavigation();

  // 4. Data Initialization
  await refreshDashboard();

  // 5. Button Listeners
  setupEventListeners();
}

function setupNavigation() {
  const navButtons = {
    'nav-home': 'home',
    'nav-challenge': 'daily-challenge',
    'nav-reflection': 'daily-challenge',
    'nav-badges': 'badges',
    'nav-progress': 'progress',
    'nav-profile': 'profile',
    'nav-settings': 'settings',
    'nav-offline': 'offline'
  };

  Object.entries(navButtons).forEach(([btnId, sectionId]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => showSection(sectionId));
    }
  });
}

function showSection(sectionId) {
  APP_SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === sectionId) ? 'block' : 'none';
  });
}

async function refreshDashboard() {
  try {
    // Load Verse
    const verse = await Bible.fetchTodaysVerse();
    document.getElementById('verse-title').textContent = verse.reference;
    document.getElementById('verse-text').textContent = verse.text;
    document.getElementById('challenge-text').textContent = Bible.generateChallengeText(verse);

    // Load Stats
    const stats = Storage.getProgress();
    document.getElementById('streak-count').textContent = `Série : ${stats.streak} jours`;
    document.getElementById('total-score').textContent = `Score total : ${stats.score}`;
    
    // Load Profile
    const name = localStorage.getItem('userName') || 'Discipule';
    document.getElementById('profile-name').textContent = name;

  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
    showSection('offline');
  }
}

function setupEventListeners() {
  // Start Button
  document.getElementById('btn-start').addEventListener('click', () => showSection('daily-challenge'));

  // Complete Challenge
  document.getElementById('btn-complete').addEventListener('click', async () => {
    const stats = Storage.incrementProgress();
    document.getElementById('streak-count').textContent = `Série : ${stats.streak} jours`;
    document.getElementById('total-score').textContent = `Score total : ${stats.score}`;
    
    // Generate Badge
    const badge = { name: `Discipule du jour ${stats.streak}`, image: 'badge.png' };
    const badgeList = document.getElementById('badge-list');
    const badgeEl = document.createElement('div');
    badgeEl.className = 'badge-item';
    badgeEl.innerHTML = `<p>Bravo ! Vous avez gagné : ${badge.name}</p>`;
    badgeList.appendChild(badgeEl);
    
    alert('Défi complété ! Votre badge a été ajouté.');
  });

  // Replay Video
  document.getElementById('btn-replay').addEventListener('click', () => {
    const videoContainer = document.getElementById('video-container');
    const iframe = videoContainer.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = '';
      iframe.src = src;
    }
  });

  // Share Badge
  document.getElementById('btn-share-badge').addEventListener('click', async () => {
    const stats = Storage.getProgress();
    const badge = { name: `Discipule du jour ${stats.streak}`, image: 'badge.png' };
    
    try {
      const imageBlob = await Share.buildShareImage(badge, stats.score);
      if (navigator.share) {
        await navigator.share({
          title: 'Mon défi biblique',
          text: 'Regardez mon progrès dans le Youth Discipleship Challenge !',
          url: window.location.href
        });
      } else {
        alert('Partage non supporté sur ce navigateur.');
      }
    } catch (err) {
      console.error('Erreur de partage :', err);
    }
  });

  // Edit Profile
  document.getElementById('btn-edit-profile').addEventListener('click', () => {
    const newName = prompt('Entrez votre nom :', localStorage.getItem('userName') || '');
    if (newName) {
      localStorage.setItem('userName', newName);
      document.getElementById('profile-name').textContent = newName;
    }
  });

  // Reset Data
  document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ?')) {
      localStorage.clear();
      location.reload();
    }
  });

  // Retry Connection
  document.getElementById('btn-retry').addEventListener('click', async () => {
    await refreshDashboard();
    showSection('home');
  });
}

// Initialize App
document.addEventListener('DOMContentLoaded', init);