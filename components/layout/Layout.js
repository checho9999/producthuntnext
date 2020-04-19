import React from 'react';
import Link from 'next/link';

//<> </> es la forma simplificada de utilizar Fragment sin importarlo
const Layout = ( props ) => {
    return (  
        <>
            <h1>Header</h1>

            <nav>
                <Link href='/'>Inicio</Link>
                <Link href='/nosotros'>Nosotros</Link>
            </nav>

            <main>
                {props.children}
            </main>        
        </>
    );
}
 
export default Layout;