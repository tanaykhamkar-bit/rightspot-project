// admin-bookings.js
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const bookingsList = document.getElementById("bookingsList");

// Load all bookings
async function loadBookings() {
  bookingsList.innerHTML = "<p>Loading bookings...</p>";

  const snap = await getDocs(collection(db, "bookings"));
  bookingsList.innerHTML = "";

  for (const docSnap of snap.docs) {
    const data = docSnap.data();

    // Find the PG/Hostel ad
    const adRef = doc(db, "pgs", data.adId); // 🔹 for now only PGs
    const adSnap = await getDoc(adRef);

    let locked = false;
    if (adSnap.exists()) {
      locked = adSnap.data().locked === true;
    }

    const lockBtnText = locked ? "Unlock" : "Lock";

    const div = document.createElement("div");
    div.className = "booking-card";
    div.innerHTML = `
      <p><b>User:</b> ${data.username} booked <b>${data.adName}</b></p>
      <button onclick="toggleLock('${data.adId}', ${locked})">${lockBtnText}</button>
    `;
    bookingsList.appendChild(div);
  }
}

// Toggle Lock / Unlock
window.toggleLock = async function (adId, currentlyLocked) {
  try {
    const adRef = doc(db, "pgs", adId);
    await updateDoc(adRef, { locked: !currentlyLocked });
    alert(`Ad is now ${currentlyLocked ? "Unlocked ✅" : "Locked 🔒"}`);
    loadBookings(); // refresh list
  } catch (err) {
    console.error(err);
    alert("Error updating lock status: " + err.message);
  }
};

// Initial load
loadBookings();
