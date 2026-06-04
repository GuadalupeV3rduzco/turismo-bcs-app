import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { router, usePathname, withLayoutContext } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { Navigator } = createMaterialTopTabNavigator();
const Tabs = withLayoutContext(Navigator);

const regionNombres: Record<string, string> = {
  '1': 'La Paz',
  '2': 'Los Cabos',
  '3': 'Loreto',
  '4': 'Mulegé',
  '5': 'Comondú',
};

export default function RegionLayout() {
  const pathname = usePathname();
  const regionId = pathname.split('/')[2];
  const nombreRegion = regionNombres[regionId] ?? 'Región';

  return (
    <View style={{ flex: 1 }}>
      {/* Header personalizado */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botonRegresar}
          onPress={() => router.back()}
        >
          <Text style={styles.flechaRegresar}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>{nombreRegion}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <Tabs
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarIndicatorStyle: {
            backgroundColor: '#007AFF',
            height: 3,
            borderRadius: 3,
          },
          tabBarStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          },
          tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 13,
            textTransform: 'none',
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#888',
          tabBarItemStyle: { width: 'auto', paddingHorizontal: 8 },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Destacados' }} />
        <Tabs.Screen name="directorio" options={{ title: 'Actividades' }} />
        <Tabs.Screen name="guia" options={{ title: 'Guía' }} />
        <Tabs.Screen name="resenas" options={{ title: 'Reseñas' }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
botonRegresar: {
  width: 40,
  height: 30,
  borderRadius: 20,
  backgroundColor: '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
},

flechaRegresar: {
  fontSize: 25,
  color: '#007AFF',
  fontWeight: 'bold',
   marginTop: -7,
  marginLeft: -1,
},
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});