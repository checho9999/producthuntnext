import React  from 'react'
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

//const Heading = styled.h1`color: red`...ejemplo con styled components
//<style jsx>{`h1{color: red}`}</style>...ejemplo css en js
//onSnapshot y su funcion manejarSnapshot, es lo que realmente accede a los datos y nos permite iterarlos
const Home = () => {

  //Obtenemos los productos desde le custom hook ordenados por fecha de creacion
  const { productos } = useProductos('creado');

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