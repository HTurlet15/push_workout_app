import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

/**
 * Column header for the Next view.
 * Main row (Set, Weight, Reps) styled with background like SetHeader.
 * Sub-labels (Current, Next) displayed below without background.
 * Weight columns are wider than Reps to accommodate "120.5 kg" values.
 */
export default function NextSetHeader() {
  return (
    <View>
      <View style={styles.mainRow}>
        <Text variant="subtitle" style={[styles.cell, styles.setCell, styles.mainLabel]}>
          Set
        </Text>

        <Text variant="subtitle" style={[styles.cell, styles.weightGroup, styles.mainLabel]}>
          Weight
        </Text>

        <Text variant="subtitle" style={[styles.cell, styles.repsGroup, styles.mainLabel]}>
          Reps
        </Text>
      </View>

      <View style={styles.subRow}>
        <View style={styles.setCell} />

        <View style={styles.weightSubGroup}>
        <Text variant="caption" style={styles.weightCurrentLabel}>
            Current
        </Text>
        <Text variant="caption" style={styles.weightNextLabel}>
            Next
        </Text>
        </View>

        <View style={styles.repsSubGroup}>
        <Text variant="caption" style={styles.repCurrentLabel}>
            Current
        </Text>
        <Text variant="caption" style={styles.repNextLabel}>
            Next
        </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.sm,
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: RADIUS.sm,
        borderTopRightRadius: RADIUS.sm,
        borderBottomWidth : 1,
        borderColor : COLORS.darkGray,
        gap : SPACING.sm,
    },
    subRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        gap : SPACING.sm,
    },
    cell: {
        textAlign: 'center',
    },
    mainLabel: {
        color: COLORS.textPrimary,
        fontWeight: '700',
    },
    setCell: {
        flex: 1,
    },

    weightGroup: {
        flex: 4,
    },
    repsGroup: {
        flex: 3,
    },

    weightSubGroup: {
        flex: 4,
        flexDirection: 'row',
    },
    repsSubGroup: {
        flex: 3,
        flexDirection: 'row',
    },
    

    weightCurrentLabel: {
    flex: 1,
    textAlign: 'center',
    },
    weightNextLabel: {
    flex: 2,
    textAlign: 'center',
    },
    repCurrentLabel : {
        flex: 1,
        textAlign: 'center',
    },
    repNextLabel : {
        flex: 1,
        textAlign: 'center',
    },
});