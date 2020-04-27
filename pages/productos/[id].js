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

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

const Producto = () => {

    //Actualizacion del state del producto
    const [ producto, guardarProducto ] = useState({});
    const [ error, guardarError ] = useState(false);
    const [ comentario, guardarComentario ] = useState({});
    const [consultarDB, guardarConsultarDB ] = useState(true);

    //Obtenemos el id actual a traves del Routing
    const router = useRouter();
    //console.log(router);
    //Extraemos el id desde el router
    const { query: { id } } = router;

    //State del usuario y de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    //Como react renderiza varias veces el componente(la primera el id es undefined), 
    //monitoreamos estas actualizaciones para solo renderizarlo cuando venga informado el id
    //consultarBD nos permite monitorear cuando debemos acceder a la base de datos, ya se cuando
    //se renderiza por primera vez el componente, y cuando hay una actualizacion por un
    //nuevo voto o comentario
    useEffect(() => {
        if (id && consultarDB) {
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
                   //Como termino la consulta, reseteamos a false
                   guardarConsultarDB(false);
                } else {
                   //Si no existe, activamos el renderizado del componente Error404
                   guardarError( true );
                   //Como termino la consulta, reseteamos a false
                   guardarConsultarDB(false);
                }
            }
            //Obtenemos el producto desde la base de datos
            obtenerProducto();
        }
    }, [ id ]);

    //Para que no se vea en blanco el renderizado del componente mientras el id no este informado
    //Se agrego a la condicion el error, porque si hay error no se deberia mostrar el 'Cargando'
    if (Object.keys(producto).length === 0 && !error)  return 'Cargando...';

    //Extraemos los datos del producto
    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    //Monitoreo del voto de un producto para que sea de un usuario autenticado 
    //y para que este no pueda votar mas de una vez un mismo producto    
    const votarProducto = () => {
        //Si el usuario no esta autenticado lo redireccionamos al login
        if(!usuario) {
            return router.push('/login')
        }

        //Obtenemos la cantidad de votos actual del producto desde la base de datos y le sumanos uno mas
        const nuevoTotal = votos + 1;

        //Chequeamos que este usuario no haya votado antes este producto
        if(haVotado.includes(usuario.uid) ) return;

        //Si el voto es el primero del usuario para este producto, asignamos a la lista de votantes del producto el id del usuario actual
        const nuevoHaVotado = [...haVotado, usuario.uid];

        //Actualizamos la cantidad de votos y el nuevo id de votantes en la base de datos
        firebase.db.collection('productos').doc(id).update({ 
            votos: nuevoTotal, 
            haVotado: nuevoHaVotado 
        })

        //Actualizamos el state con la nueva cantidad de votos para este producto
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })

        //Hubo una actualizacion por un nuevo voto, entonces consultamos la base de datos        
        guardarConsultarDB(true);
    }

    //Actualizamos en el state el comentario(name='mensaje') ingresado por el usuario desde el input
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }

    //Chequeamos si el comentario fue realizado por el creador del producto
    const esCreador = id => {
        if(creador.id == id) {
            return true;
        }
    }

    //Agregamos un comentario al producto
    const agregarComentario = e => {
        //para que no se envie el query string en la parte superior, ni se recarge la pagina       
        e.preventDefault();

        //Si el usuario no esta autenticado lo redireccionamos al login
        if(!usuario) {            
            return router.push('/login')
        }

        //Agregamos informacion extra al comentario del usuario que lo realizo
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //A la lista de comentarios anteriores le sumamos el nuevo comentario
        const nuevosComentarios = [...comentarios, comentario];

        //Actualizamos los comentarios con un nuevo mensaje(usuario.uid y usuario.displayName) en la base de datos
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })

        //Actualizamos el state con el nuevo comentario para este producto
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        //Hubo una actualizacion por un nuevo comentario, entonces consultamos la base de datos
        guardarConsultarDB(true);
    }

    return ( 
        <Layout>
            <>
                { error ? <Error404 /> : (
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
                                    <form
                                        onSubmit={agregarComentario}
                                    >
                                        <Campo>
                                            <input
                                                type='text'
                                                name='mensaje'
                                                onChange={comentarioChange}                                           
                                            />
                                        </Campo>
                                        <InputSubmit
                                            type='submit'
                                            value='Agregar Comentario'
                                        />
                                    </form>
                                    </>
                                ) }                                    

                                <h2 css={css`
                                    margin: 2rem 0;
                                `}>Comentarios</h2>

                                {comentarios.length === 0 ? 'Aún no hay comentarios' : (
                                    <ul>
                                        {comentarios.map((comentario, i) => (
                                            <li 
                                                key={`${comentario.usuarioId}-${i}`} /*la clave es el id + '-' + indice del map*/
                                                css={css`
                                                    border: 1px solid #e1e1e1;
                                                    padding: 2rem;
                                                `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por: 
                                                    <span
                                                        css={css`
                                                            font-weight:bold;
                                                        `}
                                                    >
                                                    {''} {comentario.usuarioNombre}
                                                    </span>
                                                </p>
                                                { esCreador( comentario.usuarioId ) && <CreadorProducto>Es Creador</CreadorProducto> }                                            
                                            </li>
                                        ))}
                                    </ul>
                                )}                            
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
                                        <Boton
                                            onClick={votarProducto}
                                        >
                                            Votar
                                        </Boton>
                                    ) }
                                </div>                            
                            </aside>
                        </ContenedorProducto>
                    </div>
                ) }

            </>
        </Layout>
      );
}

export default Producto;