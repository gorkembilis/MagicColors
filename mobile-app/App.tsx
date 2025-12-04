import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider } from './src/lib/i18n';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <I18nProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </I18nProvider>
  );
}
