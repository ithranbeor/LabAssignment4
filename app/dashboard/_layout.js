import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Hi!',
            headerShown: false,
            drawerIcon: () => <MaterialCommunityIcons name='home' size={28} color={'#5A8EE0'}/>
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
            headerShown: false,
            drawerIcon: () => <MaterialCommunityIcons name='cog' size={28} color={'#5A8EE0'}/>
          }}
        />
        <Drawer.Screen
          name="partnership"
          options={{
            drawerLabel: 'Partner with Us',
            title: 'Partner with Us',
            headerShown: false,
            drawerIcon: () => <MaterialCommunityIcons name='handshake' size={28} color={'#5A8EE0'}/>
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
