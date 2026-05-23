let productos = [];
productos = [
    { nombre: "Café Americano", precio: 35, tipo: "bebida" },
        { nombre: "Latte", precio: 45, tipo: "bebida" },
        { nombre: "Capuchino", precio: 50, tipo: "bebida" },
        { nombre: "Pastel de Chocolate", precio: 60, tipo: "postre" },
        { nombre: "Cheesecake", precio: 70, tipo: "postre" }
]

// Función auxiliar para preguntar
function pregunta(rl, texto) {
    return new Promise(function(resolve) {
        rl.question(texto, resolve);
    });
}

export function agregarProducto(nombre, precio, tipo) {
    const producto = { nombre: nombre, precio: Number(precio), tipo: tipo };
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

// NUEVAS FUNCIONES PARA FILTRAR (usando filter y find)
export function productosBaratos(umbral = 50) {
    const baratos = productos.filter(function(p) {
        return p.precio < umbral;
    });
    if (baratos.length === 0) {
        console.log(`No hay productos con precio menor a $${umbral}`);
    } else {
        console.log(`\nProductos baratos (menos de $${umbral}):`);
        console.table(baratos);
    }
    return baratos;
}

export function productosCaros(umbral = 100) {
    const caros = productos.filter(function(p) {
        return p.precio > umbral;
    });
    if (caros.length === 0) {
        console.log(`No hay productos con precio mayor a $${umbral}`);
    } else {
        console.log(`\nProductos caros (más de $${umbral}):`);
        console.table(caros);
    }
    return caros;
}

export function filtrarPorTipo(tipo) {
    const filtrados = productos.filter(function(p) {
        return p.tipo.toLowerCase() === tipo.toLowerCase();
    });
    if (filtrados.length === 0) {
        console.log(`No hay productos del tipo "${tipo}"`);
    } else {
        console.log(`\nProductos tipo ${tipo}:`);
        console.table(filtrados);
    }
    return filtrados;
}

// Función buscar (find) – ejemplo para buscar un producto por nombre
export function buscarProductoPorNombre(nombre) {
    const producto = productos.find(function(p) {
        return p.nombre.toLowerCase() === nombre.toLowerCase();
    });
    if (producto) {
        console.log(`Producto encontrado:`, producto);
    } else {
        console.log(`No se encontró el producto "${nombre}"`);
    }
    return producto;
}

// Menú interactivo de Cocina ampliado
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
                if (!nombre.trim()) {
                    console.log("El nombre no puede estar vacío.");
                    break;
                }
                const precio = await pregunta(rl, "Precio: ");
                const precioNum = parseFloat(precio);
                if (precioNum <= 0) {
                    console.log("Precio inválido.");
                    break;
                }
                const tipo = await pregunta(rl, "Tipo (bebida/postre/comida): ");
                if (!tipo.trim()) {
                    console.log("El tipo no puede estar vacío.");
                    break;
                }
                agregarProducto(nombre.trim(), precioNum, tipo.trim());
                break;
            }
            case '2': {
                listarProductos();
                if (productos.length === 0) break;
                const nombre = await pregunta(rl, "Nombre del producto a editar: ");
                const producto = productos.find(function(p) {
                    return p.nombre.toLowerCase() === nombre.toLowerCase();
                });
                if (!producto) {
                    console.log("Producto no encontrado.");
                    break;
                }
                const nuevoNombre = await pregunta(rl, "Nuevo nombre (actual: " + producto.nombre + "): ");
                const nuevoPrecio = await pregunta(rl, "Nuevo precio (actual: " + producto.precio + "): ");
                const precioNum = parseFloat(nuevoPrecio);
                if (precioNum <= 0) {
                    console.log("Precio inválido.");
                    break;
                }
                const nuevoTipo = await pregunta(rl, "Nuevo tipo (actual: " + producto.tipo + "): ");
                producto.nombre = nuevoNombre || producto.nombre;
                producto.precio = precioNum;
                if (nuevoTipo.trim()) producto.tipo = nuevoTipo.trim();
                console.log("Producto actualizado.");
                break;
            }
            case '3': {
                listarProductos();
                if (productos.length === 0) break;
                const nombre = await pregunta(rl, "Nombre del producto a eliminar: ");
                const indice = productos.findIndex(function(p) {
                    return p.nombre.toLowerCase() === nombre.toLowerCase();
                });
                if (indice !== -1) {
                    productos.splice(indice, 1);
                    console.log("Producto eliminado.");
                } else {
                    console.log("Producto no encontrado.");
                }
                break;
            }
            case '4':
                listarProductos();
                break;
            case '5': {
                const nombre = await pregunta(rl, "Nombre del producto a buscar: ");
                buscarProductoPorNombre(nombre);
                break;
            }
            case '6':
                productosBaratos(50);
                break;
            case '7':
                productosCaros(100);
                break;
            case '8':
                filtrarPorTipo("bebida");
                break;
            case '9':
                filtrarPorTipo("postre");
                break;
            case '10':
                enMenu = false;
                break;
            default:
                console.log("Opción no válida.");
        }
    }
}