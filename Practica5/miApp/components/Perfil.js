import { View, Text, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';


export const Perfil = ({nombre, carrera, materia, cuatrimestre, style}) => {
    const [mostrar, setMostrar] = useState(false);
    
    return(
        
        <View style={[estilos.tarjeta, style]}>  
            <Text style={estilos.nombre}>{nombre}</Text>

            {mostrar &&
            <>
                <Text style={estilos.carrera}>{carrera}</Text>
                <Text style={estilos.otroTexto}>{materia}</Text>
                <Text style={estilos.otroTexto}>{cuatrimestre}</Text>
            </>
            }

            <Button title="Ver Perfil" onPress={() => setMostrar(!mostrar)}/>
        </View>
    );
}

const estilos = StyleSheet.create({
    nombre: {
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase',
        color: 'white' 
    },
    carrera: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Roboto',
    },
    otroTexto: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Courier',
        fontStyle: 'italic',
    },
    tarjeta: {
        borderWidth: 2,
        borderColor: 'black',
        padding: 25,
        margin: 20,
        backgroundColor: 'blue' 
    },
});