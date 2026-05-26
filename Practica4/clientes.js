// clientes.js
import * as cocina from './cocina.js';
import * as caja from './caja.js';

let siguienteId = 1;

function obtenerPromocion() {
    const fecha = new Date();
    const dia = fecha.getDay();
    if (dia === 0 || dia === 6) {
        return { descripcion: "Fin de semana: 15% de descuento en bebidas", descuento: 0.15, tipo: "bebida" };
    } else if (dia === 2) {
        return { descripcion: "Martes de postres: 2x1 en todos los postres", descuento: 0.50, tipo: "postre" };
    } else {
        return { descripcion: "Café de especialidad: 10% de descuento en tu primera compra", descuento: 0.10, tipo: null };
    }
}

function mostrarMenuDinamico() {
    const promocion = obtenerPromocion();
    console.log(`-- COFFEE CODE ---
    Bienvenido. Menú del día:
    ${promocion.descripcion}`);
}

function mostrarMenuClientes() {
    console.log(`---- Clientes ----
  1. Ver productos disponibles
  2. Crear nuevo pedido
  3. Ver mis pedidos (con estados)
  4. Ver total acumulado
  5. Filtros de productos
  6. Filtros de pedidos
  7. Cancelar un pedido mío
  8. Volver al menú principal`);
}

function mostrarFiltrosProductos() {
    console.log(`--- Filtros de productos ---
    1. Listar todos
    2. Productos baratos
    3. Productos caros
    4. Solo bebidas
    5. Solo postres`);
}

function mostrarFiltrosPedidos() {
    console.log(`--- Filtros de pedidos ---
    1. Ver todos los pedidos
    2. Ver pedidos por nombre de producto
    3. Ver pedidos mayores a cierto monto`);
}

function pregunta(rl, texto) {
    return new Promise(resolve => rl.question(texto, resolve));
}

function listarProductos() {
    const productos = cocina.listarProductos();
    if (productos.length === 0) return;
    console.log("\nProductos disponibles:");
    const listaFormateada = productos.map(p => `- ${p.nombre} : $${p.precio} (${p.tipo})`);
    listaFormateada.forEach(linea => console.log(linea));
}

function aplicarPromocion(producto, cantidad) {
    const promocion = obtenerPromocion();
    let precioUnitario = producto.precio;
    let cantidadEfectiva = cantidad;

    if (promocion.tipo && producto.tipo.toLowerCase() === promocion.tipo) {
        if (promocion.descuento === 0.5 && promocion.tipo === "postre") {
            cantidadEfectiva = Math.ceil(cantidad / 2);
            console.log(`Promoción 2x1 en postres. Pagas ${cantidadEfectiva} de ${cantidad} unidades.`);
        } else if (promocion.descuento === 0.15 || promocion.descuento === 0.10) {
            precioUnitario = producto.precio * (1 - promocion.descuento);
            console.log(`Descuento del ${promocion.descuento * 100}% aplicado a ${producto.nombre}. Ahora cuesta $${precioUnitario.toFixed(2)} c/u.`);
        }
    }

    return { precioUnitario, cantidadEfectiva };
}

