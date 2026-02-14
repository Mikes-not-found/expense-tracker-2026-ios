/**
 * App.tsx — Entry point (Kawaii PWA Edition).
 * Tab bar navigation between Dashboard and Months.
 */
import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './store/ThemeContext';
import { AppProvider, AppContext } from './store/AppContext';
import { DashboardScreen } from './screens/DashboardScreen';
import { MonthScreen } from './screens/MonthScreen';

type Tab = 'dashboard' | 'months';

const AppInner: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const ctx = React.useContext(AppContext);

  if (!ctx.state.isLoaded) {
    return (
      <div style={{
        height: '100%',
        backgroundColor: theme.colors.bgBase,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u{1F338}'}</div>
        <div style={{
          fontFamily: theme.fonts.monoBold,
          fontWeight: theme.fontWeights.monoBold,
          color: theme.colors.textMuted,
          fontSize: theme.fontSize.md,
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.bgBase,
    }}>
      {/* Screen content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'dashboard' ? <DashboardScreen /> : <MonthScreen />}
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: theme.colors.tabBar,
        borderTopWidth: 1.5,
        borderTopStyle: 'solid',
        borderTopColor: theme.colors.border,
        paddingTop: 10,
        paddingBottom: 26,
        boxShadow: `0 -4px 12px ${theme.colors.shadow}`,
      }}>
        <TabButton
          emoji={'\u{1F338}'}
          label="Dashboard"
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        />
        <TabButton
          emoji={'\u{1F4C5}'}
          label="Months"
          active={activeTab === 'months'}
          onClick={() => setActiveTab('months')}
        />
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  emoji: string;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ emoji, label, active, onClick }) => {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{
        fontSize: 22,
        color: active ? theme.colors.accent : theme.colors.textMuted,
      }}>
        {emoji}
      </span>
      <span style={{
        fontFamily: theme.fonts.monoBold,
        fontWeight: theme.fontWeights.monoBold,
        fontSize: 11,
        color: active ? theme.colors.accent : theme.colors.textMuted,
      }}>
        {label}
      </span>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ThemeProvider>
  );
};
