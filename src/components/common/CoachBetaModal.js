import { View, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_FAMILY, FONT_SIZE, SHADOW } from '../../theme/theme';

const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeX39x83eZKE3ke1V3GDPGmn4FKZ_wy7hO7wSHh4owwcwjgpg/formResponse';
const EMAIL_ENTRY = 'entry.1681494320';

const BULLET_KEYS = ['bullet1', 'bullet2', 'bullet3', 'bullet4'];

/**
 * Full-screen overlay modal promoting the upcoming Coach IA feature.
 *
 * Displays a teaser card with feature bullets and an email capture form.
 * Submits the email to a Google Form and shows a confirmation message on success.
 *
 * @param {Function} onClose - Called when the user taps "Close".
 */
export default function CoachBetaModal({ onClose }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus('loading');
    try {
      await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `${EMAIL_ENTRY}=${encodeURIComponent(trimmed)}`,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.card}>
        {/* Star icon */}
        <Text style={styles.star}>✦</Text>

        {/* Title */}
        <Text style={styles.title}>{t('coach.betaTitle')}</Text>

        {/* Feature bullets */}
        <View style={styles.bullets}>
          {BULLET_KEYS.map((key) => (
            <View key={key} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>·</Text>
              <Text style={styles.bulletText}>{t(`coach.${key}`)}</Text>
            </View>
          ))}
        </View>

        {status === 'success' ? (
          <Text style={styles.successMsg}>{t('coach.successMsg')}</Text>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder={t('coach.emailPlaceholder')}
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {status === 'error' && (
              <Text style={styles.errorMsg}>Something went wrong. Try again.</Text>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.notifyBtn,
                pressed && styles.notifyBtnPressed,
                status === 'loading' && styles.notifyBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={status === 'loading'}
            >
              <Text style={styles.notifyBtnText}>{t('coach.notifyBtn')}</Text>
            </Pressable>
          </>
        )}

        <Pressable
          style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
          onPress={onClose}
        >
          <Text style={styles.closeBtnText}>{t('coach.closeBtn')}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },

  /** Transparent backdrop — tapping closes the modal */
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  /** Floating card anchored to bottom of screen */
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    ...SHADOW.modal,
  },

  star: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    fontFamily: FONT_FAMILY.bold,
  },

  title: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  bullets: {
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },

  bulletDot: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.body * 1.5,
  },

  bulletText: {
    flex: 1,
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.body * 1.5,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.smm,
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  errorMsg: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },

  notifyBtn: {
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.smm,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  notifyBtnPressed: {
    backgroundColor: COLORS.btnDarkPressed,
  },
  notifyBtnDisabled: {
    opacity: 0.5,
  },
  notifyBtnText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY.semibold,
    color: COLORS.white,
  },

  successMsg: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.success,
    marginBottom: SPACING.sm,
    lineHeight: FONT_SIZE.body * 1.5,
  },

  closeBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  closeBtnPressed: {
    backgroundColor: COLORS.lightGray,
  },
  closeBtnText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
});
