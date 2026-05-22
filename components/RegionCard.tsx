import { Href, router } from 'expo-router';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  title: string;
  image: ImageSourcePropType;
  id: string;
};

export default function RegionCard({ title, image, id }: Props) {
  const handlePress = () => {
    router.push(`/region/${id}` as Href);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={image} style={styles.image} resizeMode="cover" />

      {/* Overlay oscuro */}
      <View style={styles.overlay} />

      {/* Nombre del municipio */}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',

    // sombra (Android + iOS)
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 220,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',

    // sombra para mejor legibilidad
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});