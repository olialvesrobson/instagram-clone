import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBk5SBoXGK8HVz2PzzHnDPM8JHP3sSRAbQ",
    authDomain: "instagram-clone-roatechie.firebaseapp.com",
    databaseURL: "https://instagram-clone-roatechie.firebaseio.com",
    projectId: "instagram-clone-roatechie",
    storageBucket: "instagram-clone-roatechie.appspot.com",
    messagingSenderId: "461226338093",
    appId: "1:461226338093:web:496c8161c23796a66195a4",
    measurementId: "G-4J3YGM19C3"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

  // export default db;