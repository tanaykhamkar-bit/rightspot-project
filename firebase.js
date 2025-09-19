// firebase.js
// IMPORTANT: save as ES module and keep this file at project root
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// --- your firebase config (you already have this) ---
const firebaseConfig = {
  apiKey: "AIzaSyCq95UMCRoKc4VQB5UiQ0nPkuARbC-c3gI",
  authDomain: "rightspot-project.firebaseapp.com",
  projectId: "rightspot-project",
  storageBucket: "rightspot-project.firebasestorage.app",
  messagingSenderId: "497714106543",
  appId: "1:497714106543:web:4e57dbae72d26afddec45a"
};

// initialize
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
