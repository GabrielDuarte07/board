import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDogWl3B25ByxYGpvUUwHG1GSD9aa4O6YY",
  authDomain: "tarefas-7a88d.firebaseapp.com",
  projectId: "tarefas-7a88d",
  storageBucket: "tarefas-7a88d.appspot.com",
  messagingSenderId: "741069365988",
  appId: "1:741069365988:web:cda7dc9844e4bba318c2f1",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
