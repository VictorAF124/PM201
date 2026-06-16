import { View, Text, Image, Button } from "react-native";

export const Saludo2 = () => { 
  return(
    <View>
      <Text>Hola RN: Componente Propio</Text>
      <Image source={require('../assets/wave.png')}/>     
      <Button title='Hola 201'/>  
    </View>
  )
}