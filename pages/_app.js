import App from 'next/app';
import firebase, { FirebaseContext } from '../firebase';
import useAutenticacion from '../hooks/useAutenticacion';

const MyApp = props => {
    //chequeamos la autenticacion de inicio de sesion de un usuario
    const usuario = useAutenticacion();
    //console.log(usuario);
    //Extraemos el componente actual y las props de la pagina
    const { Component, pageProps } = props;

    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario
            }}
        >
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    )
}

export default MyApp;