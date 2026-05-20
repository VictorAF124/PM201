let productos = [];

export function agregarProducto(nombre, precio) {
    const producto = { nombre, precio: Number(precio) };
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

export function editarProducto(nombre, nuevoNombre, nuevoPrecio) {
    const producto = productos.find(function(p) {
        return p.nombre === nombre;
    });
    if (producto) {
        producto.nombre = nuevoNombre;
        producto.precio = Number(nuevoPrecio);
        console.log("Producto actualizado.");
    } else {
        console.log("Producto no encontrado.");
    }
}

export function eliminarProducto(nombre) {
    const indice = productos.findIndex(function(p) {
        return p.nombre === nombre;
    });
    if (indice !== -1) {
        productos.splice(indice, 1);
        console.log("Producto eliminado.");
    } else {
        console.log("Producto no encontrado.");
    }
}

function mostrarMenuCocina() {
    console.log(`----Cocina----
  1. Agregar producto
  2. Editar producto
  3. Eliminar producto
  4. Listar productos
  5. Volver al menú principal`);
}

function pregunta(rl, texto) {
    return new Promise(function(resolve) {
        rl.question(texto, resolve);
    });
}

export async function menuCocina(rl) {
    let enMenu = true;
    while (enMenu) {
        mostrarMenuCocina();
        const opcion = await pregunta(rl, "Elige una opción: ");
        switch (opcion) {
            case '1': {
                const nombre = await pregunta(rl, "Nombre del producto: ");
                const precio = await pregunta(rl, "Precio: ");
                const precioNum = parseFloat(precio);
                if (precioNum <= 0) {
                    console.log("Precio inválido.");
                    break;
                }
                agregarProducto(nombre.trim(), precioNum);
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
                editarProducto(producto.nombre, nuevoNombre || producto.nombre, precioNum);
                break;
            }
            case '3': {
                listarProductos();
                if (productos.length === 0) break;
                const nombre = await pregunta(rl, "Nombre del producto a eliminar: ");
                const producto = productos.find(function(p) {
                    return p.nombre.toLowerCase() === nombre.toLowerCase();
                });
                if (!producto) {
                    console.log( "Producto no encontrado.");
                    break;
                }
                eliminarProducto(producto.nombre);
                break;
            }
            case '4':
                listarProductos();
                break;
            case '5':
                enMenu = false;
                break;
            default:
                console.log("Opción no válida.");
        }
    }
}