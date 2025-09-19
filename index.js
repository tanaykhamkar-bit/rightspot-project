// index.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const profileBtn = document.getElementById('profileBtn');
const profilePopup = document.getElementById('profilePopup');
const profileName = document.getElementById('profileName');
const myBookingsBtn = document.getElementById('myBookingsBtn');
const logoutBtn = document.getElementById('logoutBtn');

onAuthStateChanged(auth, async user => {
  if (user) {
    // fetch user doc for display name
    try {
      const udoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', user.uid)));
      // simpler: try to get doc directly
      import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js").then(fire =>{
        const { doc, getDoc } = fire;
      });
    } catch(e){
      // ignore
    }
    // quick display: show email or displayName
    profileBtn.disabled = false;
    profileBtn.textContent = user.email.split('@')[0];
    profileName.textContent = user.email.split('@')[0];
  } else {
    profileBtn.disabled = true;
    profileBtn.textContent = 'Profile';
    profileName.textContent = 'Guest';
  }
});

// toggle popup
profileBtn.addEventListener('click', () => {
  if (profilePopup.style.display === 'block') profilePopup.style.display = 'none';
  else profilePopup.style.display = 'block';
});

logoutBtn.addEventListener('click', async () => {
  const { signOut } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js");
  await signOut(auth);
  location.href = 'index.html';
});

// Bookings click
myBookingsBtn.addEventListener('click', () => {
  alert('Bookings: this will open your bookings (not implemented in MVP view).');
});

// Settings
document.getElementById('settingsBtn').addEventListener('click', () => {
  alert('Settings not available yet.');
});

// Search
document.getElementById('searchBtn').addEventListener('click', async () => {
  const term = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsEl = document.getElementById('searchResults');
  resultsEl.innerHTML = '<h3>Search results</h3>';
  const snap = await getDocs(collection(db, 'pgs'));
  let found = 0;
  snap.forEach(doc => {
    const d = doc.data();
    if (!d || !d.title) return;
    const hay = `${d.title} ${d.address}`.toLowerCase();
    if (term && !hay.includes(term)) return;
    if (d.locked) return; // skip locked
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.innerHTML = `
      <div class="meta">
        <strong>${d.title}</strong><div>${d.address}</div>
      </div>
      <div>
        <div>₹ ${d.price || 'N/A'}</div>
        <button onclick="window.location='details.html?slug=${encodeURIComponent(d.slug)}'">View</button>
      </div>
    `;
    resultsEl.appendChild(card);
    found++;
  });
  if (!found) resultsEl.innerHTML += '<p>No results found.</p>';
});

// Locate Near Me Buttons (fake permission)
document.getElementById('btnPG').addEventListener('click', () => {
  const allow = confirm('Allow live location');
  if (!allow) { location.href = 'index.html'; return; }
  location.href = 'pg-map.html';
});
document.getElementById('btnHostel').addEventListener('click', () => {
  const allow = confirm('Allow live location');
  if (!allow) { location.href = 'index.html'; return; }
  location.href = 'hostel-map.html';
});
