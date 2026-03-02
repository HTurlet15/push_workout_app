import { ScrollView, View, StyleSheet } from 'react-native';
import Text from '../common/Text';
import GraphCard from './GraphCard';
import { SPACING } from '../../theme/theme';

/**
 * GraphsList — scrollable list of workout tonnage graphs.
 *
 * @param {Array} sessions       - Array of session objects with history[].
 * @param {Function} onSelectGraph - Called with session index when a graph is tapped.
 */
export default function GraphsList({ sessions, onSelectGraph }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant="screenTitle">GRAPHS</Text>
      </View>

      {sessions.map((session, index) => (
        <GraphCard
          key={session.current?.id || index}
          session={session}
          onPress={() => onSelectGraph(index)}
          isFirst={index === 0}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
});