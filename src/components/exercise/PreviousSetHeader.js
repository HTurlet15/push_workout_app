import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../common/Text';
import { COLORS, SPACING } from '../../theme/theme';

/**
 * Column header row for the Previous view set table.
 *
 * Identical layout to SetHeader (1:3:2:2 flex proportions)
 * but uses the Previous view background color for visual differentiation.
 */
export default function PreviousSetHeader() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="tableHeader" style={styles.setCell}>{t('exercise.header.set')}</Text>
      <Text variant="tableHeader" style={styles.weightCell}>{t('exercise.header.weight')}</Text>
      <Text variant="tableHeader" style={styles.repsCell}>{t('exercise.header.reps')}</Text>
      <Text variant="tableHeader" style={styles.rirCell}>{t('exercise.header.rir')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.viewPreviousBg,
  },
  setCell: { flex: 1, textAlign: 'center' },
  weightCell: { flex: 3, textAlign: 'center' },
  repsCell: { flex: 2, textAlign: 'center' },
  rirCell: { flex: 2, textAlign: 'center' },
});