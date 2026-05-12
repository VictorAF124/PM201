/* Js del lado del servidor*/

console.log("Hola Mundo JS con Node")

/* calculo */ 
let edad1= 12
let edad2= 34

console.log("Edad promedio: ")
console.log((edad1+edad2)/2)

/** medir el tiempo de proceso*/
console.time("mi proceso")

for(let i=0; i<99000000; i++){

}

console.timeEnd("mi proceso")

/**Objetos de tipo tabla */
let usuarios=[
    {nombre:"Victor", edad:24},
    {nombre:"Manuel", edad:24},
];

console.table(usuarios)

