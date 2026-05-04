import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createMaterialTopTabNavigator();
const Tabs = withLayoutContext(Navigator);

export default function RegionLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: { backgroundColor: '#000' },
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarLabelStyle: { fontWeight: 'bold' },
        tabBarItemStyle: { width: 'auto' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Destacados' }} />
      <Tabs.Screen name="directorio" options={{ title: 'Directorio' }} />
      <Tabs.Screen name="guia" options={{ title: 'Guía' }} />
      <Tabs.Screen name="resenas" options={{ title: 'Reseñas' }} />
    </Tabs>
  );
}