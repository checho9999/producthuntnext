import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Router from 'next/router';

const InputText = styled.input`
    border: 1px solid var(--gris3);
    padding: 1rem;
    min-width: 300px;
`;

const InputSubmit = styled.button`
    height: 3rem;
    width: 3rem;
    display: block;
    background-size: 4rem;
    background-image: url('/static/img/buscar.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top: 1px;
    background-color: white;
    border: none;
    text-indent: -9999px; /*con esto no se ve el texto Buscar*/

    &:hover {
        cursor: pointer;
    }
`;

const Buscar = () => {

    //Actualizacion del state de la busqueda del usuario
    const [ busqueda, guardarBusqueda ] = useState('');

    const buscarProducto = e => {
        //para que no se envie el query string en la parte superior, ni se recarge la pagina       
        e.preventDefault();
        //Valiamos que la busqueda ingresada por el usuario desde el input este informada
        if(busqueda.trim() === '') return;
        //Si hay una busqueda valida, la redireccionamos hacia Buscar con su respectivo query
        Router.push({
            pathname: '/buscar', 
            query: { q : busqueda }
        })
    }

    return (  
        <form
            css={css`
                position: relative;
            `}
            onSubmit={buscarProducto}        
        >
            <InputText type='text' 
                type='text'
                placeholder='Buscar Productos'
                onChange={e => guardarBusqueda(e.target.value) }
            />

            <InputSubmit type='submit'>Buscar</InputSubmit>
        </form>
    );
}
 
export default Buscar;