// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app"
import { Auth, getAuth } from "firebase/auth"
import { FirebaseStorage, getStorage } from "firebase/storage"
import { Firestore, initializeFirestore } from "firebase/firestore" // ✅ updated import
import config from '../config.json'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: config.REACT_APP_FIREBASE_API_KEY,
  authDomain: config.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: config.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: config.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.REACT_APP_FIREBASE_APP_ID,
}

// Initialize Firebase
const currentApps = getApps()
let auth: Auth
let storage: FirebaseStorage
let db: Firestore

if (!currentApps.length) {
  const app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  storage = getStorage(app)
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // ✅ fallback transport to avoid WebChannel 400 errors
  })
} else {
  const app = currentApps[0]
  auth = getAuth(app)
  storage = getStorage(app)
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // ✅ same fallback for already initialized app
  })
}

// Export initialized services
export { auth, storage, db }