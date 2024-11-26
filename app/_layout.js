import React from 'react'
import { Stack, stack } from 'expo-router'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'


const RootLayout = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            animation: 'none',
          }}
        >
          <Stack.Screen name="index" options={{
            headerShown: false
          }} />

          <Stack.Screen name="SignUpPage" options={{
            headerShown: false
          }} />
        
          <Stack.Screen name="AccRecoveryPage" options={{
            headerShown: false
          }} />
          <Stack.Screen name="SignInPage" options={{
            headerShown: false
          }} />

          <Stack.Screen name="dashboard" 
          options={{ 
              title: 'Dashboard', 
              headerShown: false }} />
          </Stack>
      </SafeAreaProvider>
    </PaperProvider>
  )
}

export default RootLayout