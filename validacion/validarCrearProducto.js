export default function validarCrearCuenta(valores) {

    //Variable de retorno para determinar si hubo o no errores en la validacion
    let errores = {};

    //Validamos que el nombre del usuario venga informado
    if(!valores.nombre) {
        errores.nombre = "El Nombre es obligatorio";
    }

    //Validamos que el nombre de la empresa venga informado
    if (!valores.empresa) {
        errores.empresa = "Nombre de Empresa es obligatorio"
    }
    
    //Validamos que la URL venga informada y que tenga un formato valido
    if (!valores.url) {
        errores.url = 'La URL del producto es obligatoria';
    } else if ( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
        errores.url = "URL mal formateada o no válida"
    }

    //Validamos que descripcion del producto venga informada
    if (!valores.descripcion) {
        errores.descripcion = "Agrega una descripción de tu producto"
    }

    return errores;
}