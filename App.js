import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

import HomeScreen from './screens/HomeScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// تعيين معالج الإشعارات
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [location, setLocation] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // طلب الأذونات
    requestLocationPermission();
    requestNotificationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    } catch (error) {
      console.error('خطأ في الحصول على الموقع:', error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('تم رفض أذن الإشعارات');
      }
    } catch (error) {
      console.error('خطأ في طلب أذن الإشعارات:', error);
    }
  };

  const colors = isDarkMode ? {
    primary: '#667eea',
    background: '#1a1a2e',
    surface: '#16213e',
    text: '#e0e0e0',
    border: '#2a2a3e',
  } : {
    primary: '#667eea',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    border: '#e0e0e0',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: isDarkMode ? '#666' : '#999',
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginTop: 5,
            },
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'Statistics') {
                iconName = focused ? 'bar-chart' : 'bar-chart';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings';
              }
              return <MaterialIcons name={iconName} size={24} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="Home"
            options={{
              title: '🏠 الرئيسية',
              tabBarLabel: 'الرئيسية',
            }}
          >
            {() => <HomeScreen location={location} colors={colors} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
          </Tab.Screen>
          <Tab.Screen
            name="Statistics"
            options={{
              title: '📊 الإحصائيات',
              tabBarLabel: 'الإحصائيات',
            }}
          >
            {() => <StatisticsScreen colors={colors} isDarkMode={isDarkMode} />}
          </Tab.Screen>
          <Tab.Screen
            name="Settings"
            options={{
              title: '⚙️ الإعدادات',
              tabBarLabel: 'الإعدادات',
            }}
          >
            {() => <SettingsScreen colors={colors} isDarkMode={isDarkMode} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
