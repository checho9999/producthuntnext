import React, { useState, useEffect } from 'react';

//En el parametro validar estan las reglas de validacion
//Si es CrearCuenta => stateInicial=STATE_INICIAL, validar=validarCrearCuenta, fn=crearCuenta
const useValidacion = (stateInicial, validar, fn) => {

    //actualizacion del state para guardar los datos ingresados por el usuario en el input
    const [ valores, guardarValores ] = useState(stateInicial);
    //actualizacion del state para saber si han habido o no errores
    const [ errores, guardarErrores ] = useState({});
    //actualizacion del state para si saber si el formulario fue submitido o no
    const [ submitForm, guardarSubmitForm ] = useState(false);

    //Ejecutamos cuando el usuario manda el submit, para llamar luego a validarCrearCuenta, 
    //y esta retorna la variable que monitorea useEffect 'errores'
    useEffect(() => {
        //submitForm vale true
        if(submitForm) {
            //Object.jeys es para saber si el objeto de errores esta vacio o no
            const noErrores = Object.keys(errores).length === 0;

            //Si el objeto esta vacio(no tiene errores)
            if(noErrores) {
                //Ejecutamos la funcion recibida desde el componente en cuestion
                fn(); // Fn = Función que se ejecuta en el componente
            }
            //Reseteamos el valor de submitForm a false, para habilitarlo nuevamente
            guardarSubmitForm(false);
        }
    }, [errores]);

    //Guardamos lo que el usuario ingresa en el input
    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }

    //Función que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        //para que no se envie el query string en la parte superior, ni se recarge la pagina
        e.preventDefault();
        //Verificamos si los datos ingresados desde el input son validos
        const erroresValidacion = validar(valores);
        //guardamos los 'errores' que seran monitoreados por el useEffect
        guardarErrores(erroresValidacion);
        //Seteamos a true para que active el submitForm del useEffect
        //Esto no lo hacemos en el handleBlur, ya que este es solo informativo(sin submit)
        guardarSubmitForm(true);
    }


    //Cuando el usuario esta escribiendo y se sale de golpe, genera el evento blur, entonces 
    //se puede ir validando en tiempo real sin necesidad de que el usuario mande el submit
    const handleBlur = () => {
        //Verificamos si los datos ingresados desde el input son validos        
        const erroresValidacion = validar(valores);
        //guardamos los 'errores' que seran monitoreados por el useEffect
        //solo a nivel informativo, sin submit
        guardarErrores(erroresValidacion);
    }

    return {
        valores, 
        errores, 
        handleSubmit,
        handleChange,
        handleBlur
    }
}
 
export default useValidacion;