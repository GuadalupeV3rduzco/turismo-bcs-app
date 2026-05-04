import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getRegiones } from '../../../constants/api';

type Region = {
  id: number;
  nombre: string;
  descripcion: string;
};

export default function PruebaConexion() {
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRegiones()
      .then(setRegiones)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <View>
      {error && <Text>Error: {error}</Text>}
      {regiones.map(r => (
        <Text key={r.id}>{r.nombre}</Text>
      ))}
    </View>
  );
}