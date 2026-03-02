/**
 * Tutorial step definitions with FR/EN translations.
 *
 * Each step has:
 * - id:          Unique key
 * - en/fr:       { title, text } translations
 * - action:      What the app should do before showing this step
 * - highlight:   Which area to highlight
 * - position:    Where to place the tooltip ('top' | 'bottom' | 'center')
 * - confirmLabel: { en, fr } for the confirm button (optional)
 */

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    en: {
      title: 'Welcome to Push!',
      text: 'Ready for a quick tour of the app? It only takes a minute.',
    },
    fr: {
      title: 'Bienvenue sur Push !',
      text: "Prêt pour un tour rapide de l'appli ? Ça ne prend qu'une minute.",
    },
    action: null,
    highlight: null,
    position: 'center',
    confirmLabel: { en: "Let's go", fr: 'C\'est parti' },
  },

  {
    id: 'programs-intro',
    en: {
      title: 'Programs',
      text: "This is where you manage your training programs. We've set up a starter program for you.",
    },
    fr: {
      title: 'Programmes',
      text: "C'est ici que vous gérez vos programmes d'entraînement. On en a préparé un pour vous.",
    },
    action: 'goToTab:0',
    highlight: 'programCard:0',
    position: 'bottom',
  },
  {
    id: 'programs-chevron',
    en: {
      title: 'Preview Workouts',
      text: 'Tap the chevron to preview the workouts inside a program and see the number of exercises per workout.',
    },
    fr: {
      title: 'Aperçu des séances',
      text: "Appuyez sur le chevron pour voir les séances d'un programme et le nombre d'exercices par séance.",
    },
    action: null,
    highlight: 'programChevron:0',
    position: 'bottom',
  },
  {
    id: 'programs-select',
    en: {
      title: 'Select a Program',
      text: 'Tap the program card or the radio button to select it and load its workouts.',
    },
    fr: {
      title: 'Sélectionner un programme',
      text: 'Appuyez sur la carte du programme ou le bouton radio pour le sélectionner et charger ses séances.',
    },
    action: null,
    highlight: 'programRadio:0',
    position: 'bottom',
  },

  {
    id: 'workouts-intro',
    en: {
      title: 'Your Workouts',
      text: 'Here are the workouts for your selected program. Tap the chevron to see exercises and rep ranges.',
    },
    fr: {
      title: 'Vos séances',
      text: 'Voici les séances de votre programme. Appuyez sur le chevron pour voir les exercices et les fourchettes de répétitions.',
    },
    action: 'goToTab:1',
    highlight: 'workoutsList',
    position: 'bottom',
  },
  {
    id: 'workouts-open',
    en: {
      title: 'Start a Session',
      text: 'Tap a workout card to open it and start your training session.',
    },
    fr: {
      title: 'Démarrer une séance',
      text: 'Appuyez sur une carte de séance pour la lancer.',
    },
    action: null,
    highlight: 'workoutCard:0',
    position: 'bottom',
  },

  {
    id: 'workout-current',
    en: {
      title: 'Your Active Session',
      text: 'This is your current session. Each exercise shows sets with weight, reps, and RIR. Tap any value to fill it in — completed sets turn green.',
    },
    fr: {
      title: 'Votre séance en cours',
      text: "Voici votre séance actuelle. Chaque exercice affiche les séries avec poids, répétitions et RIR. Tapez sur une valeur pour la remplir — les séries complétées passent en vert.",
    },
    action: 'openWorkout:0',
    highlight: 'exerciseCard:0',
    position: 'bottom',
  },
  {
    id: 'workout-previous',
    en: {
      title: 'Previous Session',
      text: "Tap 'Previous' on the view selector to see what you did last session. Use it as a reference to track your progress.",
    },
    fr: {
      title: 'Séance précédente',
      text: "Appuyez sur 'Previous' sur le sélecteur de vue pour voir votre dernière séance. Utilisez-la comme référence.",
    },
    action: null,
    highlight: 'viewSelector:0',
    position: 'bottom',
  },
  {
    id: 'workout-next',
    en: {
      title: 'Plan Ahead',
      text: "'Next' shows your planned targets for the upcoming session. You can edit the values to plan your progression.",
    },
    fr: {
      title: 'Planifier',
      text: "'Next' affiche vos objectifs pour la prochaine séance. Vous pouvez modifier les valeurs pour planifier votre progression.",
    },
    action: null,
    highlight: 'viewSelector:0',
    position: 'bottom',
  },
  {
    id: 'workout-footer',
    en: {
      title: 'Rest Timer & Rep Range',
      text: 'Each exercise has a rest timer and target rep range at the bottom. Tap the timer to start your rest countdown.',
    },
    fr: {
      title: 'Timer de repos & répétitions',
      text: "Chaque exercice a un timer de repos et une fourchette de répétitions en bas. Appuyez sur le timer pour lancer le décompte.",
    },
    action: null,
    highlight: 'exerciseFooter:0',
    position: 'top',
  },
  {
    id: 'workout-edit',
    en: {
      title: 'Edit Mode',
      text: 'Use the Edit button to add or remove exercises, sets, rename things, and adjust rest timers.',
    },
    fr: {
      title: 'Mode édition',
      text: "Utilisez le bouton Edit pour ajouter ou supprimer des exercices, séries, renommer et ajuster les timers de repos.",
    },
    action: null,
    highlight: 'editButton',
    position: 'top',
  },

  {
    id: 'workout-back',
    en: {
      title: 'Revenir en arrière',
      text: "Tap the back arrow at the top or use your phone's back button to return to your workouts list.",
    },
    fr: {
      title: 'Revenir en arrière',
      text: "Appuyez sur la flèche retour en haut ou utilisez le bouton retour de votre téléphone pour revenir à la liste des séances.",
    },
    action: null,
    highlight: 'backButton',
    position: 'bottom',
  },

  {
    id: 'graphs-intro',
    en: {
      title: 'Track Your Progress',
      text: 'Swipe to the Graphs tab to see your tonnage progression over time. Tap any graph for a detailed breakdown per exercise.',
    },
    fr: {
      title: 'Suivez votre progression',
      text: "Glissez vers l'onglet Graphs pour voir l'évolution de votre tonnage. Appuyez sur un graphique pour le détail par exercice.",
    },
    action: 'goBack',
    secondaryAction: 'goToTab:2',
    highlight: 'graphsList',
    position: 'bottom',
  },

  {
    id: 'done',
    en: {
      title: "You're All Set!",
      text: 'Start building your program and tracking your workouts. Push yourself further every session.',
    },
    fr: {
      title: 'Vous êtes prêt !',
      text: 'Construisez votre programme et suivez vos séances. Dépassez-vous à chaque entraînement.',
    },
    action: 'goToTab:1',
    highlight: null,
    position: 'center',
    confirmLabel: { en: 'Start Training', fr: "C'est parti" },
  },
];

export default TUTORIAL_STEPS;