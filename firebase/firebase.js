import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
//Importamos la configuracion de firebase
import firebaseConfig from './config';

class Firebase {
    constructor() {
        //Para que no tire error de aplicacion ya creada en el servidor
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig)
        }
        //Para habilitar la autenticacion
        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();
    }

    //Registramos una nueva cuenta de usuario
    async registrar(nombre, email, password) {
        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password);

        //Creamos el usuario y actualizamos el nombre
        return await nuevoUsuario.user.updateProfile({
            displayName : nombre
        })
    }

    //Iniciamos una sesión de usuario
    async login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    //Cerramos una sesión del usuario
    async cerrarSesion() {
        await this.auth.signOut();
    }
}

//Creamos la clase con sus metodos
const firebase = new Firebase();
export default firebase;