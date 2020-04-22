export default function validarCrearCuenta(valores) {

    //Variable de retorno para determinar si hubo o no errores en la validacion
    let errores = {};

    //Validamos que el nombre del usuario venga informado
    if (!valores.nombre) {
        errores.nombre = "El Nombre es obligatorio";
    }

    //Validamos que el email venga informado y que tenga un formato valido
    if (!valores.email) {
        errores.email = "El Email es Obligatorio";
    } else if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email) ) {
        errores.email = "Email no válido"
    }

    //Validamos que el password venga informado y que tenga una longitud minima de 6 caracteres
    if (!valores.password) {
        errores.password = "El password es obligatorio";
    } else if ( valores.password.length < 6 ) {
        errores.password = 'El password debe ser de al menos 6 caracteres'
    }

    return errores;
}