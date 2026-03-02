import { View, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import Text from '../common/Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE, SHADOW } from '../../theme/theme';

const WalkthroughView = walkthroughable(View);

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

export default function GraphCard({ session, onPress, isFirst = false }) {
  const history = session.history || [];
  const name = session.current?.name || 'Workout';

  if (history.length < 2) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>Not enough data</Text>
        </View>
      </View>
    );
  }

  const tonnages = history.map((h) => h.totalTonnage);
  const minT = Math.min(...tonnages);
  const maxT = Math.max(...tonnages);
  const range = maxT - minT || 1;

  const latest = tonnages[tonnages.length - 1];
  const first = tonnages[0];
  const pctChange = ((latest - first) / first * 100).toFixed(1);
  const isUp = latest >= first;

  // Build SVG path
  const plotW = CHART_W - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_T - PAD_B;
  const xStep = plotW / (tonnages.length - 1);

  const toX = (i) => PAD_L + i * xStep;
  const toY = (v) => PAD_T + plotH - ((v - minT) / range) * plotH;

  const points = tonnages.map((v, i) => ({ x: toX(i), y: toY(v) }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${CHART_H - PAD_B} L${points[0].x},${CHART_H - PAD_B} Z`;

  // Y-axis grid (3 lines)
  const gridValues = [minT, minT + range / 2, maxT];
  const gridYs = gridValues.map((v) => toY(v));

  // X-axis labels (first, mid, last)
  const labelIndices = [0, Math.floor(history.length / 2), history.length - 1];

  const lastPoint = points[points.length - 1];

  const card = (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>
            Last: {formatTonnage(latest)} kg · {history.length} sessions
          </Text>
        </View>
        <View style={[styles.badge, isUp ? styles.badgeUp : styles.badgeDown]}>
          <Text style={[styles.badgeText, isUp ? styles.badgeTextUp : styles.badgeTextDown]}>
            {isUp ? '↑' : '↓'} {isUp ? '+' : ''}{pctChange}%
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
          {/* Grid lines */}
          {gridYs.map((y, i) => (
            <Line key={`g${i}`} x1={PAD_L} y1={y} x2={CHART_W - PAD_R} y2={y} stroke={COLORS.lightGray} strokeWidth={1} />
          ))}

          {/* Y labels */}
          {gridValues.map((v, i) => (
            <SvgText key={`yl${i}`} x={PAD_L - 4} y={gridYs[i] + 3} fontSize={9} fill={COLORS.textMuted} textAnchor="end" fontFamily="DM Sans">
              {formatTonnage(v)}
            </SvgText>
          ))}

          {/* Area fill */}
          <Path d={areaPath} fill={COLORS.textPrimary} opacity={0.06} />

          {/* Line */}
          <Path d={linePath} stroke={COLORS.textPrimary} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots on every point */}
          {points.map((p, i) => (
            <Circle key={`d${i}`} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4.5 : 3} fill={COLORS.textPrimary} stroke={COLORS.white} strokeWidth={2} />
          ))}

          {/* X labels */}
          {labelIndices.map((idx) => (
            <SvgText key={`xl${idx}`} x={toX(idx)} y={CHART_H - 2} fontSize={9} fill={COLORS.textMuted} textAnchor="middle" fontFamily="DM Sans">
              {formatDate(history[idx].date)}
            </SvgText>
          ))}
        </Svg>
      </View>
    </Pressable>
  );

  if (isFirst) {
    return (
      <CopilotStep text="" name="graph-card" order={10}>
        <WalkthroughView>
          {card}
        </WalkthroughView>
      </CopilotStep>
    );
  }

  return card;
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