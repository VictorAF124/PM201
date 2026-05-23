// clientes.js (con desglose al finalizar pedido)
import * as cocina from './cocina.js';
import * as caja from './caja.js';

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
    console.log(`COFFEE CODE
    ¡Bienvenido! Menú dinámico del día: 
    ${promocion.descripcion}`);
}

function mostrarMenuClientes() {
    console.log(`----Clientes----
  1. Ver productos disponibles
  2. Crear nuevo pedido
  3. Ver mis pedidos 
  4. Ver total acumulado 
  5. Filtros de productos
  6. Filtros de pedidos
  7. Volver al menú principal`);
}

function mostrarFiltrosProductos() {
    console.log(`---Filtros de productos---
    1. Listar todos
    2. Productos baratos
    3. Productos caros
    4. Solo bebidas
    5. Solo postres`);
}

function mostrarFiltrosPedidos() {
    console.log(`---Filtros de pedidos---
    1. Ver todos los pedidos
    2. Ver pedidos por nombre de producto
    3. Ver pedidos mayores a cierto monto`);
}

function pregunta(rl, texto) {
    return new Promise(function(resolve) {
        rl.question(texto, resolve);
    });
}

function listarProductosConMap() {
    const productos = cocina.listarProductos();
    if (productos.length === 0) return;
    console.log("\nProductos disponibles:");
    const listaFormateada = productos.map(function(p) {
        return `- ${p.nombre} : $${p.precio} (${p.tipo})`;
    });
    listaFormateada.forEach(function(linea) {
        console.log(linea);
    });
}

function aplicarPromocion(producto, cantidad) {
    const promocion = obtenerPromocion();
    let precioUnitario = producto.precio;
    let cantidadEfectiva = cantidad;
    if (promocion.tipo && producto.tipo.toLowerCase() === promocion.tipo) {
        const descuento = promocion.descuento;
        if (descuento === 0.5 && promocion.tipo === "postre") {
            cantidadEfectiva = Math.ceil(cantidad / 2);
            console.log(`Promoción 2x1 en postres. Pagas ${cantidadEfectiva} de ${cantidad} unidades.`);
            return { precioUnitario, cantidadEfectiva };
        } else if (descuento === 0.15 || descuento === 0.10) {
            precioUnitario = producto.precio * (1 - descuento);
            console.log(`Descuento del ${descuento*100}% aplicado a ${producto.nombre}. Ahora cuesta $${precioUnitario.toFixed(2)} c/u.`);
            return { precioUnitario, cantidadEfectiva };
        }
    }
    return { precioUnitario, cantidadEfectiva };
}

