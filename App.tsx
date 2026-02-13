/**
 * App.tsx — Entry point.
 * Loads fonts, sets up providers (Theme + App), configures navigation.
 * Navigation theme reacts to ThemeContext mode.
 */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ThemeProvider, useTheme } from './src/store/ThemeContext';
import { AppProvider } from './src/store/AppContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { MonthScreen } from './src/screens/MonthScreen';
import { darkTheme } from './src/constants/theme';

// Keep splash visible while fonts load
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

const DashboardIcon = ({ color }: { color: string }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', gap: 2 }}>
      <View style={{ width: 8, height: 8, borderRadius: 3, backgroundColor: color }} />
      <View style={{ width: 8, height: 8, borderRadius: 3, backgroundColor: color }} />
    </View>
    <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}>
      <View style={{ width: 8, height: 8, borderRadius: 3, backgroundColor: color }} />
      <View style={{ width: 8, height: 8, borderRadius: 3, backgroundColor: color }} />
    </View>
  </View>
);

const CalendarIcon = ({ color }: { color: string }) => (
  <View
    style={{
      width: 20,
      height: 22,
      borderRadius: 5,
      borderWidth: 1.5,
      borderColor: color,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 3,
    }}
  >
    <View style={{ flexDirection: 'row', gap: 2 }}>
      <View style={{ width: 3, height: 3, borderRadius: 1, backgroundColor: color }} />
      <View style={{ width: 3, height: 3, borderRadius: 1, backgroundColor: color }} />
    </View>
  </View>
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
              height: 80,
              paddingBottom: 24,
              paddingTop: 8,
            },
            tabBarActiveTintColor: theme.colors.accent,
            tabBarInactiveTintColor: theme.colors.textMuted,
            tabBarLabelStyle: {
              fontFamily: theme.fonts.monoMedium,
              fontSize: 11,
            },
          }}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              tabBarIcon: ({ color }) => <DashboardIcon color={color} />,
            }}
          />
          <Tab.Screen
            name="Months"
            component={MonthScreen}
            options={{
              tabBarIcon: ({ color }) => <CalendarIcon color={color} />,
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
    'JetBrainsMono-Regular': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Medium': require('./assets/fonts/JetBrainsMono-Medium.ttf'),
    'JetBrainsMono-SemiBold': require('./assets/fonts/JetBrainsMono-SemiBold.ttf'),
    'JetBrainsMono-Bold': require('./assets/fonts/JetBrainsMono-Bold.ttf'),
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
          backgroundColor: darkTheme.colors.bgBase,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={darkTheme.colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <AppInner />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
