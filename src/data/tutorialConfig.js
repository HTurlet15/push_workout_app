/**
 * Tutorial configuration for react-native-copilot.
 *
 * Each step maps to a CopilotStep name in the component tree.
 * Actions are executed by MainScreen before/after each step.
 */

export const TUTORIAL_TEXTS = {
  'program-card': {
    en: { title: 'Programs', text: "This is where you manage your training programs. We've set up a starter program for you." },
    fr: { title: 'Programmes', text: "C'est ici que vous gérez vos programmes. On en a préparé un pour vous." },
  },
  'program-chevron': {
    en: { title: 'Preview Workouts', text: 'Tap the chevron to preview the workouts inside a program.' },
    fr: { title: 'Aperçu des séances', text: "Appuyez sur le chevron pour voir les séances d'un programme." },
  },
  'program-radio': {
    en: { title: 'Select a Program', text: 'Tap to select a program and load its workouts.' },
    fr: { title: 'Sélectionner', text: 'Appuyez pour sélectionner un programme et charger ses séances.' },
  },
  'workout-card': {
    en: { title: 'Your Workouts', text: 'Here are your workouts. Tap a card to start a session.' },
    fr: { title: 'Vos séances', text: 'Voici vos séances. Appuyez sur une carte pour la lancer.' },
  },
  'exercise-card': {
    en: { title: 'Active Session', text: 'Each exercise shows sets with weight, reps, and RIR (optionnal). Tap any value to fill it in — completed sets turn green.' },
    fr: { title: 'Séance en cours', text: "Chaque exercice affiche poids, répétitions et RIR (optionnel). Tapez une valeur pour la remplir — les séries complétées passent en vert." },
  },
  'view-selector': {
    en: { title: 'Previous / Current / Next', text: "Switch views to see your last session, current session, or plan your next one. Planned values will be displayed with an calendar emoji during next workout." },
    fr: { title: 'Précédent / Actuel / Suivant', text: "Changez de vue pour voir la dernière séance, l'actuelle, ou planifier la prochaine. Les valeurs planifiées s'afficheront lors de la prochaine séance avec un emoji calendrier. " },
  },
  'exercise-footer': {
    en: { title: 'Rest Timer & Rep Range', text: 'Each exercise has a rest timer and target rep range. Tap the timer to start your countdown.' },
    fr: { title: 'Timer & répétitions', text: "Chaque exercice a un timer de repos et une fourchette de reps. Appuyez sur le timer pour lancer le décompte." },
  },
  'edit-button': {
    en: { title: 'Edit Mode', text: 'Add or remove exercises, sets, rename things, and adjust timers and rep range.' },
    fr: { title: 'Mode édition', text: "Ajoutez ou supprimez des exercices, séries, renommez et ajustez les timers et fourchettes de répétitions." },
  },
  'back-button': {
    en: { title: 'Going Back', text: "Tap here or use your phone's back button to return to the workouts list." },
    fr: { title: 'Retour', text: "Appuyez ici ou utilisez le bouton retour de votre téléphone pour revenir à la liste des séances." },
  },
  'graph-card': {
    en: { title: 'Track Progress', text: 'See your tonnage progression over time. Tap for a detailed breakdown per exercise.' },
    fr: { title: 'Progression', text: "Suivez l'évolution de votre tonnage. Appuyez pour le détail par exercice." },
  },
};

/**
 * Step order with navigation actions.
 * action: executed BEFORE showing the step.
 */
export const TUTORIAL_STEP_ORDER = [
  { name: 'program-card', action: 'goToTab:0' },
  { name: 'program-chevron', action: null },
  { name: 'program-radio', action: null },
  { name: 'workout-card', action: 'goToTab:1' },
  { name: 'exercise-card', action: 'openWorkout:0' },
  { name: 'view-selector', action: null },
  { name: 'exercise-footer', action: null },
  { name: 'edit-button', action: null },
  { name: 'back-button', action: null },
  { name: 'graph-card', action: 'goBack+goToTab:2' },
];