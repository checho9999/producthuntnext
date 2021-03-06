import React, { useState } from 'react';
import { css } from '@emotion/core';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import firebase from '../firebase';

//validaciones del componente
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
}

const CrearCuenta = () => {

  //actualizacion del state para saber si han habido o no errores
  const [ error, guardarError ] = useState(false);

  //Utilizamos el custom hook useValidacion
  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  //Extraemos los datos de la nueva cuenta
  const { nombre, email, password } = valores;
 
  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      //Si el usuario se pudo registrar redireccionamos hacia el root principal
      Router.push('/');
    } catch (error) {
      console.error('Hubo un error al crear el usuario ', error.message);
      //Actualizamos el state de error
      guardarError(error.message);
    }
  }  

  return ( 
    <div>
    <Layout>
      <>
        <h1
          css={css` /* No lo ponemos dentro del Global porque no todos los h1 estaran centrados */
            text-align: center;
            margin-top: 5rem;
          `}
        >Crear Cuenta</h1>  
        <Formulario
          onSubmit={handleSubmit}
        >
            <Campo>
                <label htmlFor='nombre'>Nombre</label>
                <input 
                    type='text'
                    id='nombre'
                    placeholder='Tu Nombre'
                    name='nombre'
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}                    
                />
            </Campo>

            {errores.nombre && <Error>{errores.nombre}</Error> }

            <Campo>
                <label htmlFor='email'>Email</label>
                <input 
                    type='email'
                    id='email'
                    placeholder='Tu Email'
                    name='email'
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}                    
                />
            </Campo>

            {errores.email && <Error>{errores.email}</Error> }

            <Campo>
                <label htmlFor='password'>Password</label>
                <input 
                    type='password'
                    id='password'
                    placeholder='Tu Password'
                    name='password'
                    value={password}
                    onChange={handleChange}
                    onBlur={handleBlur}                    
                />
            </Campo>

              {errores.password && <Error>{errores.password}</Error> }

              {error && <Error>{error} </Error>}

            <InputSubmit
              type='submit'
              value='Crear Cuenta'
            />
          </Formulario>
      </>
    </Layout>
  </div>
  )
}

export default CrearCuenta;