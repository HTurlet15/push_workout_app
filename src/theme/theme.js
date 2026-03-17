/**
 * Push - Design System Tokens
 *
 * Single source of truth for all visual styling across the app.
 * Every component must reference these tokens instead of hardcoding values.
 * Built around a minimal, monochromatic aesthetic inspired by modern fintech apps.
 *
 * Structure:
 * - COLORS:      Semantic color palette organized by purpose
 * - SPACING:     Consistent spacing scale (4px base unit)
 * - FONT_SIZE:   Typography scale mapped to component roles
 * - FONT_WEIGHT: Named weight values for readability
 * - FONT_FAMILY: DM Sans variants loaded via expo-google-fonts
 * - RADIUS:      Border radius scale from subtle to fully round
 * - SIZE:        Fixed dimensions for interactive elements and layout
 * - SHADOW:      Reusable elevation presets for cards, bars, and modals
 */

// ─── COLORS ────────────────────────────────────────────────

export const COLORS = {
  // Core neutrals
  white: '#FFFFFF',
  black: '#1A1A1A',
  screenBackground: '#F7F7F7',

  // Typography hierarchy
  textPrimary: '#1A1A1A',     // Headings, filled values, active content
  textSecondary: '#8E8E93',   // Labels, captions, inactive content
  textMuted: '#C0C0C0',       // Set numbers, placeholder-level text

  // Neutral palette
  lightGray: '#F7F7F7',       // Badge backgrounds, subtle fills
  mediumGray: '#C0C0C0',      // Borders, disabled states, dashed outlines
  selectedInput: '#D6D6D6',   // Input selection highlight

  // Primary accent
  blue: '#007AFF',            // Active input border, interactive highlights

  // Semantic status colors
  success: '#2E7D32',         // Completed sets, positive indicators
  successLight: '#E8F5E9',    // Completed row background
  successBadge: '#D4EDDA',    // Completed badge fill
  error: '#C62828',           // Delete actions, negative deltas
  errorLight: '#FFEBEE',      // Delete button background
  errorPressed: '#FFCDD2',    // Delete button pressed state

  // Badge system (SetInput component)
  badgeBackground: '#F8F8F8', // Default badge fill
  badgePressed: '#ECECEC',    // Badge touch feedback
  badgeTextPreFill : '#b1b1b1',

  // Timer states (BottomBar + TimerPicker)
  timerIdle: '#C0C0C0',
  timerActive: '#E65100',
  timerActiveBg: '#FFF3E0',
  timerDone: '#2E7D32',
  timerDoneBg: '#E8F5E9',
  timerResetBg: '#F4F4F4',
  timerIdlePressedBg: '#C8E6C9',
  timerActivePressedBg: '#FFE0B2',
  timerDonePressedBg: '#C8E6C9',
  timerResetPressedBg: '#EAEAEA',

  // Button states
  btnDarkPressed: '#333333',          // Dark button pressed feedback
  editBtnActivePressed: '#0066DD',    // Edit mode check button pressed

  // View accent system (Previous / Current / Next)
  viewPrevious: '#8E8E93',       // Gray - historical data
  viewPreviousBg: '#F7F7F7',     // Previous view header background
  viewCurrent: '#007AFF',        // Blue - active session
  viewCurrentBg: '#F7F7F7',      // Current view header background
  viewNext: '#E65100',           // Orange - planned future
  viewNextBg: '#F7F7F7',         // Next view header background

  // Next view delta system
  nextBadge: '#F8F8F8',            // Same gray as other views
  nextBadgeEdited : '#ffe6d9',
  nextBadgeText: '#b1b1b1',        // Secondary text like Previous view
  nextBadgeBorder: '#E8E8E8',      // Subtle gray border
  nextEdited: '#1A1A1A',           // User-edited next value text
  deltaUp: '#2E7D32',              // Positive change indicator (↑)
  deltaDown: '#C62828',            // Negative change indicator (↓)
  deltaSame: '#C0C0C0',           // No change indicator (=)

  // Note system (ExerciseNote component)
  noteBackground: '#FFFDE7',          // Warm yellow strip background
  noteBorder: '#FDD835',              // Left accent border
  noteText: '#8D6E00',                // Note content text
  notePlaceholder: '#BDA200',         // "add note..." placeholder text
  noteBackgroundPressed: '#FFF9C4',   // Touch feedback on note strip

  // Edit mode
  addExercisePressed: '#EBF3FF',      // Touch feedback on add Exercise button

  // Shadow base color (used in SHADOW presets)
  shadow: '#000000',
};

// ─── GRAPH LINE COLORS ─────────────────────────────────────
// One color per exercise line in multi-exercise charts (GraphDetail).
// Order is intentional: starts with core neutrals, then accents.

export const GRAPH_LINE_COLORS = [
  '#1A1A1A', // black
  '#007AFF', // blue
  '#2E7D32', // green
  '#E65100', // orange
  '#C62828', // red
  '#7B1FA2', // purple
  '#00838F', // teal
  '#F9A825', // amber
];

// ─── SPACING ───────────────────────────────────────────────
// 4px base unit. Use multiples for consistent rhythm.

