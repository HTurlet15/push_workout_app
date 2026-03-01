import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import Text from '../common/Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE, SHADOW } from '../../theme/theme';

/**
 * GraphDetail — drill-down view for a single workout.
 *
 * Shows multi-exercise line chart (one color per exercise) + legend,
 * followed by session history cards with per-exercise tonnage + deltas.
 *
 * @param {Object} session  - Session with history[], current.name, current.exercises.
 * @param {Function} onBack - Navigate back to graphs list.
 */

const CHART_W = 300;
const CHART_H = 130;
const PAD_L = 28;
const PAD_R = 10;
const PAD_T = 10;
const PAD_B = 20;

const LINE_COLORS = [
  '#1A1A1A', // black
  '#007AFF', // blue
  '#2E7D32', // green
  '#E65100', // orange
  '#C62828', // red
  '#7B1FA2', // purple
  '#00838F', // teal
  '#F9A825', // amber
];

const formatTonnage = (v) => {
  if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
  return `${v}`;
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateShort = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function GraphDetail({ session }) {
  const history = session.history || [];
  const name = session.current?.name || 'Workout';

  if (history.length < 2) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text variant="screenTitle">{name.toUpperCase()}</Text>
        </View>
        <Text style={styles.emptyText}>Not enough history data for charts.</Text>
      </ScrollView>
    );
  }

  // Get exercise names from current workout (live structure, reflects additions/removals)
  const currentExercises = session.current?.exercises || [];
  const exerciseNames = currentExercises.map((e) => e.name);

  // Also include any exercises that exist in history but were removed from current
  const historyExerciseNames = new Set(history.flatMap((h) => h.exercises.map((e) => e.name)));
  const allExerciseNames = [...new Set([...exerciseNames, ...historyExerciseNames])];

  // Compute min/max across all exercises (current + historical)
  const allTonnages = history.flatMap((h) => h.exercises.map((e) => e.tonnage));
  const minT = Math.min(...allTonnages);
  const maxT = Math.max(...allTonnages);
  const range = maxT - minT || 1;

  const plotW = CHART_W - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;
  const xStep = plotW / (history.length - 1);

  const toX = (i) => PAD_L + i * xStep;
  const toY = (v) => PAD_T + plotH - ((v - minT) / range) * plotH;

  // Grid
  const gridValues = [minT, minT + range / 3, minT + (range * 2) / 3, maxT];
  const gridYs = gridValues.map((v) => toY(v));

  // X labels
  const labelIndices = [0, Math.floor(history.length / 2), history.length - 1];

  // Overall change
  const latestTotal = history[history.length - 1].totalTonnage;
  const firstTotal = history[0].totalTonnage;
  const pctChange = ((latestTotal - firstTotal) / firstTotal * 100).toFixed(1);
  const isUp = latestTotal >= firstTotal;

  // Session cards (newest first)
  const reversedHistory = [...history].reverse();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Text variant="screenTitle">{name.toUpperCase()}</Text>
      </View>

      {/* Multi-line chart card */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Tonnage by Exercise</Text>
            <Text style={styles.chartSub}>Last {history.length} sessions</Text>
          </View>
          <View style={[styles.badge, isUp ? styles.badgeUp : styles.badgeDown]}>
            <Text style={[styles.badgeText, isUp ? styles.badgeTextUp : styles.badgeTextDown]}>
              {isUp ? '↑' : '↓'} {isUp ? '+' : ''}{pctChange}%
            </Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {allExerciseNames.map((exName, idx) => (
            <View key={exName} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: LINE_COLORS[idx % LINE_COLORS.length] }]} />
              <Text style={styles.legendText}>{exName}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartArea}>
          <Svg width="100%" height="100%" viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
            {gridYs.map((y, i) => (
              <Line key={`g${i}`} x1={PAD_L} y1={y} x2={CHART_W - PAD_R} y2={y} stroke={COLORS.lightGray} strokeWidth={1} />
            ))}
            {gridValues.map((v, i) => (
              <SvgText key={`yl${i}`} x={PAD_L - 4} y={gridYs[i] + 3} fontSize={9} fill={COLORS.textMuted} textAnchor="end" fontFamily="DM Sans">
                {formatTonnage(v)}
              </SvgText>
            ))}

            {allExerciseNames.map((exName, exIdx) => {
              const color = LINE_COLORS[exIdx % LINE_COLORS.length];
              // Only plot points where this exercise exists in history
              const pts = history
                .map((h, i) => {
                  const ex = h.exercises.find((e) => e.name === exName);
                  return ex ? { x: toX(i), y: toY(ex.tonnage), has: true } : null;
                })
                .filter(Boolean);
              if (pts.length < 2) return null; // Not enough data for a line
              const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
              return (
                <View key={exName}>
                  <Path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  {pts.map((p, i) => (
                    <Circle key={`${exName}-${i}`} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 2.5} fill={color} stroke={COLORS.white} strokeWidth={1.5} />
                  ))}
                </View>
              );
            })}

            {labelIndices.map((idx) => (
              <SvgText key={`xl${idx}`} x={toX(idx)} y={CHART_H - 2} fontSize={9} fill={COLORS.textMuted} textAnchor="middle" fontFamily="DM Sans">
                {formatDateShort(history[idx].date)}
              </SvgText>
            ))}
          </Svg>
        </View>
      </View>

      {/* Session history cards */}
      {reversedHistory.map((entry, idx) => {
        const prevEntry = idx < reversedHistory.length - 1 ? reversedHistory[idx + 1] : null;
        const opacity = Math.max(0.4, 1 - idx * 0.15);
        const isLatest = idx === 0;

        return (
          <View key={entry.date} style={[styles.sessionCard, { opacity }]}>
            <Text style={styles.sessionDate}>
              {formatDate(entry.date)}{isLatest ? ' — Latest' : ''}
            </Text>

            {entry.exercises.map((ex) => {
              const prevEx = prevEntry?.exercises.find((e) => e.name === ex.name);
              const delta = prevEx ? ex.tonnage - prevEx.tonnage : null;
              return (
                <View key={ex.name} style={styles.sessionRow}>
                  <Text style={styles.sessionExo}>{ex.name}</Text>
                  <View style={styles.sessionRight}>
                    <Text style={styles.sessionTonnage}>{ex.tonnage.toLocaleString()} kg</Text>
                    {delta !== null && (
                      <Text style={[styles.sessionDelta, delta >= 0 ? styles.deltaUp : styles.deltaDown]}>
                        {delta >= 0 ? '↑' : '↓'} {delta >= 0 ? '+' : ''}{delta}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}

            <View style={styles.sessionTotal}>
              <Text style={styles.totalLabel}>Total</Text>
              <View style={styles.sessionRight}>
                <Text style={styles.totalValue}>{entry.totalTonnage.toLocaleString()} kg</Text>
                {prevEntry && (
                  <Text style={[
                    styles.sessionDelta,
                    entry.totalTonnage >= prevEntry.totalTonnage ? styles.deltaUp : styles.deltaDown,
                  ]}>
                    {entry.totalTonnage >= prevEntry.totalTonnage ? '↑' : '↓'} {entry.totalTonnage >= prevEntry.totalTonnage ? '+' : ''}{entry.totalTonnage - prevEntry.totalTonnage}
                  </Text>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xxl },
  headerSection: { alignItems: 'center', paddingVertical: SPACING.md },
  emptyText: { fontSize: FONT_SIZE.sm, fontFamily: FONT_FAMILY.medium, color: COLORS.textSecondary, textAlign: 'center', padding: SPACING.xl },

  // Chart card
  chartCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, ...SHADOW.card, marginBottom: SPACING.smd, overflow: 'hidden' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: SPACING.md, paddingBottom: 0 },
  chartTitle: { fontSize: FONT_SIZE.md, fontFamily: FONT_FAMILY.bold, color: COLORS.textPrimary },
  chartSub: { fontSize: FONT_SIZE.xs, fontFamily: FONT_FAMILY.medium, color: COLORS.textSecondary, marginTop: SPACING.xxs },

  badge: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.sm },
  badgeUp: { backgroundColor: COLORS.successLight },
  badgeDown: { backgroundColor: COLORS.errorLight },
  badgeText: { fontSize: FONT_SIZE.xs, fontFamily: FONT_FAMILY.bold },
  badgeTextUp: { color: COLORS.success },
  badgeTextDown: { color: COLORS.error },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.smd, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xsm },
  legendDot: { width: SIZE.dotLg, height: SIZE.dotLg, borderRadius: SIZE.dotLg / 2 },
  legendText: { fontSize: FONT_SIZE.xs, fontFamily: FONT_FAMILY.semibold, color: COLORS.textSecondary },

  chartArea: { height: 170, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },

  // Session cards
  sessionCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, ...SHADOW.card, marginBottom: SPACING.smd, padding: SPACING.md },
  sessionDate: { fontSize: FONT_SIZE.sm, fontFamily: FONT_FAMILY.semibold, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  sessionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderTopWidth: SIZE.border, borderTopColor: COLORS.lightGray },
  sessionExo: { fontSize: FONT_SIZE.caption, fontFamily: FONT_FAMILY.medium, color: COLORS.textPrimary },
  sessionRight: { flexDirection: 'row', alignItems: 'center' },
  sessionTonnage: { fontSize: FONT_SIZE.caption, fontFamily: FONT_FAMILY.bold, color: COLORS.textPrimary },
  sessionDelta: { fontSize: FONT_SIZE.xs, fontFamily: FONT_FAMILY.bold, marginLeft: SPACING.xsm },
  deltaUp: { color: COLORS.success },
  deltaDown: { color: COLORS.error },
  sessionTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.smd, borderTopWidth: SIZE.border, borderTopColor: COLORS.lightGray, marginTop: SPACING.xs },
  totalLabel: { fontSize: FONT_SIZE.caption, fontFamily: FONT_FAMILY.bold, color: COLORS.textPrimary },
  totalValue: { fontSize: FONT_SIZE.md, fontFamily: FONT_FAMILY.bold, color: COLORS.textPrimary },
});