function mostrarDesglosePedido(items, totalPedido) {
    console.log("\n" + "=".repeat(50));
    console.log("Desglose de tu pedido:");

    items.forEach((item, idx) => {
        console.log(`${idx + 1}. ${item.nombre}`);
        console.log(`   Cantidad: ${item.cantidad} x $${item.precioUnitario.toFixed(2)} = $${item.subtotal.toFixed(2)}`);
    });

    console.log("--------------------------------");
    console.log(`Total del pedido: $${totalPedido.toFixed(2)}`);

    const subtotal = totalPedido;
    const iva = subtotal * 0.16;

    console.log(`   Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`   IVA (16%): $${iva.toFixed(2)}`);
    console.log(`   Total a pagar: $${(subtotal + iva).toFixed(2)}`);
    console.log("=".repeat(50) + "\n");
}

async function crearPedidoMultiple(rl) {
    console.log("\nCrear nuevo pedido");

    const productos = cocina.listarProductos();

    if (productos.length === 0) {
        console.log("No hay productos disponibles.");
        return;
    }

    const items = [];
    let continuar = true;

    while (continuar) {
        console.log("\nSelecciona un producto por número o nombre:");

        productos.forEach((p, idx) =>
            console.log(`${idx + 1}. ${p.nombre} - $${p.precio} (${p.tipo})`)
        );

        const entrada = await pregunta(rl, "Número o nombre: ");
        let productoSeleccionado = null;

        const num = parseInt(entrada);

        if (!isNaN(num) && num >= 1 && num <= productos.length) {
            productoSeleccionado = productos[num - 1];
        } else {
            productoSeleccionado = productos.find(
                p => p.nombre.toLowerCase() === entrada.toLowerCase()
            );
        }

        if (!productoSeleccionado) {
            console.log("Producto no encontrado.");
            continue;
        }

        const cantidad = await pregunta(rl, `Cantidad de ${productoSeleccionado.nombre}: `);
        const cant = parseInt(cantidad);

        if (isNaN(cant) || cant <= 0) {
            console.log("Cantidad inválida.");
            continue;
        }

        const { precioUnitario, cantidadEfectiva } = aplicarPromocion(productoSeleccionado, cant);
        const subtotalProducto = precioUnitario * cantidadEfectiva;

        items.push({
            nombre: productoSeleccionado.nombre,
            precioUnitario,
            cantidad: cantidadEfectiva,
            subtotal: subtotalProducto,
            tipo: productoSeleccionado.tipo
        });

        console.log(`Agregado: ${cantidadEfectiva} x ${productoSeleccionado.nombre} - $${subtotalProducto.toFixed(2)}`);

        const respuesta = await pregunta(rl, "¿Agregar otro producto? (s/n): ");

        if (respuesta.toLowerCase() !== 's') {
            continuar = false;
        }
    }

    if (items.length === 0) {
        console.log("Pedido cancelado.");
        return;
    }

    const totalPedido = items.reduce((acc, item) => acc + item.subtotal, 0);
    const id = siguienteId++;

    const pedido = {
        id,
        items,
        total: totalPedido,
        fecha: new Date().toLocaleString(),
        estado: "recibido"
    };

    caja.agregarPedido(pedido);
    mostrarDesglosePedido(items, totalPedido);

    console.log(`Pedido #${id} recibido. Estado: Pedido recibido`);

    caja.registrarCallback(id, (evento, data) => {
        if (evento === "preparando") {
            console.log(`Pedido #${id}: Preparando...`);
        } else if (evento === "empacando") {
            console.log(`Pedido #${id}: Empacando...`);
        } else if (evento === "entregado") {
            console.log(`Pedido #${id}: ENTREGADO`);
        } else if (evento === "cancelado") {
            console.log(`Pedido #${id}: CANCELADO. Motivo: ${data}`);
        }
    });

    cocina.procesarPedido(pedido, (estado, motivo) => {
        if (estado === "preparando") caja.notificarPedido(id, "preparando");
        else if (estado === "empacando") caja.notificarPedido(id, "empacando");
        else if (estado === "entregado") caja.notificarPedido(id, "entregado");
        else if (estado === "cancelado") caja.notificarPedido(id, "cancelado", motivo);
    }).catch(() => {});
}

async function cancelarMiPedido(rl) {
    console.log("\nCancelar mi pedido");

    const id = parseInt(await pregunta(rl, "ID del pedido a cancelar: "));

    if (isNaN(id)) {
        console.log("ID inválido.");
        return;
    }

    const motivo = await pregunta(rl, "Motivo de la cancelación: ");
    const exito = caja.cancelarPedido(id, motivo || "Cancelado por el cliente");

    if (!exito) {
        console.log("No se pudo cancelar el pedido. Verifique el ID o el estado.");
    }
}

export async function menuClientes(rl) {
    let enMenu = true;

    while (enMenu) {
        mostrarMenuDinamico();
        mostrarMenuClientes();

        const opcion = await pregunta(rl, "Elige una opción: ");

        switch (opcion) {
            case '1':
                listarProductos();
                break;

            case '2':
                await crearPedidoMultiple(rl);
                break;

            case '3':
                caja.mostrarPedidos();
                break;

            case '4':
                caja.mostrarTotal();
                break;

            case '5': {
                let sub = true;

                while (sub) {
                    mostrarFiltrosProductos();
                    const subop = await pregunta(rl, "Opción: ");

                    switch (subop) {
                        case '1': listarProductos(); break;
                        case '2': cocina.productosBaratos(50); break;
                        case '3': cocina.productosCaros(100); break;
                        case '4': cocina.filtrarPorTipo("bebida"); break;
                        case '5': cocina.filtrarPorTipo("postre"); break;
                        default: sub = false; break;
                    }

                    if (subop >= '1' && subop <= '5') {
                        await pregunta(rl, "\nPresiona Enter...");
                    }
                }

                break;
            }

            case '6': {
                let sub = true;

                while (sub) {
                    mostrarFiltrosPedidos();
                    const subop = await pregunta(rl, "Opción: ");

                    switch (subop) {
                        case '1':
                            caja.mostrarPedidos();
                            break;

                        case '2': {
                            const nombre = await pregunta(rl, "Nombre del producto: ");
                            caja.buscarPedidosPorProducto(nombre);
                            break;
                        }

                        case '3': {
                            const monto = await pregunta(rl, "Monto mínimo: ");
                            caja.filtrarPedidosPorMonto(parseFloat(monto));
                            break;
                        }

                        default:
                            sub = false;
                            break;
                    }

                    if (subop >= '1' && subop <= '3') {
                        await pregunta(rl, "\nPresiona Enter...");
                    }
                }

                break;
            }

            case '7':
                await cancelarMiPedido(rl);
                break;

            case '8':
                enMenu = false;
                break;

            default:
                console.log("Opción no válida.");
        }
    }
}