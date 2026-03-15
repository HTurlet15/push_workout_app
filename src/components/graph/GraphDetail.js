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

const computeLiveEntry = (current) => {
  if (!current?.exercises?.length) return null;
  let hasAnyFilled = false;
  const exercises = current.exercises.map((ex) => {
    const tonnage = ex.sets.reduce((sum, set) => {
      const wDone = set.weight?.state === 'filled' || set.weight?.state === 'plannedFilled';
      const rDone = set.reps?.state === 'filled' || set.reps?.state === 'plannedFilled';
      if (!wDone || !rDone) return sum;
      hasAnyFilled = true;
      const w = typeof set.weight.value === 'object' ? (set.weight.value.kg ?? 0) : (set.weight.value ?? 0);
      const r = set.reps.value ?? 0;
      return sum + (w * r);
    }, 0);
    return { name: ex.name, tonnage: Math.round(tonnage) };
  });
  if (!hasAnyFilled) return null;
  const totalTonnage = exercises.reduce((sum, e) => sum + e.tonnage, 0);
  return { date: new Date().toISOString(), exercises, totalTonnage, isLive: true };
};

export default function GraphDetail({ session }) {
  const history = session.history || [];
  const name = session.current?.name || 'Workout';
  const liveEntry = computeLiveEntry(session.current);
  const allData = liveEntry ? [...history, liveEntry] : history;

  if (allData.length === 0) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text variant="screenTitle">{name.toUpperCase()}</Text>
        </View>
        <Text style={styles.emptyText}>Aucune donnée.</Text>
      </ScrollView>
    );
  }

  // Get exercise names from current workout (live structure, reflects additions/removals)
  const currentExercises = session.current?.exercises || [];
  const exerciseNames = currentExercises.map((e) => e.name);

  // Also include any exercises that exist in history but were removed from current
  const historyExerciseNames = new Set(allData.flatMap((h) => h.exercises.map((e) => e.name)));
  const allExerciseNames = [...new Set([...exerciseNames, ...historyExerciseNames])];

  // Compute min/max across all data points
  const allTonnages = allData.flatMap((h) => h.exercises.map((e) => e.tonnage));
  const minT = Math.min(...allTonnages);
  const maxT = Math.max(...allTonnages);
  const range = maxT - minT || 1;

  const plotW = CHART_W - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;
  const hasMultiple = allData.length >= 2;

  const toX = (i) => hasMultiple
    ? PAD_L + i * (plotW / (allData.length - 1))
    : PAD_L + plotW / 2;
  const toY = (v) => hasMultiple
    ? PAD_T + plotH - ((v - minT) / range) * plotH
    : PAD_T + plotH / 2;

  // Grid
  const gridValues = hasMultiple ? [minT, minT + range / 3, minT + (range * 2) / 3, maxT] : [minT];
  const gridYs = gridValues.map((v) => toY(v));

  // X labels
  const labelIndices = hasMultiple
    ? [...new Set([0, Math.floor(allData.length / 2), allData.length - 1])]
    : [0];

  // Overall change
  const latestTotal = allData[allData.length - 1].totalTonnage;
  const firstTotal = allData[0].totalTonnage;
  const pctChange = ((latestTotal - firstTotal) / firstTotal * 100).toFixed(1);
  const isUp = latestTotal >= firstTotal;

  // Session cards (newest first)
  const reversedAllData = [...allData].reverse();

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
            <Text style={styles.chartSub}>
              {history.length} session{history.length !== 1 ? 's' : ''}{liveEntry ? ' · En cours' : ''}
            </Text>
          </View>
          {hasMultiple && (
            <View style={[styles.badge, isUp ? styles.badgeUp : styles.badgeDown]}>
              <Text style={[styles.badgeText, isUp ? styles.badgeTextUp : styles.badgeTextDown]}>
                {isUp ? '↑' : '↓'} {isUp ? '+' : ''}{pctChange}%
              </Text>
            </View>
          )}
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
              const pts = allData
                .map((h, i) => {
                  const ex = h.exercises.find((e) => e.name === exName);
                  return ex ? { x: toX(i), y: toY(ex.tonnage), isLive: !!h.isLive } : null;
                })
                .filter(Boolean);
              if (pts.length === 0) return null;

              // Split solid path (all but last if live) from dashed live segment
              const solidPts = liveEntry ? pts.slice(0, -1) : pts;
              const solidPath = solidPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
              const livePt = liveEntry ? pts[pts.length - 1] : null;
              const livePath = livePt && solidPts.length >= 1
                ? `M${solidPts[solidPts.length - 1].x},${solidPts[solidPts.length - 1].y} L${livePt.x},${livePt.y}`
                : null;

              return (
                <View key={exName}>
                  {solidPts.length >= 2 && (
                    <Path d={solidPath} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                  {livePath && (
                    <Path d={livePath} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeDasharray="5,4" opacity={0.7} />
                  )}
                  {pts.map((p, i) => (
                    <Circle
                      key={`${exName}-${i}`}
                      cx={p.x} cy={p.y}
                      r={i === pts.length - 1 ? 4 : 2.5}
                      fill={p.isLive ? COLORS.viewNext : color}
                      stroke={COLORS.white}
                      strokeWidth={1.5}
                    />
                  ))}
                </View>
              );
            })}

            {labelIndices.map((idx) => (
              <SvgText key={`xl${idx}`} x={toX(idx)} y={CHART_H - 2} fontSize={9} fill={liveEntry && idx === allData.length - 1 ? COLORS.viewNext : COLORS.textMuted} textAnchor="middle" fontFamily="DM Sans">
                {liveEntry && idx === allData.length - 1 ? 'Now' : formatDateShort(allData[idx].date)}
              </SvgText>
            ))}
          </Svg>
        </View>
      </View>

      {/* Session history cards */}
      {reversedAllData.map((entry, idx) => {
        const prevEntry = idx < reversedAllData.length - 1 ? reversedAllData[idx + 1] : null;
        const opacity = entry.isLive ? 1 : Math.max(0.4, 1 - idx * 0.15);

        return (
          <View key={entry.isLive ? 'live' : entry.date} style={[styles.sessionCard, { opacity }]}>
            <Text style={[styles.sessionDate, entry.isLive && { color: COLORS.viewNext }]}>
              {entry.isLive ? 'En cours' : formatDate(entry.date)}{idx === 0 && !entry.isLive ? ' — Latest' : ''}
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