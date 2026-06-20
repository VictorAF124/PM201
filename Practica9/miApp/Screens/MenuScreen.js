import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button } from 'react-native';
import React, { useState } from 'react';
import TarjetasScreen from './TarjetasScreen';
import Componente1 from './Componente1';
import { SafeAreaView } from 'react-native-safe-area-context';



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
                <SafeAreaView style={styles.container}>
                    <Text style={styles.titulo}>Menú Prácticas</Text>

                    <Button title='Practica Tarjetas' onPress={()=>setScreen('tarjetas')}></Button>
                    <Button title='Practica Componente1' onPress={()=>setScreen('componente1')}></Button>
                </SafeAreaView>
            ); 
    } 
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
    flexDirection: 'column', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    gap: 20, 
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});