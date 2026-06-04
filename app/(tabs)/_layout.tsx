import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function IconoTab({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{
      fontSize: focused ? 20 : 18,
      opacity: focused ? 1 : 0.5,
      textAlign: 'center',
      lineHeight: 22,
    }}>
      {emoji}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 55,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1a1a1a',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerTitle: '🌊 BCS Turismo',
          tabBarIcon: ({ focused }) => (
            <IconoTab emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          headerTitle: '🗺️ Mapa de BCS',
          tabBarIcon: ({ focused }) => (
            <IconoTab emoji="🗺️" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: '👤 Mi Perfil',
          tabBarIcon: ({ focused }) => (
            <IconoTab emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}