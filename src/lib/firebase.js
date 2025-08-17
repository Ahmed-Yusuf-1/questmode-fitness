import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAA77rN05VIa4gED-eyKBuGij1AfK2Uo6U",
  authDomain: "questmode-fitness.firebaseapp.com",
  projectId: "questmode-fitness",
  storageBucket: "questmode-fitness.firebasestorage.app",
  messagingSenderId: "99634800020",
  appId: "1:99634800020:web:5f08836b3dbb767e679b81"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
    