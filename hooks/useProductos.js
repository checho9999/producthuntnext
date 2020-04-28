import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase';

const useProductos = orden => {
    //Actualizacion del state de lo productos traidos desde la base de datos
    const [ productos, guardarProductos ] = useState([]);

    //State de firebase
    const { firebase } = useContext(FirebaseContext);
    
    //Monitoreamos el renderizado del componente, para ir mostrando los productos del usuario
    useEffect(() => {
        //Definimos el orden en que se van a traer los datos
        const obtenerProductos = () => {
            firebase.db.collection('productos').orderBy(orden, 'desc').onSnapshot(manejarSnapshot)
        }
        //Obtenemos todos los productos desde la base de datos
        obtenerProductos();
    }, []);

    //Manejamos el Snapshot, accediendo e iterando sobre los datos
    //El doc.id es para iterar en el map y el doc.data() para traer todo el registo de cada doc.id
    function manejarSnapshot(snapshot) {
        const productos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
      //console.log(productos)
      //Colocamos los productos en el state
      guardarProductos(productos);
    }

    return {
        productos
    }
}

export default useProductos;