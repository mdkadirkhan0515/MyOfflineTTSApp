/**
 * App.tsx - Root Entry File
 * Architecture: op-sqlite + MMKV + Google Offline TTS
 */
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase } from './src/db/index';

const PRIMARY_BLUE = '#2563EB';

const LightAppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: PRIMARY_BLUE, background: '#FFFFFF', card: '#F8FAFC', text: '#0F172A', border: '#E2E8F0' },
};

const DarkAppTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, primary: PRIMARY_BLUE, background: '#0F172A', card: '#1E293B', text: '#F1F5F9', border: '#334155' },
};

import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const theme = isDark ? DarkAppTheme : LightAppTheme;

  useEffect(() => {
    initDatabase();
    console.log('Core Initialized - System Theme:', systemColorScheme);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top','bottom','left','right']}>
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

