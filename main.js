// Clase Alumno

class Alumno {
    constructor(nombre) {
        this.nombre = nombre;
        this.notas = [];
    }
    agregarNota(nota) {
        this.notas.push(nota);
    }
    calcularPromedio() {
        const total = this.notas.reduce((acc, nota) => acc + nota, 0);
        return total / this.notas.length;
    }
}


// Pedir cantidad de alumnos

let cantidadAlumnos;
do{
    cantidadAlumnos = parseInt(prompt("Ingrese la cantidad de ALUMNOS:"));
} while (isNaN(cantidadAlumnos) || cantidadAlumnos === "" || cantidadAlumnos === null)


// Crear un array de objetos Alumno y solicitar nombres

let alumnos = [];
for (let i = 0; i < cantidadAlumnos; i++) {
    let nombre;
    do {
        nombre = prompt(`Ingrese el nombre del alumno ${i + 1}:`);
        if (isNaN(nombre) && nombre !== "" && nombre !== null) {
            break
        } 
    } while (true)
    let alumno = new Alumno(nombre);
    alumnos.push(alumno);
}


// Pedir cantidad de notas

let cantidadNotas; 
do {
    cantidadNotas = parseInt(prompt("Ingrese la cantidad de NOTAS:"));
} while (isNaN(cantidadNotas) || cantidadNotas === "" || cantidadNotas === null)


// Solicitar y asignar notas a cada alumno

alumnos.forEach(alumno => {
    for (let i = 0; i < cantidadNotas; i++) {
        let nota;
        do {
            nota = parseFloat(prompt(`Ingrese la nota ${i + 1} para ${alumno.nombre}:`));
        } while (isNaN(nota) || nota === "" || nota === null || nota < 1 || nota > 10)
        alumno.agregarNota(nota);
    }
});


// Mostrar las notas y el promedio de cada alumno

alumnos.forEach(alumno => {
    console.log(`${alumno.nombre}: Notas: ${alumno.notas.join(", ")}, Promedio: ${alumno.calcularPromedio().toFixed(2)}`);
});
