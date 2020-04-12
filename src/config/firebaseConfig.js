import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBbKu92e44QFa2aA6qNf9DvvkvytI1Vgqs",
  authDomain: "stilldhaka-a1633.firebaseapp.com",
  databaseURL: "https://stilldhaka-a1633.firebaseio.com",
  projectId: "stilldhaka-a1633",
  storageBucket: "stilldhaka-a1633.appspot.com",
  messagingSenderId: "904226502437",
  appId: "1:904226502437:web:277e88e8b8a96500580ccc",
  measurementId: "G-YBZY90SHYV"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();