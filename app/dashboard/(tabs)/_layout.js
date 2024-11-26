import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 8
        }, 
        tabBarStyle: {
          margin: 0,
          borderRadius: 20,
        },
          tabBarShowLabel: true,

      }}
    >
      <Tabs.Screen name="index"
          options={{
            title: 'Home', 
            tabBarIcon: ({ focused }) => <MaterialCommunityIcons name={ focused ? 'home-circle' : 'home-circle-outline'} size={24} color='#5A8EE0' />
          }}
        />
        <Tabs.Screen name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <MaterialCommunityIcons name={ focused ? 'account' : 'account-outline'} size={24} color='#5A8EE0' />
          }}
        />
        <Tabs.Screen name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ focused }) => <MaterialCommunityIcons name={ focused ? 'cog' : 'cog-outline'} size={24} color='#5A8EE0' />
          }}
        />
    </Tabs>
  );
}

export default DashboardLayout