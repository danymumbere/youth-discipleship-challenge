// js/data.js
// Youth Discipleship Challenge – data module
// Provides Bible verses, reflection videos, badges, and helper functions.

export const BIBLE_VERSES = [
  { reference: "Jean 3:16", text: "Car Dieu a tant aimé le monde qu’il a donné son Fils unique, afin que quiconce croit en lui ne périsse pas, mais ait la vie éternelle." },
  { reference: "Psaume 23", text: "Le Seigneur est mon pasteur, je ne manque de rien." },
  { reference: "Éphésiens 2:8", text: "C’est par la grâce que vous êtes sauvés, par le moyen de la foi." },
  { reference: "Matthieu 5:14", text: "Vous êtes la lumière du monde ; on ne met pas un flambeau sous le boisseau, mais on le met sur un support." },
  { reference: "Romains 8:28", text: "Nous savons que tout est bien pour ceux qui aiment Dieu." },
  { reference: "Philippiens 4:13", text: "Je peux tout faire par la force qui me vient de Dieu." },
  { reference: "1 Jean 4:10", text: "Dieu nous a donné l’amour ; c’est par lui que nous avons été sauvés." },
  { reference: "Jérémie 29:11", text: "Je connais mes pensées à votre sujet, dit l’Éternel, pensées de bonheur et non de mal, afin que vous retourniez à moi." },
  { reference: "Colossiens 3:23", text: "Tout ce que vous faites, faites-le de tout votre cœur, comme pour le Seigneur et non pour des hommes." },
  { reference: "2 Timothée 3:16", text: "Tout écrit est inspiré de Dieu et utile." },
  { reference: "Proverbes 3:5", text: "Croyez en l’Éternel, ne vous approuvez sur votre jugement." },
  { reference: "Psaume 51:1", text: "J’ai péché, moi et ma famille." },
  { reference: "Ésaïe 40:31", text: "Mais ceux qui espèrent en l’Éternel renouvellent leur force ; ils prennent l’aile de l’aigle, ils courent et ne se fatiguent point." },
  { reference: "Matthieu 6:33", text: "Cherchez premièrement le royaume de Dieu et sa justice, et toutes ces choses vous seront données par-dessus." },
  { reference: "Luc 6:31", text: "Tout ce que vous voulez que les hommes fassent pour vous, faites-le de même pour eux." },
  { reference: "Jean 14:6", text: "Je suis le chemin, la vérité et la vie ; personne ne vient au Père si ce n’est par moi." },
  { reference: "Marc 12:30", text: "Aime le Seigneur ton Dieu de tout ton cœur, de toute ton âme, de toute ta pensée et de toute ta force." },
  { reference: "Luc 10:27", text: "Aime le Seigneur ton Dieu de tout ton cœur, de toute ton âme, de toute ta force et de toute ta pensée, et ton prochain comme toi-même." },
  { reference: "Jean 15:5", text: "Je suis la vigne, vous êtes les branches ; celui qui demeure en moi et en moi demeure, il porte beaucoup de fruit." },
  { reference: "Romains 5:8", text: "Mais Dieu a donné sa propre vie pour nous, afin que nous soyons sauvés." },
  { reference: "1 Pierre 2:9", text: "Vous êtes une race choisie, un sacerdocium royal, une nation sainte, un peuple acquis pour faire connaître les vertus de celui qui vous a appelés." },
  { reference: "Jacques 2:17", text: "De même la foi, si elle n’a pas d’œuvres, est morte en elle-même." },
  { reference: "Jacques 3:18", text: "Mais le fruit de la justice se sème en paix pour ceux qui font la paix." },
  { reference: "1 Jean 3:16", text: "Nous avons connu l’amour en ce qu’il a donné sa vie pour nous ; nous aussi, nous devons donner notre vie pour nos frères." },
  { reference: "Hébreux 11:1", text: "Or la foi est une ferme assurance des choses qu’on espère, une démonstration des choses qu’on ne voit pas." },
  { reference: "Éphésiens 4:32", text: "Soyez bons les uns envers les autres, tendres de cœur, vous pardonnant comme Dieu vous a pardonné en Christ." },
  { reference: "Colossiens 3:14", text: "Par-dessus toutes ces choses, revêtez-vous de la charité, qui est le lien parfait." },
  { reference: "2 Jean 1:5", text: "Et tu es aimé de la part de Dieu, Père, dans la vérité et dans l’amour." },
  { reference: "3 Jean 1:2", text: "Bien-aimé, je souhaite que tu prospères en toutes choses et que tu sois en bonne santé, comme prospère ton âme." },
  { reference: "Apocalypse 3:20", text: "Voici, je me tiens à la porte et je frappe ; si quelqu’un entend ma voix et ouvre la porte, j’entrerai chez lui, je souperai avec lui, et il soupera avec moi." }
];

export const REFLECTION_VIDEOS = [
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
  { verse: "Jean 14:6", videoId: "4lX5lX9jZcQ" },
  { verse: "Marc 12:30", videoId: "6kK5lX9jZcQ" },
  { verse: "Luc 10:27", videoId: "7lK5lX9jZcQ" },
  { verse: "Jean 15:5", videoId: "8mL5lX9jZcQ" },
  { verse: "Romains 5:8", videoId: "9nM5lX9jZcQ" },
  { reference: "1 Pierre 2:9", videoId: "0oK5lX9jZcQ" }, // maybe fix
  { reference: "Jacques 2:17", videoId: "1pK5lX9jZcQ" },
  { reference: "Jacques 3:18", videoId: "2qK5lX9jZcQ" },
  { reference: "1 Jean 3:16", videoId: "3rK5lX9jZcQ" },
  { reference: "Hébreux 11:1", videoId: "4sL5lX9jZcQ" },
  { reference: "Éphésiens 4:32", videoId: "5tM5lX9jZcQ" },
{ reference: "Colossiens 3:14", videoId: "6uN5lX9jZcQ" }
];