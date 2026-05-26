// caja.js 
let pedidos = [];
const callbacksPorPedido = new Map();

export function agregarPedido(pedido) {
    pedido.estado = "recibido";
    pedidos.push(pedido);
    console.log(`Pedido #${pedido.id} registrado (${pedido.items.length} productos) - Total: $${pedido.total.toFixed(2)}`);
}

export function registrarCallback(pedidoId, callback) {
    callbacksPorPedido.set(pedidoId, callback);
}

export function notificarPedido(pedidoId, evento, data = null) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido && (pedido.estado === "cancelado" || pedido.estado === "entregado")) return;
    const callback = callbacksPorPedido.get(pedidoId);
    if (callback) callback(evento, data);
    if (pedido) {
        if (evento === "preparando") pedido.estado = "preparando";
        else if (evento === "empacando") pedido.estado = "empacando";
        else if (evento === "entregado") pedido.estado = "entregado";
        else if (evento === "cancelado") pedido.estado = "cancelado";
        if (data) pedido.motivo = data;
    }
}

export function cancelarPedido(pedidoId, motivo = "Cancelado por cajero") {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        console.log(`❌ Pedido #${pedidoId} no existe.`);
        return false;
    }
    if (pedido.estado === "entregado") {
        console.log(`❌ Pedido #${pedidoId} ya fue entregado, no se puede cancelar.`);
        return false;
    }
    if (pedido.estado === "cancelado") {
        console.log(`❌ Pedido #${pedidoId} ya estaba cancelado.`);
        return false;
    }
    pedido.estado = "cancelado";
    pedido.motivo = motivo;
    notificarPedido(pedidoId, "cancelado", motivo);
    console.log(`✅ Pedido #${pedidoId} cancelado. Motivo: ${motivo}`);
    return true;
}



// Calcular totales (reduce)
function calcularTotales() {
    const subtotal = pedidos.reduce((acc, p) => acc + (p.items ? p.total : p.precio), 0);
    const IVA = subtotal * 0.16;
    return { subtotal, IVA, total: subtotal + IVA };
}

export function mostrarPedidos() {
    console.log("\n===== Pedidos =====");
    if (pedidos.length === 0) {
        console.log("No hay pedidos.");
        return;
    }
    pedidos.forEach(pedido => {
        console.log(`\n--- Pedido #${pedido.id} (${pedido.fecha}) --- Estado: ${pedido.estado} ${pedido.motivo ? `(${pedido.motivo})` : ""}`);
        if (pedido.items) {
            pedido.items.forEach(item => {
                console.log(`  ${item.cantidad} x ${item.nombre} - $${item.subtotal.toFixed(2)}`);
            });
            console.log(`Total: $${pedido.total.toFixed(2)}`);
        } else {
            console.log(`Producto: ${pedido.nombre} - $${pedido.precio}`);
        }
    });
    const { subtotal, IVA, total } = calcularTotales();
    console.log(`\nSubtotal global: $${subtotal.toFixed(2)}`);
    console.log(`IVA (16%): $${IVA.toFixed(2)}`);
    console.log(`TOTAL GLOBAL: $${total.toFixed(2)}`);
}

export function mostrarTotal() {
    const { subtotal, IVA, total } = calcularTotales();
    console.log(`Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`IVA: $${IVA.toFixed(2)}`);
    console.log(`TOTAL: $${total.toFixed(2)}`);
}

export function buscarPedidosPorProducto(nombreProducto) {
    const encontrados = pedidos.filter(p => {
        if (p.items) return p.items.some(i => i.nombre.toLowerCase().includes(nombreProducto.toLowerCase()));
        else return p.nombre.toLowerCase().includes(nombreProducto.toLowerCase());
    });
    if (encontrados.length === 0) console.log(`No hay pedidos con "${nombreProducto}"`);
    else encontrados.forEach(p => console.log(`#${p.id} - ${p.fecha} - $${(p.total || p.precio).toFixed(2)} - Estado: ${p.estado}`));
}

export function filtrarPedidosPorMonto(montoMinimo) {
    if (isNaN(montoMinimo)) { console.log("Monto inválido"); return; }
    const filtrados = pedidos.filter(p => (p.total || p.precio) >= montoMinimo);
    if (filtrados.length === 0) console.log(`No hay pedidos >= $${montoMinimo}`);
    else filtrados.forEach(p => console.log(`#${p.id} - $${(p.total || p.precio).toFixed(2)} - ${p.estado}`));
}

// Menú de Caja actualizado
function mostrarMenuCaja() {
    console.log(`--- Caja ---
  1. Ver todos los pedidos
  2. Ver solo total acumulado
  3. Buscar pedidos por nombre de producto
  4. Filtrar pedidos por monto mínimo
  5. Volver al menú principal`);
}

function pregunta(rl, texto) {
    return new Promise(resolve => rl.question(texto, resolve));
}

export async function menuCaja(rl) {
    let enMenu = true;
    while (enMenu) {
        mostrarMenuCaja();
        const opcion = await pregunta(rl, "Elige una opción: ");
        switch (opcion) {
            case '1': mostrarPedidos(); break;
            case '2': mostrarTotal(); break;
            case '3': {
                const nombre = await pregunta(rl, "Nombre del producto: ");
                buscarPedidosPorProducto(nombre);
                break;
            }
            case '4': {
                const monto = await pregunta(rl, "Monto mínimo: ");
                filtrarPedidosPorMonto(parseFloat(monto));
                break;
            }
            case '5': enMenu = false; break;
            default: console.log("Opción no válida.");
        }
    }
}