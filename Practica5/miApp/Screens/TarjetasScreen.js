import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Perfil } from '../components/Perfil';

export default function App() {
  return (
    <View style={styles.container}>

      <Perfil
        style={styles.tarjetaVerde}
        nombre="Victor Manuel Arias Franco"
        carrera="Ingeniería en Sistemas Computacionales"
        materia="Programación Móvil"
        cuatrimestre="9"
      />

      <Perfil
        style={styles.tarjetaRoja}
        nombre="Victor Manuel Arias Franco"
        carrera="Ingeniería en Sistemas Computacionales"
        materia="Programación Móvil"
        cuatrimestre="9"
      />

      <Perfil
        style={styles.tarjetaVerde}
        nombre="Victor Manuel Arias Franco"
        carrera="Ingeniería en Sistemas Computacionales"
        materia="Programación Móvil"
        cuatrimestre="9"
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

   
    backgroundColor: '#90EE90',

    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  tarjetaVerde: {
    backgroundColor: 'green',
  },

  tarjetaRoja: {
    backgroundColor: 'red',
  },
});