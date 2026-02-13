/**
 * App.tsx — Entry point (Kawaii Edition).
 * Loads Quicksand + Inter fonts, sets up providers, configures kawaii tab bar.
 */
import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ThemeProvider, useTheme } from './src/store/ThemeContext';
import { AppProvider } from './src/store/AppContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { MonthScreen } from './src/screens/MonthScreen';
import { lightTheme } from './src/constants/theme';

// Keep splash visible while fonts load
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

/** Kawaii tab icon — emoji text */
const TabIcon = ({ emoji, color }: { emoji: string; color: string }) => (
  <Text style={{ fontSize: 22, color, textAlign: 'center' }}>{emoji}</Text>
);

/** Inner app — uses useTheme() for navigation theming */
const AppInner: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <>
      <NavigationContainer
        theme={{
          dark: isDark,
          colors: {
            primary: theme.colors.accent,
            background: theme.colors.bgBase,
            card: theme.colors.tabBar,
            text: theme.colors.textPrimary,
            border: theme.colors.border,
            notification: theme.colors.accent,
          },
          fonts: {
            regular: { fontFamily: theme.fonts.sans, fontWeight: '400' },
            medium: { fontFamily: theme.fonts.sansMedium, fontWeight: '500' },
            bold: { fontFamily: theme.fonts.sansBold, fontWeight: '700' },
            heavy: { fontFamily: theme.fonts.sansBold, fontWeight: '900' },
          },
        }}
      >
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.colors.tabBar,
              borderTopColor: theme.colors.border,
              borderTopWidth: 1.5,
              height: 85,
              paddingBottom: 26,
              paddingTop: 10,
              shadowColor: theme.colors.accent,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 8,
            },
            tabBarActiveTintColor: theme.colors.accent,
            tabBarInactiveTintColor: theme.colors.textMuted,
            tabBarLabelStyle: {
              fontFamily: theme.fonts.monoBold,
              fontSize: 11,
              marginTop: 2,
            },
          }}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              tabBarLabel: 'Dashboard',
              tabBarIcon: ({ color }) => <TabIcon emoji={'\u{1F338}'} color={color} />,
            }}
          />
          <Tab.Screen
            name="Months"
            component={MonthScreen}
            options={{
              tabBarLabel: 'Months',
              tabBarIcon: ({ color }) => <TabIcon emoji={'\u{1F4C5}'} color={color} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style={theme.colors.statusBar} />
    </>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: lightTheme.colors.bgBase,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 48, marginBottom: 16 }}>{'\u{1F338}'}</Text>
        <ActivityIndicator size="large" color={lightTheme.colors.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppProvider>
            <AppInner />
          </AppProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
