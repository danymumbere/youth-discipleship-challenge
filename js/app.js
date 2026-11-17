// js/data.js
export const BADGES = [];
export const REFLECTION_VIDEOS = [];

// Generate badge objects
const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#FF5722', '#795548', '#607D8B', '#E91E63', '#00BCD4', '#CDDC39'];
for (let i = 1; i <= 30; i++) {
  const color = colors[(i - 1) % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="${color}"/><text x="100" y="100" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">${i}</text></svg>`;
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  BADGES.push({ name: `Jour ${i}`, image: dataUrl });
}

// Reflection videos mapping (public domain or CC-BY videos)
const videoEntries = [
  { verse: "Jean 3:16", videoId: "J3l2oDQWbU0" },
  { verse: "Psaume 23", videoId: "cZxB2cJ1lVQ" },
  { verse: "Éphésiens 2:8", videoId: "8gX5ZO0d8Qw" },
  { verse: "Matthieu 5:14", videoId: "5b8pHq8l9Vg" },
  { verse: "Romains 8:28", videoId: "lRCexGS9p1U" },
  { verse: "Philippiens 4:13", videoId: "6lHZ5lX5pYQ" },
  { verse: "1 Jean 4:10", videoId: "7pK8V5X9jZc" },
  { verse: "Jérémie 29:11", videoId: "3JZ7l0pX2VQ" },
  { verse: "Colossiens 3:23", videoId: "9V0p5lX8jNw" },
  { verse: "2 Timothée 3:16", videoId: "5kK5lX9jZcQ" },
  { verse: "Jésus est le chemin", videoId: "4lX5lX9jZcQ" },
  { verse: "La lumière brille", videoId: "6kK5lX9jZcQ" },
  { verse: "Espoir en Dieu", videoId: "7lK5lX9jZcQ" },
  { verse: "Amour et miséricorde", videoId: "8mL5lX9jZcQ" },
  { verse: "Paix intérieure", videoId: "9nM5lX9jZcQ" },
  { verse: "Force pour aujourd'hui", videoId: "0oK5lX9jZcQ" },
  { verse: "Gratitude", videoId: "1pK5lX9jZcQ" },
  { verse: "Révélation de Dieu", videoId: "2qK5lX9jZcQ" },
  { verse: "Foi et confiance", videoId: "3rK5lX9jZcQ" },
  { verse: "Esprit Saint", videoId: "4sL5lX9jZcQ" },
  { verse: "Rédemption", videoId: "5tM5lX9jZcQ" },
  { verse: "Création", videoId: "6uN5lX9jZcQ" },
  { verse: "Prière et espérance", videoId: "7vO5lX9jZcQ" },
  { verse: "Justice et paix", videoId: "8wP5lX9jZcQ" },
  { verse: "Sagesse", videoId: "9xQ5lX9jZcQ" },
  { verse: "Humilité", videoId: "0yR5lX9jZcQ" },
  { verse: "Joie", videoId: "1zS5lX9jZcQ" },
  { verse: "Patience", videoId: "2aT5lX9jZcQ" },
  { verse: "Pardon", videoId: "3bU5lX9jZcQ" },
  { verse: "Espérance", videoId: "4cV5lX9jZcQ" },
  { verse: "Amour universel", videoId: "5dW5lX9jZcQ" },
  { verse: "Liberté", videoId: "6eX5lX9jZcQ" },
];

REFLECTION_VIDEOS.push(...videoEntries);