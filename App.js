 import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IdeaSubmissionScreen from './screens/IdeaSubmissionScreen';
import IdeaListingScreen from './screens/IdeaListingScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import DarkModeContext from './DarkModeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from AsyncStorage on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem('darkMode');
        if (storedPreference !== null) {
          setIsDarkMode(storedPreference === 'true');
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };
    loadThemePreference();
  }, []);

  // Save dark mode preference to AsyncStorage when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('darkMode', isDarkMode.toString());
      } catch (error) {
        console.error('Failed to save theme preference', error);
      }
    };
    saveThemePreference();
  }, [isDarkMode]);

  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  // Update navigation params when dark mode changes
  useEffect(() => {
    // This will trigger a re-render of screens with updated params
    // The screens will receive the updated isDarkMode value
  }, [isDarkMode]);

  // Add a simple console log to verify rendering
  console.log('App component rendering');

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme}>
          <Stack.Navigator
            initialRouteName="IdeaSubmission"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#6200ee',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="IdeaSubmission"
              component={IdeaSubmissionScreen}
              options={{
                title: '💡 Submit Idea',
                headerTitleAlign: 'center',
                headerRight: () => (
                  <MaterialIcons
                    name={isDarkMode ? 'brightness-7' : 'brightness-4'}
                    size={24}
                    color="#fff"
                    style={{ marginRight: 16 }}
                    onPress={() => setIsDarkMode(!isDarkMode)}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="IdeaListing"
              component={IdeaListingScreen}
              options={{
                title: '📋 All Ideas',
                headerTitleAlign: 'center',
                headerRight: () => (
                  <MaterialIcons
                    name={isDarkMode ? 'brightness-7' : 'brightness-4'}
                    size={24}
                    color="#fff"
                    style={{ marginRight: 16 }}
                    onPress={() => setIsDarkMode(!isDarkMode)}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="Leaderboard"
              component={LeaderboardScreen}
              options={{
                title: '🏆 Leaderboard',
                headerTitleAlign: 'center',
                headerRight: () => (
                  <MaterialIcons
                    name={isDarkMode ? 'brightness-7' : 'brightness-4'}
                    size={24}
                    color="#fff"
                    style={{ marginRight: 16 }}
                    onPress={() => setIsDarkMode(!isDarkMode)}
                  />
                ),
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
    </DarkModeContext.Provider>
  );
}
