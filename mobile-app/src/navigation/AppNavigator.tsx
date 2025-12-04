import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../lib/i18n';

import HomeScreen from '../screens/HomeScreen';
import GeneratorScreen from '../screens/GeneratorScreen';
import GalleryScreen from '../screens/GalleryScreen';
import PremiumScreen from '../screens/PremiumScreen';
import PackDetailScreen from '../screens/PackDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Premium') {
            iconName = focused ? 'star' : 'star-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF69B4',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: t('nav.home') }}
      />
      <Tab.Screen 
        name="Create" 
        component={GeneratorScreen}
        options={{ tabBarLabel: t('nav.create') }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Generator', { prompt: '' });
          },
        })}
      />
      <Tab.Screen 
        name="Gallery" 
        component={GalleryScreen}
        options={{ tabBarLabel: t('nav.gallery') }}
      />
      <Tab.Screen 
        name="Premium" 
        component={PremiumScreen}
        options={{ tabBarLabel: t('nav.premium') }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={HomeTabs} />
        <Stack.Screen name="Generator" component={GeneratorScreen} />
        <Stack.Screen name="PackDetail" component={PackDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
