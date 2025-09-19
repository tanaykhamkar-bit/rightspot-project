// admin-accounts.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

async function loadAccounts() {
  const snap = await getDocs(collection(db, 'users'));
  const out = document.getElementById('accountsList');
  out.innerHTML = '';
  snap.forEach(d => {
    const u = d.data();
    const row = document.createElement('div');
    row.className = 'listing-card';
    row.innerHTML = `<div class="meta"><strong>${u.name || '—'}</strong><div>${u.email}</div></div><div>${u.isAdmin ? 'Admin' : 'User'}</div>`;
    out.appendChild(row);
  });
}

onAuthStateChanged(auth, async user => {
  if (!user) { alert('Please login'); location.href='login.html'; return; }
  const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js");
  const uRef = doc(db, 'users', user.uid);
  const uSnap = await getDoc(uRef);
  if (!uSnap.exists() || !uSnap.data().isAdmin) {
    alert('You are not an admin.');
    location.href = 'index.html';
    return;
  }
  loadAccounts();
});
