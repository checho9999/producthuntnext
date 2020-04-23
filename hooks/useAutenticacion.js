import React, { useEffect, useState } from 'react';
import firebase from '../firebase';

function useAutenticacion() {
    //Actualizamos el state segun el usuario este autenticado o no
    const [ usuarioAutenticado, guardarUsuarioAutenticado] = useState(null);
    //Monitoreamos cualquier actualizacion en el componente
    useEffect(() => {
        //Nos fijamos si hubo algun cambio en la autenticacion
        const unsuscribe = firebase.auth.onAuthStateChanged(user => {
            //Si es un usuario autenticado
            if( user ) {
                guardarUsuarioAutenticado(user);
            } else {
                guardarUsuarioAutenticado(null);
            }
        });
        //Retornamos el resultado de la autenticacion
        return () => unsuscribe();

    }, []);

    return usuarioAutenticado;
}

export default useAutenticacion;