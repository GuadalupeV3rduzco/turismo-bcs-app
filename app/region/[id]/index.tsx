import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RegionHome() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {id?.toString().toUpperCase()}
      </Text>

      <Text>Destacados</Text>
    </View>
  );
}