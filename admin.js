// admin.js
import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists() || snap.data().isAdmin !== true) {
      alert("Access denied. Admins only.");
      window.location.href = "index.html";
    }
  } else {
    // Not logged in
    window.location.href = "login.html";
  }
});
