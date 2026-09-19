import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-8511b.firebaseapp.com",
  projectId: "interviewiq-8511b",
  storageBucket: "interviewiq-8511b.firebasestorage.app",
  messagingSenderId: "205125272945",
  appId: "1:205125272945:web:60de85ff1af43bd4dc62d0"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth, provider}