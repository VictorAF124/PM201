let pedidos = [];

export function agregarPedido(pedido) {
    pedidos.push(pedido);
    if (pedido.items) {
        console.log(`Pedido registrado (${pedido.items.length} productos) - Total: $${pedido.total.toFixed(2)}`);
    } else {
        // Compatibilidad con pedidos antiguos (un solo producto)
        console.log(`Pedido recibido: ${pedido.nombre} (x${pedido.cantidad || 1}) - $${pedido.precio}`);
    }
}

// Función para calcular totales globales (subtotal, IVA, total) usando reduce
function calcularTotales() {
    const subtotal = pedidos.reduce(function(acumulador, pedido) {
        if (pedido.items) {
            return acumulador + pedido.total;
        } else {
            return acumulador + pedido.precio;
        }
    }, 0);
    const IVA = subtotal * 0.16;
    const total = subtotal + IVA;
    return { subtotal, IVA, total };
}

export function mostrarPedidos() {
    console.log("\n===== Pedidos =====");
    if (pedidos.length === 0) {
        console.log("No hay pedidos registrados.");
        return;
    }

    // Mostrar cada pedido con su estructura
    pedidos.forEach(function(pedido, index) {
        console.log(`\n--- Pedido #${index+1} (${pedido.fecha || 'fecha no registrada'}) ---`);
        if (pedido.items) {
            console.log(`Productos:`);
            pedido.items.forEach(function(item) {
                console.log(`  ${item.cantidad} x ${item.nombre} - $${item.subtotal.toFixed(2)} ($${item.precioUnitario.toFixed(2)} c/u)`);
            });
            console.log(`Total del pedido: $${pedido.total.toFixed(2)}`);
        } else {
            // Pedido antiguo
            console.log(`Producto: ${pedido.nombre} x${pedido.cantidad || 1} = $${pedido.precio}`);
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
    console.log(`IVA (16%): $${IVA.toFixed(2)}`);
    console.log(`TOTAL: $${total.toFixed(2)}`);
}

// Nuevas funciones para filtros de pedidos
export function buscarPedidosPorProducto(nombreProducto) {
    const encontrados = pedidos.filter(function(pedido) {
        if (pedido.items) {
            return pedido.items.some(function(item) {
                return item.nombre.toLowerCase().includes(nombreProducto.toLowerCase());
            });
        } else {
            return pedido.nombre.toLowerCase().includes(nombreProducto.toLowerCase());
        }
    });
    if (encontrados.length === 0) {
        console.log(`No hay pedidos que contengan "${nombreProducto}"`);
    } else {
        console.log(`\n🔍 Pedidos que contienen "${nombreProducto}":`);
        encontrados.forEach(function(pedido, idx) {
            console.log(`${idx+1}. ${pedido.fecha || 'fecha?'} - Total: $${(pedido.total || pedido.precio).toFixed(2)}`);
        });
    }
}

export function filtrarPedidosPorMonto(montoMinimo) {
    if (isNaN(montoMinimo)) {
        console.log("Monto inválido.");
        return;
    }
    const filtrados = pedidos.filter(function(pedido) {
        const totalPedido = pedido.total || pedido.precio;
        return totalPedido >= montoMinimo;
    });
    if (filtrados.length === 0) {
        console.log(`No hay pedidos con total mayor o igual a $${montoMinimo}`);
    } else {
        console.log(`\nPedidos con total >= $${montoMinimo}:`);
        filtrados.forEach(function(pedido, idx) {
            console.log(`${idx+1}. ${pedido.fecha || 'fecha?'} - Total: $${(pedido.total || pedido.precio).toFixed(2)}`);
        });
    }
}

// Menú de Caja (con nuevas opciones de filtro)
function mostrarMenuCaja() {
    console.log(`--- Caja ---
  1. Ver todos los pedidos (con totales)
  2. Ver solo total acumulado (subtotal, IVA, total)
  3. Buscar pedidos por nombre de producto
  4. Filtrar pedidos por monto mínimo
  5. Volver al menú principal`);
}

function pregunta(rl, texto) {
    return new Promise(function(resolve) {
        rl.question(texto, resolve);
    });
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
            case '3': {
                const nombre = await pregunta(rl, "Ingresa nombre del producto a buscar: ");
                buscarPedidosPorProducto(nombre);
                break;
            }
            case '4': {
                const monto = await pregunta(rl, "Ingresa el monto mínimo: ");
                filtrarPedidosPorMonto(parseFloat(monto));
                break;
            }
            case '5':
                enMenu = false;
                break;
            default:
                console.log("Opción no válida.");
        }
    }
}