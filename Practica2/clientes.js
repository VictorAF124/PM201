import * as cocina from './cocina.js';
import * as caja from './Pedidos.js';

function mostrarMenuClientes() {
    console.log(`---Clientes----
  1.Ver productos disponibles
  2.Crear nuevo pedido
  3.Ver mis pedidos
  4.Ver total acumulado
  5.Volver al menú principal`);
}

function pregunta(rl, texto) {
    return new Promise((resolve) => rl.question(texto, resolve));
}

export async function menuClientes(rl) {
    let enMenu = true;
    while (enMenu) {
        mostrarMenuClientes();
        const opcion = await pregunta(rl, "Elige una opción: ");
        switch (opcion) {
            case '1':
                cocina.listarProductos();
                break;
            case '2': {
                console.log("\nCREAR NUEVO PEDIDO");
                const productos = cocina.listarProductos();
                if (productos.length === 0) {
                    console.log("No hay productos disponibles para pedir.");
                    break;
                }
                const nombre = await pregunta(rl, "Nombre del producto: ");
                const producto = productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
                if (!producto) {
                    console.log("Producto no encontrado.");
                    break;
                }
                const cantidad = await pregunta(rl, "Cantidad: ");
                const cant = parseInt(cantidad);
                if (cant <= 0) {
                    console.log("Cantidad no válida.");
                    break;
                }
                const pedido = {
                    nombre: producto.nombre,
                    precio: producto.precio * cant,
                    cantidad: cant
                };
                caja.agregarPedido(pedido);
                console.log(`Pedido agregado: ${cant} x ${producto.nombre} - $${pedido.precio}`);
                break;
            }
            case '3':
                caja.mostrarPedidos();
                break;
            case '4':
                caja.mostrarTotal();
                break;
            case '5':
                enMenu = false;
                break;
            default:
                console.log("Opción no válida.");
        }
    }
}