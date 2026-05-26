// cocina.js
let productos = [];


productos = [
    { nombre: "Café Americano", precio: 35, tipo: "bebida", tiempoBase: 3000 },
    { nombre: "Latte", precio: 45, tipo: "bebida", tiempoBase: 3500 },
    { nombre: "Capuchino", precio: 50, tipo: "bebida", tiempoBase: 4000 },
    { nombre: "Pastel de Chocolate", precio: 60, tipo: "postre", tiempoBase: 5000 },
    { nombre: "Cheesecake", precio: 70, tipo: "postre", tiempoBase: 5500 }
];

function pregunta(rl, texto) {
    return new Promise(function(resolve) {
        rl.question(texto, resolve);
    });
}



// Funciones 
export function agregarProducto(nombre, precio, tipo, tiempoBase = 4000) {
    const producto = { nombre, precio: Number(precio), tipo, tiempoBase };
    productos.push(producto);
    console.log("Producto agregado.");
}

export function listarProductos() {
    if (productos.length === 0) {
        console.log("No hay productos registrados.");
        return [];
    }
    console.log("\nLista de productos:");
    console.table(productos);
    return productos;
}

export function productosBaratos(umbral = 50) {
    const baratos = productos.filter(p => p.precio < umbral);
    if (baratos.length === 0) console.log(`No hay productos con precio menor a $${umbral}`);
    else console.table(baratos);
    return baratos;
}

export function productosCaros(umbral = 100) {
    const caros = productos.filter(p => p.precio > umbral);
    if (caros.length === 0) console.log(`No hay productos con precio mayor a $${umbral}`);
    else console.table(caros);
    return caros;
}

export function filtrarPorTipo(tipo) {
    const filtrados = productos.filter(p => p.tipo.toLowerCase() === tipo.toLowerCase());
    if (filtrados.length === 0) console.log(`No hay productos del tipo "${tipo}"`);
    else console.table(filtrados);
    return filtrados;
}

export function buscarProductoPorNombre(nombre) {
    const producto = productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (producto) console.log("Producto encontrado:", producto);
    else console.log(`No se encontró el producto "${nombre}"`);
    return producto;
}

// Recibe el pedido y un callback para notificar cambios de estado.
// Retorna una Promise que se resuelve si el pedido se completa, o se rechaza si hay error.

export function procesarPedido(pedido, callbackEstado) {
    return new Promise((resolve, reject) => {

        let tiempoTotal = 0;
        pedido.items.forEach(item => {
            const productoOriginal = productos.find(p => p.nombre === item.nombre);
            if (productoOriginal) tiempoTotal += productoOriginal.tiempoBase * item.cantidad;
            else tiempoTotal += 4000 * item.cantidad; // fallback
        });


        const hayError = Math.random() < 0.3;
        const tipoFallo = hayError ? (Math.random() < 0.5 ? "falta_ingrediente" : "error_cocina") : null;


        callbackEstado("preparando");

        setTimeout(() => {
            if (hayError) {
                if (tipoFallo === "falta_ingrediente") {
                    callbackEstado("cancelado", "Falta de ingrediente");
                    reject(new Error("Falta de ingrediente"));
                } else {
                    callbackEstado("cancelado", "Error en la cocina");
                    reject(new Error("Error en la cocina"));
                }
                return;
            }

            
            callbackEstado("empacando");
            setTimeout(() => {
                callbackEstado("entregado");
                resolve("Pedido listo");
            }, tiempoTotal * 0.4); 
        }, tiempoTotal * 0.6); 
    });
}

// Menu de cocina 
function mostrarMenuCocina() {
    console.log(`---Cocina---
  1. Agregar producto
  2. Editar producto
  3. Eliminar producto
  4. Listar todos los productos
  5. Buscar producto por nombre
  6. Productos baratos
  7. Productos caros
  8. Filtrar por tipo: bebidas
  9. Filtrar por tipo: postres
 10. Volver al menú principal`);
}

export async function menuCocina(rl) {
    let enMenu = true;
    while (enMenu) {
        mostrarMenuCocina();
        const opcion = await pregunta(rl, "Elige una opción: ");
        switch (opcion) {
            case '1': {
                const nombre = await pregunta(rl, "Nombre del producto: ");
                if (!nombre.trim()) { console.log("Nombre vacío"); break; }
                const precio = await pregunta(rl, "Precio: ");
                const precioNum = parseFloat(precio);
                if (isNaN(precioNum) || precioNum <= 0) { console.log("Precio inválido"); break; }
                const tipo = await pregunta(rl, "Tipo (bebida/postre/comida): ");
                if (!tipo.trim()) { console.log("Tipo vacío"); break; }
                const tiempo = await pregunta(rl, "Tiempo base (ms, opcional): ");
                const tiempoNum = tiempo.trim() ? parseInt(tiempo) : 4000;
                agregarProducto(nombre.trim(), precioNum, tipo.trim(), tiempoNum);
                break;
            }
            case '2': {
                listarProductos();
                if (productos.length === 0) break;
                const nombre = await pregunta(rl, "Nombre a editar: ");
                const producto = productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
                if (!producto) { console.log("No encontrado"); break; }
                const nuevoNombre = await pregunta(rl, `Nuevo nombre (${producto.nombre}): `);
                const nuevoPrecio = await pregunta(rl, `Nuevo precio (${producto.precio}): `);
                const precioNum = parseFloat(nuevoPrecio);
                if (isNaN(precioNum) || precioNum <= 0) { console.log("Precio inválido"); break; }
                const nuevoTipo = await pregunta(rl, `Nuevo tipo (${producto.tipo}): `);
                producto.nombre = nuevoNombre || producto.nombre;
                producto.precio = precioNum;
                if (nuevoTipo.trim()) producto.tipo = nuevoTipo.trim();
                console.log("Producto actualizado.");
                break;
            }
            case '3': {
                listarProductos();
                if (productos.length === 0) break;
                const nombre = await pregunta(rl, "Nombre a eliminar: ");
                const indice = productos.findIndex(p => p.nombre.toLowerCase() === nombre.toLowerCase());
                if (indice !== -1) { productos.splice(indice, 1); console.log("Eliminado"); }
                else console.log("No encontrado");
                break;
            }
            case '4': listarProductos(); break;
            case '5': {
                const nombre = await pregunta(rl, "Nombre a buscar: ");
                buscarProductoPorNombre(nombre);
                break;
            }
            case '6': productosBaratos(50); break;
            case '7': productosCaros(100); break;
            case '8': filtrarPorTipo("bebida"); break;
            case '9': filtrarPorTipo("postre"); break;
            case '10': enMenu = false; break;
            default: console.log("Opción no válida");
        }
    }
}