import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';


export default function App() {
  return (
    <View>
      <Text>Aqui va la primer Practica en componente nativo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f35858',
    flexDirection: 'row',
    
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },


});