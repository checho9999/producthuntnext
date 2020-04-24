import React, { useState, useContext } from 'react';
import { css } from '@emotion/core';
import { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import { FirebaseContext } from '../firebase';

//validaciones del componente
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  //Actualizacion del state del upload de las imagenes
  const [nombreimagen, guardarNombre] = useState('');
  const [subiendo, guardarSubiendo] = useState(false);
  const [ progreso, guardarProgreso ] = useState(0);
  const [urlimagen, guardarUrlImagen] = useState('');

  //actualizacion del state para saber si han habido o no errores
  const [ error, guardarError] = useState(false);

  //Utilizamos el custom hook useValidacion
  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  //Extraemos los datos del nuevo producto
  const { nombre, empresa, imagen, url, descripcion } = valores;

  //Hook de routing para redireccionar hacia otros componentes
  const router = useRouter();

  //State del usuario y de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearProducto() {
    //Nos fijamos si el usuario esta autenticado para crear productos
    if(!usuario) {
      //Si el usuario no estaba autenticado lo redireccionamos hacia el Login
      return router.push('/login');
    }

    //Creamos el objeto del nuevo producto
    const producto = {
        nombre, 
        empresa, 
        url, 
        urlimagen,
        descripcion,
        votos: 0,
        comentarios: [],
        creado: Date.now()
    }

    //Insertamos el objeto en la base de datos
    firebase.db.collection('productos').add(producto);
    //Si el producto se pudo crear redireccionamos hacia el root principal
    return router.push('/');

  }

  //Manejamos el inicio del upload 
  const handleUploadStart = () => {
      guardarProgreso(0);
      guardarSubiendo(true);
  }

  //Manejamos el progreso del upload
  const handleProgress = progreso => guardarProgreso( { progreso } );

  //Manejamos el error del upload
  const handleUploadError = error => {
      guardarSubiendo(error);
      console.error(error);
  };

  //Manejamos el upload satisfactorio
  const handleUploadSuccess = nombre => {
      guardarProgreso(100);
      guardarSubiendo(false);
      guardarNombre(nombre)
      firebase
          .storage
          .ref("productos")
          .child(nombre)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            guardarUrlImagen(url);
          } );
  };

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Nuevo Producto</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >

            <fieldset>
              <legend>Información General </legend>
           
              <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                      type="text"
                      id="nombre"
                      placeholder="Tu Nombre"
                      name="nombre"
                      value={nombre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                  />
              </Campo>

              {errores.nombre && <Error>{errores.nombre}</Error> }
  
              <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input 
                      type="text"
                      id="empresa"
                      placeholder="Nombre Empresa o Compañia"
                      name="empresa"
                      value={empresa}
                      onChange={handleChange}
                      onBlur={handleBlur}
                  />
              </Campo>

              {errores.empresa && <Error>{errores.empresa}</Error> }
  
              <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader 
                      accept="image/*"
                      id="imagen"
                      name="imagen"
                      randomizeFilename
                      storageRef={firebase.storage.ref("productos")}
                      onUploadStart={handleUploadStart}
                      onUploadError={handleUploadError}
                      onUploadSuccess={handleUploadSuccess}
                      onProgress={handleProgress}
                  />
              </Campo>
              <Campo>
                  <label htmlFor="url">URL</label>
                  <input 
                      type="url"
                      id="url"
                      name="url"
                      placeholder="URL de tu producto"
                      value={url}
                      onChange={handleChange}
                      onBlur={handleBlur}
                  />
              </Campo>

              {errores.url && <Error>{errores.url}</Error> }

            </fieldset>

            <fieldset>
              <legend>Sobre tu Producto</legend>

              <Campo>
                  <label htmlFor="descripcion">Descripcion</label>
                  <textarea 
                      id="descripcion"
                      name="descripcion"
                      value={descripcion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                  />
              </Campo>

              {errores.descripcion && <Error>{errores.descripcion}</Error> }
            </fieldset>           
              
              {error && <Error>{error} </Error>}
  
              <InputSubmit 
                type="submit"
                value="Crear Producto"
              />
          </Formulario>
        </>
      </Layout>
    </div>
  )
}

export default NuevoProducto