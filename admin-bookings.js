// admin-bookings.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

async function loadBookings() {
  const snap = await getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')));
  const out = document.getElementById('bookingsList');
  out.innerHTML = '';
  snap.forEach(d => {
    const data = d.data();
    const row = document.createElement('div');
    row.className = 'listing-card';
    row.innerHTML = `
      <div class="meta"><strong>${data.userName}</strong><div>${data.userId}</div></div>
      <div>
        <div>${data.listingTitle}</div>
        <div style="margin-top:6px;">
          <button class="lockBtn">Lock</button>
        </div>
      </div>
    `;
    const lockBtn = row.querySelector('.lockBtn');
    lockBtn.addEventListener('click', async () => {
      // lock the listing in 'pgs'
      try {
        const listingRef = doc(db, 'pgs', data.listingId);
        await updateDoc(listingRef, { locked: true });
        // set booking status to confirmed
        const bookingRef = doc(db, 'bookings', d.id);
        await updateDoc(bookingRef, { status: 'confirmed' });
        alert('Listing locked and booking confirmed.');
        loadBookings();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
    out.appendChild(row);
  });
}

// simple admin gate (you must set isAdmin=true in Firestore users doc)
onAuthStateChanged(auth, async user => {
  if (!user) { alert('Please login'); location.href='login.html'; return; }
  // verify isAdmin
  const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js");
  const uRef = doc(db, 'users', user.uid);
  const uSnap = await getDoc(uRef);
  if (!uSnap.exists() || !uSnap.data().isAdmin) {
    alert('You are not an admin. Contact owner.');
    location.href = 'index.html';
    return;
  }
  loadBookings();
});
