import { View, Pressable, StyleSheet, useWindowDimensions, FlatList, Animated } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { getLocales } from 'expo-localization';
import Svg, { Rect, Circle, Line, Path, G } from 'react-native-svg';
import Text from '../components/common/Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY } from '../theme/theme';

// ── SVG Illustrations ────────────────────────────────────────

function WelcomeIllustration() {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Dumbbell */}
      <G transform="translate(100,100)">
        {/* Bar */}
        <Rect x={-60} y={-4} width={120} height={8} rx={4} fill={COLORS.textPrimary} />
        {/* Left plates */}
        <Rect x={-70} y={-20} width={14} height={40} rx={4} fill={COLORS.textPrimary} />
        <Rect x={-80} y={-16} width={8} height={32} rx={3} fill={COLORS.textSecondary} />
        {/* Right plates */}
        <Rect x={56} y={-20} width={14} height={40} rx={4} fill={COLORS.textPrimary} />
        <Rect x={72} y={-16} width={8} height={32} rx={3} fill={COLORS.textSecondary} />
      </G>
      {/* Sparkles */}
      <Circle cx={50} cy={50} r={3} fill={COLORS.success} />
      <Circle cx={160} cy={60} r={2.5} fill={COLORS.success} />
      <Circle cx={40} cy={140} r={2} fill={COLORS.viewCurrent} />
      <Circle cx={155} cy={145} r={3} fill={COLORS.viewCurrent} />
    </Svg>
  );
}

function ProgramsIllustration() {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Stack of cards */}
      <G>
        {/* Back card */}
        <Rect x={40} y={35} width={130} height={50} rx={10} fill={COLORS.lightGray} />
        {/* Middle card */}
        <Rect x={32} y={55} width={140} height={50} rx={10} fill={COLORS.mediumGray} />
        {/* Front card */}
        <Rect x={24} y={75} width={150} height={55} rx={10} fill={COLORS.white} stroke={COLORS.textPrimary} strokeWidth={2} />
        {/* Radio button */}
        <Circle cx={48} cy={102} r={10} fill="none" stroke={COLORS.textPrimary} strokeWidth={2} />
        <Circle cx={48} cy={102} r={5} fill={COLORS.textPrimary} />
        {/* Text lines */}
        <Rect x={68} y={93} width={70} height={8} rx={4} fill={COLORS.textPrimary} />
        <Rect x={68} y={107} width={50} height={6} rx={3} fill={COLORS.textMuted} />
        {/* Chevron */}
        <Path d="M155 97 L162 102 L155 107" stroke={COLORS.textMuted} strokeWidth={2} fill="none" strokeLinecap="round" />
      </G>
      {/* Accent dot */}
      <Circle cx={165} cy={50} r={3} fill={COLORS.viewCurrent} />
    </Svg>
  );
}

function WorkoutsIllustration() {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Exercise card with table */}
      <Rect x={20} y={40} width={160} height={120} rx={12} fill={COLORS.white} stroke={COLORS.viewCurrent} strokeWidth={2.5} />
      {/* Left accent border */}
      <Rect x={20} y={52} width={3} height={96} fill={COLORS.viewCurrent} />
      {/* Title */}
      <Rect x={36} y={52} width={80} height={8} rx={4} fill={COLORS.textPrimary} />
      {/* Header row */}
      <Rect x={36} y={70} width={24} height={6} rx={3} fill={COLORS.textMuted} />
      <Rect x={72} y={70} width={32} height={6} rx={3} fill={COLORS.textMuted} />
      <Rect x={116} y={70} width={24} height={6} rx={3} fill={COLORS.textMuted} />
      <Rect x={150} y={70} width={20} height={6} rx={3} fill={COLORS.textMuted} />
      {/* Row 1 - completed (green) */}
      <Rect x={32} y={84} width={140} height={20} rx={6} fill={COLORS.successLight} />
      <Rect x={40} y={90} width={16} height={8} rx={3} fill={COLORS.success} />
      <Rect x={72} y={90} width={32} height={8} rx={3} fill={COLORS.success} />
      <Rect x={120} y={90} width={16} height={8} rx={3} fill={COLORS.success} />
      <Rect x={150} y={90} width={16} height={8} rx={3} fill={COLORS.success} />
      {/* Row 2 - completed (green) */}
      <Rect x={32} y={108} width={140} height={20} rx={6} fill={COLORS.successLight} />
      <Rect x={40} y={114} width={16} height={8} rx={3} fill={COLORS.success} />
      <Rect x={72} y={114} width={32} height={8} rx={3} fill={COLORS.success} />
      <Rect x={120} y={114} width={16} height={8} rx={3} fill={COLORS.success} />
      <Rect x={150} y={114} width={16} height={8} rx={3} fill={COLORS.success} />
      {/* Row 3 - empty */}
      <Rect x={40} y={138} width={16} height={8} rx={3} fill={COLORS.lightGray} />
      <Rect x={72} y={138} width={32} height={8} rx={3} fill={COLORS.lightGray} />
      <Rect x={120} y={138} width={16} height={8} rx={3} fill={COLORS.lightGray} />
      <Rect x={150} y={138} width={16} height={8} rx={3} fill={COLORS.lightGray} />
      {/* View selector pill */}
      <Rect x={120} y={44} width={52} height={18} rx={9} fill={COLORS.viewCurrent} />
      <Rect x={130} y={50} width={32} height={6} rx={3} fill={COLORS.white} />
    </Svg>
  );
}

