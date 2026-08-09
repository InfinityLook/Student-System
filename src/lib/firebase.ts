import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA10SSi6h7WJO5_a2iXPNv94LhHDx_XKGA",
  authDomain: "studypilot-be241.firebaseapp.com",
  projectId: "studypilot-be241",
  storageBucket: "studypilot-be241.firebasestorage.app",
  messagingSenderId: "485129393768",
  appId: "1:485129393768:web:1cdcb301cfeded19308ddd",
  measurementId: "G-76LBW0KDHJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
