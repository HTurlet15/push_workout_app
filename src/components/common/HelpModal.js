import { View, Pressable, Modal, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SHADOW } from '../../theme/theme';

// Icon mapping per section — icons are visual, not translatable
const HELP_ICONS = {
  programs: ['layers', 'check-circle', 'chevron-down', 'edit-2'],
  workouts: ['zap', 'chevron-down', 'clock', 'edit-2'],
  workout: ['grid', 'chevrons-right', 'calendar', 'clock', 'target', 'repeat', 'edit-2'],
  graphs: ['trending-up', 'arrow-up', 'bar-chart-2'],
  graphDetail: ['trending-up', 'list', 'arrow-up'],
};

export default function HelpModal({ visible, onClose, screen = 'programs' }) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const icons = HELP_ICONS[screen];
  if (!icons) return null;

  const [headerHeight, setHeaderHeight] = useState(0);
  const [buttonHeight, setButtonHeight] = useState(0);

  const bottomPad = Math.max(insets.bottom, SPACING.lg);
  const sheetMaxHeight = height * 0.7;

  // ScrollView takes whatever space remains after header + button are measured
  const scrollMaxHeight = headerHeight && buttonHeight
    ? sheetMaxHeight - headerHeight - buttonHeight - bottomPad
    : sheetMaxHeight * 0.6;

  const sections = icons.map((icon, i) => ({
    icon,
    title: t(`help.${screen}.s${i}_title`),
    text: t(`help.${screen}.s${i}_text`),
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Gray zone above sheet — tap to close */}
        <Pressable style={styles.backdropClose} onPress={onClose} />

        {/* Sheet */}
        <View style={[styles.sheet, { paddingBottom: bottomPad }]}>

          {/* Handle + Header — measured together */}
          <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
            <View style={styles.handleBar}>
              <View style={styles.handle} />
            </View>

            <View style={styles.header}>
              <Text style={styles.screenTitle}>{t(`help.${screen}.title`)}</Text>
              <Pressable style={styles.closeBtn} onPress={onClose}>
                <Feather name="x" size={20} color={COLORS.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* ScrollView — maxHeight calculated from remaining space */}
          <ScrollView
            style={{ maxHeight: scrollMaxHeight }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces
          >
            {sections.map((section, index) => (
              <View key={index} style={styles.section}>
                <View style={styles.iconCircle}>
                  <Feather name={section.icon} size={18} color={COLORS.textPrimary} />
                </View>
                <View style={styles.sectionBody}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionText}>{section.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Done button — measured */}
          <View onLayout={(e) => setButtonHeight(e.nativeEvent.layout.height)}>
            <Pressable
              style={({ pressed }) => [styles.doneBtn, pressed && styles.doneBtnPressed]}
              onPress={onClose}
            >
              <Text style={styles.doneBtnText}>{t('help.done')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  backdropClose: {
    flex: 1,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: SPACING.smd,
    paddingBottom: SPACING.md,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  screenTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    paddingBottom: SPACING.md,
  },
  section: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.smd,
    marginTop: 2,
  },
  sectionBody: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  sectionText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  doneBtn: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: SPACING.smd,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  doneBtnPressed: {
    opacity: 0.85,
  },
  doneBtnText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.white,
  },
});
