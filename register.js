// register.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const form = document.getElementById('registerForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // create users doc
    await setDoc(doc(db, 'users', cred.user.uid), {
      name: name || email.split('@')[0],
      email,
      isAdmin: false,
      createdAt: serverTimestamp()
    });
    alert('Account created. Please login to continue.');
    window.location = 'login.html';
  } catch (err) {
    alert('Error: ' + err.message);
  }
});
