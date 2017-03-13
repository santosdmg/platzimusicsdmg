import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyB3UUkyzTqMJq-SMf-CtqMb1dTmoV-3XvM",
    authDomain: "platzimusicsdmg.firebaseapp.com",
    databaseURL: "https://platzimusicsdmg.firebaseio.com",
    storageBucket: "platzimusicsdmg.appspot.com",
    messagingSenderId: "301894320546"
};

firebase.initializeApp(config);

export const firebaseAuth = firebase.auth();
export const firebaseDatabase = firebase.database();

export default firebase;