function TimerIllustration() {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Timer circle */}
      <Circle cx={100} cy={95} r={55} fill="none" stroke={COLORS.lightGray} strokeWidth={6} />
      <Path
        d="M100 40 A55 55 0 1 1 55.1 125"
        fill="none"
        stroke={COLORS.textPrimary}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Timer text */}
      <Rect x={75} y={85} width={50} height={14} rx={4} fill={COLORS.textPrimary} />
      {/* Top button */}
      <Rect x={94} y={30} width={12} height={8} rx={3} fill={COLORS.textPrimary} />
      {/* Bottom bar with icons */}
      <Rect x={20} y={170} width={160} height={24} rx={12} fill={COLORS.lightGray} />
      {/* Play button */}
      <Circle cx={70} cy={182} r={8} fill={COLORS.success} opacity={0.3} />
      <Path d="M68 178 L74 182 L68 186 Z" fill={COLORS.success} />
      {/* Timer icon */}
      <Rect x={95} y={178} width={20} height={8} rx={4} fill={COLORS.textMuted} />
      {/* Edit button */}
      <Circle cx={140} cy={182} r={8} fill={COLORS.textPrimary} />
      <Path d="M137 182 L140 179 L143 182 L140 185 Z" fill={COLORS.white} />
    </Svg>
  );
}

function GraphsIllustration() {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Card background */}
      <Rect x={20} y={40} width={160} height={120} rx={12} fill={COLORS.white} stroke={COLORS.lightGray} strokeWidth={1.5} />
      {/* Title area */}
      <Rect x={36} y={54} width={60} height={8} rx={4} fill={COLORS.textPrimary} />
      <Rect x={36} y={66} width={40} height={6} rx={3} fill={COLORS.textMuted} />
      {/* Badge */}
      <Rect x={130} y={52} width={36} height={18} rx={9} fill={COLORS.successLight} />
      <Rect x={138} y={58} width={20} height={6} rx={3} fill={COLORS.success} />
      {/* Chart line going up */}
      <Path
        d="M36 140 L56 132 L76 135 L96 120 L116 118 L136 108 L156 95 L168 90"
        fill="none"
        stroke={COLORS.textPrimary}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Area fill */}
      <Path
        d="M36 140 L56 132 L76 135 L96 120 L116 118 L136 108 L156 95 L168 90 L168 148 L36 148 Z"
        fill={COLORS.textPrimary}
        opacity={0.06}
      />
      {/* Data points */}
      <Circle cx={36} cy={140} r={3} fill={COLORS.textPrimary} />
      <Circle cx={76} cy={135} r={3} fill={COLORS.textPrimary} />
      <Circle cx={116} cy={118} r={3} fill={COLORS.textPrimary} />
      <Circle cx={168} cy={90} r={3} fill={COLORS.textPrimary} />
      {/* ? help icon hint */}
      <Circle cx={170} cy={36} r={10} fill={COLORS.lightGray} />
      <Rect x={167} y={33} width={6} height={6} rx={3} fill={COLORS.textMuted} />
    </Svg>
  );
}

// ── Slide Data ───────────────────────────────────────────────

