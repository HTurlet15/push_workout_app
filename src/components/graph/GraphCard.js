import { View, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import Text from '../common/Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE, SHADOW } from '../../theme/theme';

/**
 * GraphCard — displays a single workout's tonnage progression.
 *
 * Shows a line chart of totalTonnage over time with area fill.
 * Tapping opens drill-down detail view.
 *
 * @param {Object} session    - Session object with history[] and current.name.
 * @param {Function} onPress  - Callback when card is tapped.
 */

const CHART_W = 300;
const CHART_H = 100;
const PAD_L = 28;
const PAD_R = 10;
const PAD_T = 10;
const PAD_B = 20;

const formatTonnage = (v) => {
  if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
  return `${v}`;
};

const formatDate = (iso) => {
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

export default function GraphCard({ session, onPress, isFirst = false }) {
  const history = session.history || [];
  const name = session.current?.name || 'Workout';
  const liveEntry = computeLiveEntry(session.current);
  const allData = liveEntry ? [...history, liveEntry] : history;

  if (allData.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>No data</Text>
        </View>
      </View>
    );
  }

  const tonnages = allData.map((h) => h.totalTonnage);
  const minT = Math.min(...tonnages);
  const maxT = Math.max(...tonnages);
  const range = maxT - minT || 1;

  const latest = tonnages[tonnages.length - 1];
  const first = tonnages[0];
  const pctChange = ((latest - first) / first * 100).toFixed(1);
  const isUp = latest >= first;
  const hasMultiple = allData.length >= 2;

  const plotW = CHART_W - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;

  const toX = (i) => hasMultiple
    ? PAD_L + i * (plotW / (allData.length - 1))
    : PAD_L + plotW / 2;
  const toY = (v) => hasMultiple
    ? PAD_T + plotH - ((v - minT) / range) * plotH
    : PAD_T + plotH / 2;

  const points = tonnages.map((v, i) => ({ x: toX(i), y: toY(v) }));

  const solidPoints = liveEntry ? points.slice(0, -1) : points;
  const solidPath = solidPoints.length >= 2
    ? solidPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
    : null;
  const livePath = liveEntry && points.length >= 2
    ? `M${points[points.length - 2].x},${points[points.length - 2].y} L${points[points.length - 1].x},${points[points.length - 1].y}`
    : null;
  const areaPath = solidPath
    ? `${solidPath} L${solidPoints[solidPoints.length - 1].x},${CHART_H - PAD_B} L${solidPoints[0].x},${CHART_H - PAD_B} Z`
    : null;

  const gridValues = hasMultiple ? [minT, minT + range / 2, maxT] : [minT];
  const gridYs = gridValues.map((v) => toY(v));
  const labelIndices = hasMultiple
    ? [...new Set([0, Math.floor(allData.length / 2), allData.length - 1])]
    : [0];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>
            {liveEntry ? `En cours · ${formatTonnage(liveEntry.totalTonnage)} kg` : `Last: ${formatTonnage(latest)} kg`}
            {' · '}{history.length} session{history.length !== 1 ? 's' : ''}
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

      <View style={styles.chartContainer}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
          {gridYs.map((y, i) => (
            <Line key={`g${i}`} x1={PAD_L} y1={y} x2={CHART_W - PAD_R} y2={y} stroke={COLORS.lightGray} strokeWidth={1} />
          ))}
          {gridValues.map((v, i) => (
            <SvgText key={`yl${i}`} x={PAD_L - 4} y={gridYs[i] + 3} fontSize={9} fill={COLORS.textMuted} textAnchor="end" fontFamily="DM Sans">
              {formatTonnage(v)}
            </SvgText>
          ))}

          {areaPath && (
            <Path d={areaPath} fill={COLORS.textPrimary} opacity={0.06} />
          )}
          {solidPath && (
            <Path d={solidPath} stroke={COLORS.textPrimary} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {livePath && (
            <Path d={livePath} stroke={COLORS.viewNext} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeDasharray="5,4" />
          )}

          {points.map((p, i) => {
            const isLiveDot = liveEntry && i === points.length - 1;
            return (
              <Circle
                key={`d${i}`}
                cx={p.x} cy={p.y}
                r={i === points.length - 1 ? 4.5 : 3}
                fill={isLiveDot ? COLORS.viewNext : COLORS.textPrimary}
                stroke={COLORS.white}
                strokeWidth={2}
              />
            );
          })}

          {labelIndices.map((idx) => (
            <SvgText key={`xl${idx}`} x={toX(idx)} y={CHART_H - 2} fontSize={9} fill={liveEntry && idx === allData.length - 1 ? COLORS.viewNext : COLORS.textMuted} textAnchor="middle" fontFamily="DM Sans">
              {liveEntry && idx === allData.length - 1 ? 'Now' : formatDate(allData[idx].date)}
            </SvgText>
          ))}
        </Svg>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    marginBottom: SPACING.smd,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  badgeUp: {
    backgroundColor: COLORS.successLight,
  },
  badgeDown: {
    backgroundColor: COLORS.errorLight,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
  },
  badgeTextUp: {
    color: COLORS.success,
  },
  badgeTextDown: {
    color: COLORS.error,
  },
  chartContainer: {
    height: 150,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
});