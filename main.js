let cantidadAlumnos = parseInt(prompt("Ingrese cantidad de alumnos."));

for (let numeroAlumnos = 1; numeroAlumnos <= cantidadAlumnos; numeroAlumnos++) {

    let alumno = prompt("Ingrese el nombre del " + numeroAlumnos + "° alumno."); 
    let cantidadNotas = parseInt(prompt("Ingrese cantidad de notas a promediar."));
    contadorDeNotas = 0;

    for (let numeroNotas = 1; numeroNotas <= cantidadNotas;){
        let notas = parseFloat(prompt("Ingrese las notas del alumno."));

        if (notas < 1 || notas > 10){
            alert("Ingrese una nota del 1 al 10.");
        } else {
            contadorDeNotas = (contadorDeNotas + notas);
            numeroNotas++;
        }

        promedio = (contadorDeNotas / cantidadNotas)

    }
    console.log("El promedio de " + alumno + " es de " + promedio.toFixed(2) + ".");
}


