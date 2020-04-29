import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

const Buscar = () => {

  //Obtenemos la busqueda solicitada a traves del Routing
  const router = useRouter();
  //Extraemos la busqueda desde el router
  const { query: { q }} = router;

  //Obtenemos los productos desde le custom hook ordenados por cantidad de votos
  const { productos } = useProductos('creado');
  //Actualizacion del state del resultado de la busqueda
  const [ resultado, guardarResultado ] = useState([]);
  
  //Monitereamos la busqueda en base a los productos obtenidos desde la base de datos 
  //y al query solicitado por el usuario
  useEffect(() => {
    //Agregamos este if ya que si se quiere hacer una busqueda directamente desde el browser,
    //es decir, sin acceder a la barra de busqueda, generaria un error ya que el query que 
    //recibiriamos desde el useRouter seria undefined y eso generaria un error cuando
    //se ejecuta el busqueda = q.toLowerCase();
    //Inicializamos la variable para formatear el query recibido
    let busqueda = '';
    //Si el query viene desde el useRotuer
    if (q !== undefined) {
      //Convertimos el query del usuaro a miñusculas
      //const busqueda = q.toLowerCase();
      busqueda = q.toLowerCase();
      //console.log(busqueda)
    }else { //Si el query viene directamente desde el browser
      //recuperamos el querystring
      const querystring = window.location.search
      //console.log(querystring) // '?q=pisos+en+barcelona&ciudad=Barcelona'
      //usando el querystring, creamos un objeto del tipo URLSearchParams
      const params = new URLSearchParams(querystring)
      //console.log(params.get('q'));
      //Convertimos el query del usuaro a miñusculas
      busqueda = params.get('q').toLowerCase();
      //console.log(busqueda);
    }
      //Recorremos la lista de productos obtenida desde la base de datos y en base al query 
      //del usuario, seleccionamos los productos en que tanto el nombre del producto como su
      //descripcion coincidan con el query(el nombre y la descripcion del producto tambien
      //seran convertidas a miñusculas) 
      const filtro = productos.filter(producto => {
        return (
          producto.nombre.toLowerCase().includes(busqueda) || 
          producto.descripcion.toLowerCase().includes(busqueda)
        )
      });

      //Actualizamos el state con el resultado de la busqueda
      guardarResultado(filtro);
      
  }, [ q, productos ]);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
            <div className="contenedor">
              <ul className="bg-white">
                  {resultado.map(producto => (
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

export default Buscar