/**
 * Tutorial step definitions.
 *
 * Each step has:
 * - id:          Unique key
 * - title:       Short bold heading
 * - text:        Explanation text
 * - action:      What the app should do before showing this step
 *                ('goToTab:0' = swipe to Programs, 'goToTab:1' = Workouts,
 *                 'openWorkout:0' = open first workout, 'goBack' = return to list,
 *                 'goToTab:2' = Graphs, null = no action)
 * - highlight:   Which area to highlight (used by MainScreen to measure layout)
 *                (null = full screen dim with centered text)
 * - position:    Where to place the tooltip ('top' | 'bottom' | 'center')
 */

const TUTORIAL_STEPS = [
  // ── Welcome ───────────────────────────────────────────────
  {
    id: 'welcome',
    title: 'Welcome to Push!',
    text: 'Ready for a quick tour of the app? It only takes a minute.',
    action: null,
    highlight: null,
    position: 'center',
    confirmLabel: "Let's go",
  },

  // ── Programs ──────────────────────────────────────────────
  {
    id: 'programs-intro',
    title: 'Programs',
    text: "This is where you manage your training programs. We've set up a starter program for you.",
    action: 'goToTab:0',
    highlight: 'programCard:0',
    position: 'bottom',
  },
  {
    id: 'programs-chevron',
    title: 'Preview Workouts',
    text: 'Tap the chevron to preview the workouts inside a program and the number of exercises per workout.',
    action: null,
    highlight: 'programChevron:0',
    position: 'bottom',
  },
  {
    id: 'programs-select',
    title: 'Select a Program',
    text: 'Tap the program card or the radio button to select it and load its workouts.',
    action: null,
    highlight: 'programRadio:0',
    position: 'bottom',
  },

  // ── Workouts ──────────────────────────────────────────────
  {
    id: 'workouts-intro',
    title: 'Your Workouts',
    text: 'Here are the workouts for your selected program. Tap the chevron to see exercises and rep ranges.',
    action: 'goToTab:1',
    highlight: 'workoutsList',
    position: 'bottom',
  },
  {
    id: 'workouts-open',
    title: 'Start a Session',
    text: 'Tap a workout card to open it and start your training session.',
    action: null,
    highlight: 'workoutCard:0',
    position: 'bottom',
  },

  // ── Inside Workout ────────────────────────────────────────
  {
    id: 'workout-current',
    title: 'Your Active Session',
    text: 'This is your current session. Each exercise shows sets with weight, reps, and RIR. Tap any value to fill it in — completed sets turn green.',
    action: 'openWorkout:0',
    highlight: 'exerciseCard:0',
    position: 'bottom',
  },
  {
    id: 'workout-previous',
    title: 'Previous Session',
    text: "Tap 'Previous' on the view selector to see what you did last session. Use it as a reference to track progress.",
    action: null,
    highlight: 'viewSelector:0',
    position: 'bottom',
  },
  {
    id: 'workout-next',
    title: 'Plan Ahead',
    text: "'Next' shows your planned targets for the upcoming session. You can edit the values to plan ahead.",
    action: null,
    highlight: 'viewSelector:0',
    position: 'bottom',
  },
  {
    id: 'workout-footer',
    title: 'Rest Timer & Rep Range',
    text: 'Each exercise has a rest timer and target rep range at the bottom. Tap the timer to start your rest countdown.',
    action: null,
    highlight: 'exerciseFooter:0',
    position: 'top',
  },
  {
    id: 'workout-edit',
    title: 'Edit Mode',
    text: 'Use the Edit button to add or remove exercises, sets, rename things, and adjust rest timers.',
    action: null,
    highlight: 'editButton',
    position: 'top',
  },

  // ── Back to list ──────────────────────────────────────────
  {
    id: 'workout-back',
    title: 'Going Back',
    text: "Tap the back arrow at the top or use your phone's back button to return to your workouts list.",
    action: null,
    highlight: 'backButton',
    position: 'bottom',
  },

  // ── Graphs ────────────────────────────────────────────────
  {
    id: 'graphs-intro',
    title: 'Track Your Progress',
    text: 'Swipe to the Graphs tab to see your tonnage progression over time. Tap any graph for a detailed breakdown per exercise.',
    action: 'goBack',
    secondaryAction: 'goToTab:2',
    highlight: 'graphsList',
    position: 'bottom',
  },

  // ── Done ──────────────────────────────────────────────────
  {
    id: 'done',
    title: "You're All Set!",
    text: 'Start building your program and tracking your workouts. Push yourself further every session.',
    action: 'goToTab:1',
    highlight: null,
    position: 'center',
    confirmLabel: 'Start Training',
  },
];

export default TUTORIAL_STEPS;
