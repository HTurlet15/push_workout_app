import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

// Import workout data
import { workouts } from './src/data/workouts';

// Import components
import NavigationBar from './src/components/NavigationBar';
import WorkoutScreen from './src/components/WorkoutScreen';

// Import design system
import colors from './src/theme/colors';

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Fixed Navigation Bar */}
        <NavigationBar
          currentIndex={currentPage}
          totalPages={workouts.length}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
        />
        
        {/* Workout Carousel */}
        <PagerView 
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {workouts.map((workout) => (
            <View key={workout.id} collapsable={false} style={styles.page}>
              <WorkoutScreen 
                workout={workout}
                isEditing={isEditing}
              />
            </View>
          ))}
        </PagerView>
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  
  pagerView: {
    flex: 1,
  },
  
  page: {
    flex: 1,
  },
});