// Función para mostrar desglose del pedido recién creado
function mostrarDesglosePedido(items, totalPedido) {
    console.log("\n" + "=".repeat(50));
    console.log("Desgloce de tu pedido:");
    items.forEach(function(item, idx) {
        console.log(`${idx+1}. ${item.nombre}`);
        console.log(`   Cantidad: ${item.cantidad} x $${item.precioUnitario.toFixed(2)} = $${item.subtotal.toFixed(2)}`);
    });
    console.log("--------------------------------");
    console.log(`Total del pedido: $${totalPedido.toFixed(2)}`);
    // Mostrar también subtotal, IVA y total con IVA 
    const subtotal = totalPedido;
    const iva = subtotal * 0.16;
    const totalConIva = subtotal + iva;
    console.log(`   Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`   IVA (16%): $${iva.toFixed(2)}`);
    console.log(`   Total a Pagar: $${totalConIva.toFixed(2)}`);
    console.log("=".repeat(50) + "\n");
}

async function crearPedidoMultiple(rl) {
    console.log("\nCrear Nuvo Pedido");
    const productos = cocina.listarProductos();
    if (productos.length === 0) {
        console.log("No hay productos disponibles para pedir.");
        return;
    }

    const items = [];
    let continuar = true;

    while (continuar) {
        console.log("\nSelecciona un producto por número o nombre:");
        productos.forEach(function(p, idx) {
            console.log(`${idx+1}. ${p.nombre} - $${p.precio} (${p.tipo})`);
        });
        const entrada = await pregunta(rl, "Número o nombre del producto: ");
        
        let productoSeleccionado = null;
        const num = parseInt(entrada);
        if (!isNaN(num) && num >= 1 && num <= productos.length) {
            productoSeleccionado = productos[num-1];
        } else {
            productoSeleccionado = productos.find(function(p) {
                return p.nombre.toLowerCase() === entrada.toLowerCase();
            });
        }

        if (!productoSeleccionado) {
            console.log("Producto no encontrado.");
            continue;
        }

        const cantidad = await pregunta(rl, `Cantidad de ${productoSeleccionado.nombre}: `);
        const cant = parseInt(cantidad);
        if (isNaN(cant) || cant <= 0) {
            console.log("Cantidad no válida.");
            continue;
        }

        const { precioUnitario, cantidadEfectiva } = aplicarPromocion(productoSeleccionado, cant);
        const subtotalProducto = precioUnitario * cantidadEfectiva;

        items.push({
            nombre: productoSeleccionado.nombre,
            precioUnitario: precioUnitario,
            cantidad: cantidadEfectiva,
            subtotal: subtotalProducto,
            tipo: productoSeleccionado.tipo
        });

        console.log(`Agregado: ${cantidadEfectiva} x ${productoSeleccionado.nombre} - $${subtotalProducto.toFixed(2)}`);

        const respuesta = await pregunta(rl, "¿Deseas agregar otro producto? (s/n): ");
        if (respuesta.toLowerCase() !== 's') {
            continuar = false;
        }
    }

    if (items.length === 0) {
        console.log("No se agregaron productos. Pedido cancelado.");
        return;
    }

    const totalPedido = items.reduce(function(acc, item) {
        return acc + item.subtotal;
    }, 0);

    const pedido = {
        id: Date.now(),
        items: items,
        total: totalPedido,
        fecha: new Date().toLocaleString()
    };

    caja.agregarPedido(pedido);
    
    // Mostrar desglose detallado del pedido que acabas de hacer
    mostrarDesglosePedido(items, totalPedido);
}

export async function menuClientes(rl) {
    let enMenu = true;
    while (enMenu) {
        mostrarMenuDinamico();
        mostrarMenuClientes();
        const opcion = await pregunta(rl, "Elige una opción: ");
        switch (opcion) {
            case '1':
                listarProductosConMap();
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
                let filtrosActivos = true;
                while (filtrosActivos) {
                    mostrarFiltrosProductos();
                    const subopcion = await pregunta(rl, "Opción de filtro: ");
                    switch (subopcion) {
                        case '1':
                            listarProductosConMap();
                            break;
                        case '2':
                            cocina.productosBaratos(50);
                            break;
                        case '3':
                            cocina.productosCaros(100);
                            break;
                        case '4':
                            cocina.filtrarPorTipo("bebida");
                            break;
                        case '5':
                            cocina.filtrarPorTipo("postre");
                            break;
                        default:
                            filtrosActivos = false;
                            break;
                    }
                    if (subopcion >= '1' && subopcion <= '5') {
                        await pregunta(rl, "\nPresiona Enter para continuar...");
                    }
                }
                break;
            }
            case '6': {
                let filtrosActivos = true;
                while (filtrosActivos) {
                    mostrarFiltrosPedidos();
                    const subopcion = await pregunta(rl, "Opción de filtro: ");
                    switch (subopcion) {
                        case '1':
                            caja.mostrarPedidos();
                            break;
                        case '2': {
                            const nombreB = await pregunta(rl, "Nombre del producto a buscar en pedidos: ");
                            caja.buscarPedidosPorProducto(nombreB);
                            break;
                        }
                        case '3': {
                            const monto = await pregunta(rl, "Monto mínimo: ");
                            caja.filtrarPedidosPorMonto(parseFloat(monto));
                            break;
                        }
                        default:
                            filtrosActivos = false;
                            break;
                    }
                    if (subopcion >= '1' && subopcion <= '3') {
                        await pregunta(rl, "\nPresiona Enter para continuar...");
                    }
                }
                break;
            }
            case '7':
                enMenu = false;
                break;
            default:
                console.log("Opción no válida.");
        }
    }
}