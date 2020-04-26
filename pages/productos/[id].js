import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`
const Producto = () => {

    //Actualizacion del state del producto
    const [ producto, guardarProducto ] = useState({});
    const [ error, guardarError ] = useState(false);

    //Obtenemos el id actual a traves del Routing
    const router = useRouter();
    //console.log(router);
    //Extraemos el id desde el router
    const { query: { id } } = router;

    //State del usuario y de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    //Como react renderiza varias veces el componente(la primera el id es undefined), 
    //monitoreamos estas actualizaciones para solo renderizarlo cuando venga informado el id
    useEffect(() => {
        if (id) {
            //funcion para obtener los productos
            const obtenerProducto = async () => {
                //Definimos que producto queremos traer en base a su id
                const productoQuery = await firebase.db.collection('productos').doc(id);
                //Iniciamos la obtencion del producto
                const producto = await productoQuery.get();
                //Verificamos si existe el producto a traves de exists de firebase
                if (producto.exists) {
                   //Si existe, guardamos toda la informacion del producto a traves de data() de firebase
                   guardarProducto( producto.data() );
                   //console.log('El producto existe');
                } else {
                   //Si no existe, activamos el renderizado del componente Error404
                   guardarError( true );
                }
            }
            //Obtenemos el producto desde la base de datos
            obtenerProducto();
        }
    }, [id]);

    //Para que no se vea en blanco el renderizado del componente mientras el id no este informado
    if (Object.keys(producto).length === 0) return 'Cargando...';

    //Extraemos los datos del producto
    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador } = producto;

    return ( 
        <Layout>
            <>
                { error && <Error404 /> }

                <div className='contenedor'>
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}>{nombre} </h1>

                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: { formatDistanceToNow( new Date(creado), { locale: es } ) } </p>
                            <p>Por: {creador.nombre} de {empresa} </p>
                            <img src={urlimagen} />
                            <p>{descripcion}</p>

                            { usuario && (
                                <>
                                <h2>Agrega tu comentario</h2>
                                <form>
                                    <Campo>
                                        <input
                                            type="text"
                                            name="mensaje"
                                        />
                                    </Campo>
                                    <InputSubmit
                                        type="submit"
                                        value="Agregar Comentario"
                                    />
                                </form>
                                </>
                            ) }                                    

                            <h2 css={css`
                                margin: 2rem 0;
                            `}>Comentarios</h2>

                            {comentarios.map(comentario => (
                                <li>
                                    <p>{comentario.nombre}</p>
                                    <p>Escrito por: {comentario.usuarioNombre}</p>
                                </li>
                            ))}                            
                        </div>

                        <aside>
                            <Boton
                                target='_blank'
                                bgColor='true'
                                href={url}
                            >Visitar URL</Boton>

                            <div
                                css={css`
                                    margin-top: 5rem;
                                `}
                            >
                                <p css={css`
                                    text-align: center;
                                `}>{votos} Votos</p>

                                { usuario && (
                                    <Boton>
                                        Votar
                                    </Boton>
                                ) }
                            </div>                            
                        </aside>
                    </ContenedorProducto>
                </div>
            </>
        </Layout>
      );
}

export default Producto;