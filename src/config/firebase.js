import { initializeApp } from 'firebase/app'
import { getFirestore,collection,getDocs,doc, addDoc,setDoc,getDoc } from 'firebase/firestore'


//Claves para firestore
export const firebaseApp = initializeApp({
    apiKey: "AIzaSyDy9c_uge2ddfqXbUP-h1N5N5IJ-CwZFAs",
    authDomain: "calendario-kawak.firebaseapp.com",
    projectId: "calendario-kawak",
    storageBucket: "calendario-kawak.appspot.com",
    messagingSenderId: "1040976589095",
    appId: "1:1040976589095:web:8b26e6c5702cdab7caf902"
})

// Referencia a la base de datos
const db = getFirestore(firebaseApp)
const notasRef = collection(db,'notas')


/**
 * Verifica si el usuario existe usando el email.
 *
 * @param {string} userId - El ID del usuario.
 * @returns {Boolean} - true: El usuario existe. false: el usuario no existe
 */
export async function userExists(email){
    try {
        const usuarioDocRef = doc(notasRef, email);
        const usuarioDocSnapshot = await getDoc(usuarioDocRef);
        return usuarioDocSnapshot.exists()
    } catch (error) {
        console.error("Hubo un inesperado al verficar la existencia el usuario:")
        throw error
    }
}


/**
 * Verifica si la contraseña del usuario es valida
 *
 * @param {String}  email - El email del usuario sin lowerCase
 * @param {number} password - Contraseña del usuario
 * @returns {boolean} - true: Contraseña valida. false: Contraseña invalida 
 */
export async function userValidatorPassword(email,password){

    try {
        const usuarioDocRef = doc(notasRef, email);
        const usuarioDocSnapshot = await getDoc(usuarioDocRef);
        if(usuarioDocSnapshot.exists()){
            return usuarioDocSnapshot.data().password === password
        }else{
            console.warn("el usuario no existe")
            return false
        }
    } catch (error) {
        console.error("Hubo un error al verificar el usuario")
        throw error
    }
}

/**
 * Si el usuario no existe lo crea
 * 
 * @param {String}  email - El email del usuario sin lowerCase
 * @param {String} name - Nombre del usuario 
 * @param {number} password - Contraseña del usuario
 * @returns {boolean} - true: El usuario existe. false: El usuario no existe
 */
export async function setUserDontExist(email,name,password){
    try {
        // Crear documento de usuario solo si no existe
        const usuarioDocRef = doc(notasRef, email);
        const usuarioDocSnapshot = await getDoc(usuarioDocRef);

        if (usuarioDocSnapshot.exists()) {
            console.warn("El usuario ya existe")
            return true 
          } else {
            // El documento no existe, entonces se crea
            await setDoc(usuarioDocRef, { name: name, password: password });
            // Crear subcolección "notas" dentro del documento de usuario
            const notasCollectionRef = collection(usuarioDocRef, 'notas_usuario');
            await setDoc(doc(notasCollectionRef), {});
            console.log("El usuario ah sido creado")
            return false 
          }

    } catch (error) {
        throw error
    }
}


/**
 * Agrega una nota con los datos enviados
 * 
 * @param {String}  email - El email del usuario sin lowerCase
 * @param {Object} datos - Los datos que va a tener la nota
 */
export async function setNote(email,datos){
    try{
        const usuarioDocRef = doc(notasRef,email);
        const notasUsuarioRef = collection(usuarioDocRef, 'notas_usuario');
        await addDoc(notasUsuarioRef, datos);
    }catch(error){
        console.log("error al añadir la nota")
        throw error
    }
}


/**
 * Traer todas las notas de un usuario
 *
 * @param {String}  email - El email del usuario sin lowerCase
 */
export async function getNotas(email){
    try{
       return await getDocs(collection(notasRef,email, 'notas_usuario'));
    }catch(error){
        throw error;
    }
}

/**
 * Actualiza una nota en especifico
 *
 * @param {String}  email - El email del usuario sin lowerCase
 * @param {number}  noteId - El id de la nota
 * @param {Object} updatedData - La data va a tener la nota
 */
export async function updateNote(email, noteId, updatedData) {
    try {
        const usuarioDocRef = doc(notasRef, email);
        const notasUsuarioRef = collection(usuarioDocRef, 'notas_usuario');
        const notaDocRef = doc(notasUsuarioRef, noteId);

        // Verificar si la nota existe antes de intentar actualizar
        const notaDocSnapshot = await getDoc(notaDocRef);

        if (notaDocSnapshot.exists()) {
            // La nota existe, por lo que la actualizamos
            await setDoc(notaDocRef, updatedData, { merge: true });
            console.log("Nota actualizada correctamente");
        } else {
            console.warn("La nota no existe");
        }
    } catch (error) {
        console.error("Hubo un error al actualizar la nota:", error);
        throw error;
    }
}
