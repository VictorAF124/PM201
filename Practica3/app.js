import readline from 'readline';
import { menuCocina } from './cocina.js';
import { menuClientes } from './clientes.js';
import { menuCaja } from './caja.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function pregunta(preguntaTexto) {
    return new Promise(function(resolve) {
        rl.question(preguntaTexto, resolve);
    });
}

async function menuPrincipal() {
    console.log(`--- Coffe Sistema --- 
    1. Módulo Cocina
    2. Módulo Clientes
    3. Módulo Caja
    4. Salir`);
}

async function main() {
    let salir = false;
    while (!salir) {
        await menuPrincipal();
        const opcion = await pregunta("Elige una opción: ");
        switch (opcion) {
            case '1':
                await menuCocina(rl);
                break;
            case '2':
                await menuClientes(rl);
                break;
            case '3':
                await menuCaja(rl);
                break;
            case '4':
                console.log("Adiós!");
                salir = true;
                break;
            default:
                console.log("Opción no válida.");
        }
    }
    rl.close();
}

main();