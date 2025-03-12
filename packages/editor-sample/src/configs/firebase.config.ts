import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnZ_VPyKuzQdFBu4H3KinAxbJdYfvX4k0",
  authDomain: "ovcmailer-ovc.firebaseapp.com",
  projectId: "ovcmailer-ovc",
  storageBucket: "ovcmailer-ovc.firebasestorage.app",
  messagingSenderId: "291983092956",
  appId: "1:291983092956:web:ab6b49a1ef0b45c3065819",
  measurementId: "G-ER18SZJ97Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
