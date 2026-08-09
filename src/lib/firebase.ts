import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForBuild12345",
  authDomain: "studypilot.firebaseapp.com",
  projectId: "studypilot",
  storageBucket: "studypilot.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
