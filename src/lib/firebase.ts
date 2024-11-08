import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFrcKoNBFJ-erL7vWrW3dce5QdQC8ygsQ",
  authDomain: "use-count-9d8a9.firebaseapp.com",
  projectId: "use-count-9d8a9",
  storageBucket: "use-count-9d8a9.appspot.com",
  messagingSenderId: "1009756851410",
  appId: "1:1009756851410:web:4779cc3fa29fd19313f10b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  USAGE: 'usage',
  SUBSCRIPTIONS: 'subscriptions'
} as const;

// Usage tracking function
export async function trackUsage(userId: string, action: string) {
  const usageRef = collection(db, COLLECTIONS.USAGE);
  
  await addDoc(usageRef, {
    userId,
    action,
    timestamp: serverTimestamp()
  });
}