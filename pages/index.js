import React, { useEffect, useState, useContext } from 'react'
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import { FirebaseContext } from '../firebase';

//const Heading = styled.h1`color: red`...ejemplo con styled components
//<style jsx>{`h1{color: red}`}</style>...ejemplo css en js
//onSnapshot y su funcion manejarSnapshot, es lo que realmente accede a los datos y nos permite iterarlos
const Home = () => {

  //Actualizacion del state de lo productos traidos desde la base de datos
  const [productos, guardarProductos] = useState([]);

  //State de firebase
  const { firebase } = useContext(FirebaseContext);

  //Monitoreamos el renderizado del componente, para ir mostrando los productos del usuario
  useEffect(() => {
    //Definimos el orden en que se van a traer los datos
    const obtenerProductos = () => {
        firebase.db.collection('productos').orderBy('creado', 'desc').onSnapshot(manejarSnapshot)
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

  return (    
    <div>
      <Layout>
        <div className='listado-productos'>
            <div className='contenedor'>
              <ul className='bg-white'>
                  {productos.map(producto => (
                      <DetallesProducto
                          key={producto.id}
                          producto={producto}
                      />
                  ))}
              </ul>
            </div>
        </div>
      </Layout>
    </div>
  )
}

export default Home