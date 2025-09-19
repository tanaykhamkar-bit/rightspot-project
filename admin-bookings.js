// admin-bookings.js
import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// HTML element where bookings will appear
const bookingsList = document.getElementById("bookingsList");

// Admin auth check
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert("You must be logged in as admin to access this page.");
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists() || snap.data().isAdmin !== true) {
    alert("Access denied. Admins only.");
    window.location.href = "index.html";
    return;
  }

  // Load bookings once admin is confirmed
  loadBookings();
});

// Load all bookings
async function loadBookings() {
  bookingsList.innerHTML = "<p>Loading bookings...</p>";

  const snap = await getDocs(collection(db, "bookings"));
  bookingsList.innerHTML = "";

  if (snap.empty) {
    bookingsList.innerHTML = "<p>No bookings yet.</p>";
    return;
  }

  for (const docSnap of snap.docs) {
    const data = docSnap.data();

    // Find the PG/Hostel ad by listingId
    const adRef = doc(db, "pgs", data.listingId);
    const adSnap = await getDoc(adRef);

    let locked = false;
    if (adSnap.exists()) {
      locked = adSnap.data().locked === true;
    }

    const lockBtnText = locked ? "Unlock" : "Lock";

    const div = document.createElement("div");
    div.className = "booking-card";
    div.innerHTML = `
      <p><b>User:</b> ${data.userName} booked <b>${data.listingTitle}</b></p>
      <button onclick="toggleLock('${data.listingId}', ${locked})">${lockBtnText}</button>
    `;
    bookingsList.appendChild(div);
  }
}

// Toggle Lock / Unlock
window.toggleLock = async function (listingId, currentlyLocked) {
  try {
    const adRef = doc(db, "pgs", listingId);
    await updateDoc(adRef, { locked: !currentlyLocked });
    alert(`Ad is now ${currentlyLocked ? "Unlocked ✅" : "Locked 🔒"}`);
    loadBookings(); // refresh list after change
  } catch (err) {
    console.error(err);
    alert("Error updating lock status: " + err.message);
  }
};



