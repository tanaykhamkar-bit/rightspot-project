// details.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

function getQueryParam(name){
  const url = new URL(location.href);
  return url.searchParams.get(name);
}

let listingDoc = null;

async function loadListing() {
  const slug = getQueryParam('slug');
  if (!slug) { alert('No listing specified'); location.href='index.html'; return; }
  const q = query(collection(db, 'pgs'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) { alert('Listing not found'); location.href='index.html'; return; }
  const ddoc = snap.docs[0];
  listingDoc = { id: ddoc.id, ...ddoc.data() };

  document.getElementById('title').textContent = listingDoc.title;
  document.getElementById('address').textContent = listingDoc.address || '';
  document.getElementById('price').textContent = listingDoc.price ? `₹ ${listingDoc.price}` : '';
  document.getElementById('desc').innerText = listingDoc.description || 'No details provided.';

  if (listingDoc.locked) {
    const btn = document.getElementById('confirmBookingBtn');
    btn.disabled = true;
    btn.textContent = 'Booked / Locked';
  }
}

onAuthStateChanged(auth, user => {
  // nothing special here for display; Confirm Booking checks auth at press time
});

document.getElementById('confirmBookingBtn').addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) { alert('Please login to book'); window.location='login.html'; return; }
  if (!listingDoc) { alert('Listing not loaded'); return; }
  // create booking record with status 'requested'
  try {
    await addDoc(collection(db, 'bookings'), {
      listingId: listingDoc.id,
      listingTitle: listingDoc.title,
      userId: user.uid,
      userName: user.email ? user.email.split('@')[0] : 'user',
      status: 'requested',
      createdAt: serverTimestamp()
    });
    alert('Booking requested. Admin will review and lock if confirmed.');
    // optional: redirect
    window.location = 'index.html';
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

loadListing();
