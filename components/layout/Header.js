import React from 'react';
import Link from 'next/link';
import Buscar from '../ui/Buscar';
import Navegacion from '../layout/Navegacion';

const Header = () => {
    return (  
        <header>

            <div>
                <div>
                    <p>Desde el Header</p>

                    <Buscar />

                    <Navegacion />
                    
                </div>

                <div>
                    <p>Hola: Checho</p>

                    <button type='submit'>Cerrar Sesión</button>

                    <Link href='/'>Login</Link>
                    <Link href='/'>Crear Cuenta</Link>  
                </div>

            </div>
        </header>
    );
}
 
export default Header;