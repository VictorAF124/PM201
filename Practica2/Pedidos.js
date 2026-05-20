let pedidos = [];
let totalAcumulado = 0;

export function agregarPedido(pedido) {
    pedidos.push(pedido);
    totalAcumulado += pedido.precio;
    console.log(`Pedido recibido: ${pedido.nombre} (x${pedido.cantidad || 1}) - $${pedido.precio}`);
}

export function mostrarPedidos() {
    console.log("\n=--Pedidos---");
    if (pedidos.length === 0) {
        console.log("No hay pedidos registrados.");
    } else {
        console.table(pedidos);
    }
}

export function mostrarTotal() {
    console.log(`Total acumulado: $${totalAcumulado}`);
}

function mostrarMenuCaja() {
    console.log(`----Caja----
  1. Ver todos los pedidos
  2. Ver total acumulado
  3. Volver al menú principal`);
}

function pregunta(rl, texto) {
    return new Promise((resolve) => rl.question(texto, resolve));
}

export async function menuCaja(rl) {
    let enMenu = true;
    while (enMenu) {
        mostrarMenuCaja();
        const opcion = await pregunta(rl, "Elige una opción: ");
        switch (opcion) {
            case '1':
                mostrarPedidos();
                break;
            case '2':
                mostrarTotal();
                break;
            case '3':
                enMenu = false;
                break;
            default:
                console.log("Opción no válida.");
        }
    }
}