export const SPACING = {
  xxs: 1,   // Hairline: underline offsets, minimal margins
  xs: 4,    // Tight gaps: icon margins, inline spacing
  xsm: 6,  // Small comfortable gaps: footer padding, dot gaps
  sm: 8,    // Badge padding, row gaps, small margins
  smd: 10,  // Card inner gaps, exercise row vertical rhythm
  smm: 12,  // Comfortable padding: footer insets, note padding
  md: 16,   // Card padding, section margins, input padding
  mdl: 20,  // Pill horizontal padding, comfortable insets
  lg: 24,   // Section spacing, modal padding
  xl: 32,   // Screen-edge horizontal padding (BottomBar)
  xxl: 48,  // Scroll content bottom padding (above BottomBar)
};

// ─── FONT SIZES ────────────────────────────────────────────
// Mapped to specific component roles for clarity.

export const FONT_SIZE = {
  xs: 11,       // Delta indicators (↑3, ↓1.5, =)
  sm: 12,       // Table column headers, toggle labels, rest text, meta text
  caption: 13,  // Set numbers, note text, view selector badge, rest icon
  body: 14,     // Badge values, row content, default text
  md: 15,       // Subtitle text, secondary labels, check icon size
  lg: 17,       // Exercise names in card headers
  title: 20,    // Timer display, section titles
  xl: 34,       // Screen title (workout name)
  hero: 42,     // SplashScreen logo size
};

// ─── FONT WEIGHTS ──────────────────────────────────────────
// Named aliases for React Native numeric weight strings.

export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// ─── FONT FAMILIES ─────────────────────────────────────────
// DM Sans variants loaded in App.js via @expo-google-fonts/dm-sans.
// Use fontFamily instead of fontWeight for consistent cross-platform rendering.

export const FONT_FAMILY = {
  regular: 'DMSans-Regular',     // Body text, captions
  italic: 'DMSans-Italic',       // Notes (exercise annotations)
  medium: 'DMSans-Medium',       // Badge values, subtitle text
  semibold: 'DMSans-SemiBold',   // Headers, exercise names, buttons
  bold: 'DMSans-Bold',           // Screen titles, delta indicators
};

// ─── BORDER RADIUS ─────────────────────────────────────────

export const RADIUS = {
  xs: 6,      // Small badges, inline elements
  sm: 8,      // Input fields, buttons, table headers
  smd: 10,    // Number badges, compact cards
  md: 12,     // Cards, view selector badge, progress badge
  lg: 16,     // Modal containers, dashed action buttons
  pill: 20,   // Tab indicator pill, toggle indicator inner
  full: 999,  // Fully round (pills, circular buttons)
};

// ─── COMPONENT SIZES ───────────────────────────────────────
// Fixed pixel dimensions for interactive elements and layout alignment.

export const SIZE = {
  // Touch targets
  touchTarget: 44,     // Minimum recommended touch target (Apple HIG)
  touchTargetLg: 48,   // Larger touch target for primary actions
  cardRowHeight: 56,   // Standard card row height

  // BottomBar buttons
  iconBtn: 40,         // Square touch target for icon buttons
  roundBtn: 36,        // Circular play/reset buttons
  timerMinWidth: 56,   // Timer display minimum width for alignment

  // Icon sizes (progressive scale)
  iconTiny: 10,        // Smallest icons (set row delete X)
  iconXxs: 12,         // Tiny icons (exercise card delete X)
  iconXs: 14,          // Extra small icons (back chevrons)
  iconSm: 16,          // Small icons (play, reset, delete X)
  iconChevron: 18,     // Chevron arrows, add buttons
  iconMd: 20,          // Medium icons (edit pencil/check, card delete)
  iconLg: 22,          // Large icons (LLM chat bubble)

  // Dot indicators
  dotSm: 4,            // Exercise list bullet dots
  dotMd: 6,            // Session indicator dots
  dotLg: 8,            // Side navigation dots

  // Number badge (workout card)
  numberBadge: 36,     // Width/height of numbered badge

  // Set table layout
  tableHeaderHeight: 32,  // Reserved for future fixed header height
  deleteBtn: 20,          // Red delete circle diameter
  deleteBtnOuter: 24,     // Delete button outer touch area
  deltaBox: 32,           // Fixed-width delta indicator column

  // View selector
  viewSelectorWidth: 120, // Total width of Previous/Current/Next selector
  chevronSize: 20,        // Navigation arrow icon size

  // Timer picker
  wheelWidth: 80,          // Scroll wheel column width
  wheelItemHeight: 48,     // Individual wheel item height
  wheelVisibleItems: 5,    // Number of visible items in wheel

  // Card structure
  tableBorderLeft: 3,      // Colored left border on exercise cards
  noteBorderLeft: 3,       // Yellow left border on note strips

  // Border widths
  border: 1,               // Standard border (inputs, separators)
  borderAccent: 1.5,       // Accent borders (dashed add buttons, edit underlines)

  // Layout
  exerciseRowHeight: 40,   // Height per exercise row in workout card preview
};

// ─── SHADOWS ───────────────────────────────────────────────
// Reusable elevation presets. Spread into StyleSheet objects.
// Example: ...SHADOW.card

export const SHADOW = {
  /** Exercise table cards - subtle lift */
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  /** Bottom navigation bar - upward shadow */
  bottomBar: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 8,
  },
  /** Modal overlays (TimerPicker) - prominent elevation */
  modal: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: SPACING.xs },
    shadowOpacity: 0.1,
    shadowRadius: SPACING.md,
    elevation: 8,
  },
};