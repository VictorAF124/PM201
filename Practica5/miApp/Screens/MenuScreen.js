import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button } from 'react-native';
import React,{useState} from 'react';
import TarjetasScreen from './TarjetasScreen';
import Componente1 from './Componente1';

export default function App() {

    const[screen, setScreen]= useState('menu');
    
    switch(screen){
        case 'tarjetas':
            return <TarjetasScreen/>
        case 'componente1':
            return <Componente1/>
        case 'menu':
            default:

            return (
                <View>
                    <Text>Menu practicas</Text>

                    <Button title='Practica Tarjetas' onPress={()=>setScreen('tarjetas')}></Button>
                    <Button title='Practica Componente1' onPress={()=>setScreen('componente1')}></Button>

                    

                </View>

  ); //return 
 } //Switch
} // funcion

const styles = StyleSheet.create({
  container: {
    flex: 1,

   
    backgroundColor: '#f35858',

    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },


});