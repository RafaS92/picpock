import firebase from "firebase";

const firebaseApp = {
  apiKey: "AIzaSyBGxy1BTDnrUy__hsHg-ZEnMYaXLdC8yBA",
  authDomain: "picpock-e2966.firebaseapp.com",
  databaseURL: "https://picpock-e2966.firebaseio.com",
  projectId: "picpock-e2966",
  storageBucket: "picpock-e2966.appspot.com",
  messagingSenderId: "391768206620",
  appId: "1:391768206620:web:09da54c4ec0e8894681ed9",
  measurementId: "G-KQF0564K0R",
};

const db = firebaseApp.firestore();
const auth = firebaseauth();
const storage = firebase.storage();

export { db, auth, storage };
