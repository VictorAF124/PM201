import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Perfil } from '../components/Perfil';
import { ScrollView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollCont}
      >

        <Perfil
          style={styles.tarjetaVerde}
          nombre="1-Victor"
          carrera="Ingeniería en Sistemas Computacionales"
          materia="Programación Móvil"
          cuatrimestre="9"
        />

        <Perfil
          style={styles.tarjetaRoja}
          nombre="2-Josue"
          carrera="Ingeniería en Sistemas Computacionales"
          materia="Programación Móvil"
          cuatrimestre="9"
        />

        <Perfil
          style={styles.tarjetaVerde}
          nombre="3-Jonathan"
          carrera="Ingeniería en Sistemas Computacionales"
          materia="Programación Móvil"
          cuatrimestre="9"
        />

        <Perfil
          style={styles.tarjetaVerde}
          nombre="4-Manuel"
          carrera="Ingeniería en Sistemas Computacionales"
          materia="Programación Móvil"
          cuatrimestre="9"
        />

        <Perfil
          style={styles.tarjetaRoja}
          nombre="5-Hector"
          carrera="Ingeniería en Sistemas Computacionales"
          materia="Programación Móvil"
          cuatrimestre="9"
        />

        <Perfil
          style={styles.tarjetaVerde}
          nombre="6-Jusma"
          carrera="Ingeniería en Sistemas Computacionales"
          materia="Programación Móvil"
          cuatrimestre="9"
        />

      </ScrollView>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#90EE90',
  },

  scroll: {
    flex: 1,
    width: '100%',
  },

  scrollCont: {
    alignItems: 'center',
    paddingVertical: 20,
    
  },

  tarjetaVerde: {
    backgroundColor: 'green',
  },

  tarjetaRoja: {
    backgroundColor: 'red',
  },
});