import { View, Animated, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';
import { COLORS, FONT_FAMILY } from '../../theme/theme';

/**
 * Animated splash screen — "Push." logo.
 *
 * Sequence:
 * 1. "Push" fades in + scales from 0.92 → 1 (0.8s)
 * 2. "." pops in with overshoot (0.4s, delayed)
 * 3. "workout tracker" fades up (0.4s)
 * 4. Hold for a beat
 * 5. Everything fades out (0.4s)
 * 6. Calls onFinish
 *
 * @param {Function} onFinish - Called when animation completes.
 */
export default function SplashScreen({ onFinish }) {
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordScale = useRef(new Animated.Value(0.92)).current;
  const dotScale = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current; 
  const taglineTranslate = useRef(new Animated.Value(3)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Word fade in + scale
      Animated.parallel([
        Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(wordScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),

      // Small pause
      Animated.delay(100),

      // 2. Dot pop
      Animated.parallel([
        Animated.spring(dotScale, {
          toValue: 1,
          friction: 5,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),

      // 3. Tagline fade up
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslate, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // 4. Hold
      Animated.delay(800),

      // 5. Fade out everything
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish?.();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <View style={styles.logoRow}>
        <Animated.Text
          style={[
            styles.word,
            {
              opacity: wordOpacity,
              transform: [{ scale: wordScale }],
            },
          ]}
        >
          Push
        </Animated.Text>
        <Animated.Text
          style={[
            styles.dot,
            {
              opacity: dotOpacity,
              transform: [{ scale: dotScale }],
            },
          ]}
        >
          .
        </Animated.Text>
      </View>

      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglineTranslate }],
          },
        ]}
      >
        WORKOUT TRACKER
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  word: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 42,
    letterSpacing: -1,
    color: COLORS.textPrimary,
  },
  dot: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 42,
    color: COLORS.textPrimary,
    marginLeft: 1,
  },
  tagline: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    letterSpacing: 4,
    color: '#B0B0B0',
    marginTop: 12,
  },
});