const SLIDES = [
  {
    id: 'welcome',
    Illustration: WelcomeIllustration,
    en: { title: 'Welcome to Push.', subtitle: 'Your minimalist workout tracker.\nTrack sets, reps, and tonnage — nothing more, nothing less.' },
    fr: { title: 'Bienvenue sur Push.', subtitle: 'Votre tracker de musculation minimaliste.\nSuivez vos séries, reps et tonnage — rien de plus, rien de moins.' },
  },
  {
    id: 'programs',
    Illustration: ProgramsIllustration,
    en: { title: 'Build Your Programs', subtitle: 'Create training programs and organize your workouts inside them. Select one to get started.' },
    fr: { title: 'Créez vos programmes', subtitle: 'Créez des programmes et organisez vos séances. Sélectionnez-en un pour commencer.' },
  },
  {
    id: 'workouts',
    Illustration: WorkoutsIllustration,
    en: { title: 'Track Every Set', subtitle: 'Fill in weight, reps, and RIR. See your previous session side by side. Completed sets turn green.' },
    fr: { title: 'Suivez chaque série', subtitle: 'Entrez poids, reps et RIR. Consultez la séance précédente côte à côte. Les séries complétées passent en vert.' },
  },
  {
    id: 'timer',
    Illustration: TimerIllustration,
    en: { title: 'Rest Timer & Edit Mode', subtitle: 'Built-in rest timer for each exercise. Use edit mode to customize everything — exercises, sets, rep ranges.' },
    fr: { title: 'Timer & mode édition', subtitle: 'Timer de repos intégré pour chaque exercice. Le mode édition permet de tout personnaliser — exercices, séries, fourchettes de reps.' },
  },
  {
    id: 'graphs',
    Illustration: GraphsIllustration,
    en: { title: 'Watch Your Progress', subtitle: 'Track your tonnage progression over time. Tap any graph for a detailed breakdown.\n\nNeed help? Look for the  ?  button.' },
    fr: { title: 'Suivez votre progression', subtitle: "Suivez l'évolution de votre tonnage. Appuyez sur un graphique pour le détail.\n\nBesoin d'aide ? Cherchez le bouton  ?  en haut de chaque page." },
  },
];

// ── Onboarding Screen ────────────────────────────────────────

export default function OnboardingScreen({ onFinish }) {
  const { width } = useWindowDimensions();
  const deviceLang = getLocales()?.[0]?.languageCode === 'fr' ? 'fr' : 'en';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState(deviceLang);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isLast = currentIndex === SLIDES.length - 1;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const renderSlide = ({ item, index }) => {
    const t = item[lang] || item.en;
    const Illustration = item.Illustration;

    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.illustrationContainer}>
          <Illustration />
        </View>
        <Text style={styles.slideTitle}>{t.title}</Text>
        <Text style={styles.slideSubtitle}>{t.subtitle}</Text>
      </View>
    );
  };

  const t = SLIDES[currentIndex]?.[lang] || SLIDES[currentIndex]?.en;

  return (
    <View style={styles.container}>
      {/* Language toggle */}
      <View style={styles.topBar}>
        <View style={styles.langToggle}>
          <Pressable
            style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
            onPress={() => setLang('en')}
          >
            <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>EN</Text>
          </Pressable>
          <Pressable
            style={[styles.langBtn, lang === 'fr' && styles.langBtnActive]}
            onPress={() => setLang('fr')}
          >
            <Text style={[styles.langText, lang === 'fr' && styles.langTextActive]}>FR</Text>
          </Pressable>
        </View>
      </View>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      />

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        {/* Skip */}
        {!isLast ? (
          <Pressable style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>{lang === 'fr' ? 'Passer' : 'Skip'}</Text>
          </Pressable>
        ) : (
          <View style={styles.skipBtn} />
        )}

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const scale = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [1, 1.3, 1],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { opacity, transform: [{ scale }] },
                  i === currentIndex && styles.dotActive,
                ]}
              />
            );
          })}
        </View>

        {/* Next / Get Started */}
        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && styles.nextBtnPressed]}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>
            {isLast
              ? (lang === 'fr' ? "C'est parti" : 'Get Started')
              : (lang === 'fr' ? 'Suivant' : 'Next')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  langToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: RADIUS.xs,
    padding: 1.5,
  },
  langBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.smd,
    borderRadius: RADIUS.xs,
  },
  langBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  langText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textMuted,
  },
  langTextActive: {
    color: COLORS.textPrimary,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  illustrationContainer: {
    marginBottom: SPACING.xxl,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 26,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  slideSubtitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.sm,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  skipBtn: {
    width: 80,
    paddingVertical: SPACING.sm,
  },
  skipText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textMuted,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.textPrimary,
  },
  dotActive: {
    backgroundColor: COLORS.textPrimary,
  },
  nextBtn: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: SPACING.smd,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    minWidth: 80,
    alignItems: 'center',
  },
  nextBtnPressed: {
    opacity: 0.85,
  },
  nextText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.white,
  },
});