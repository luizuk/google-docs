// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBQtRBTxwURcJAS5GsTxopsNbh3zCmJdFE",
  authDomain: "docs-clone-7b4dd.firebaseapp.com",
  projectId: "docs-clone-7b4dd",
  storageBucket: "docs-clone-7b4dd.appspot.com",
  messagingSenderId: "387361248683",
  appId: "1:387361248683:web:3c6d8582b83971bd86aeee"
}


// Initialize Firebase

const app = initializeApp(firebaseConfig)
const db = getFirestore()

export { db }
