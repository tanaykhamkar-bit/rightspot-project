// admin-add.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const addMarkerBtn = document.getElementById("addMarkerBtn");
const coordBox = document.getElementById("coordBox");
const addDetailBtn = document.getElementById("addDetailBtn");
const detailBox = document.getElementById("detailBox");
const addPGFinalBtn = document.getElementById("addPGFinalBtn");
const msg = document.getElementById("message");
const pageTitle = document.getElementById("pageTitle");

// Type from query param (PG default)
const url = new URL(location.href);
const typeParam = url.searchParams.get("type") || "PG";
pageTitle.textContent = typeParam === "Hostel" ? "Add Hostel" : "Add PG";

// Toggle input visibility
addMarkerBtn.addEventListener("click", () => {
  coordBox.style.display = coordBox.style.display === "none" ? "block" : "none";
});
addDetailBtn.addEventListener("click", () => {
  detailBox.style.display = detailBox.style.display === "none" ? "block" : "none";
});

// Add listing
addPGFinalBtn.addEventListener("click", async () => {
  const lat = parseFloat(document.getElementById("lat").value);
  const lng = parseFloat(document.getElementById("lng").value);
  const title = document.getElementById("title").value.trim();
  const address = document.getElementById("address").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const slug = document.getElementById("slug").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!lat || !lng || !title || !slug) {
    alert("Please fill at least coordinates, title and slug");
    return;
  }

  try {
    await addDoc(collection(db, "pgs"), {
      title,
      type: typeParam, // PG or Hostel
      address,
      lat,
      lng,
      coordinates: { lat, lng }, // ✅ new structure
      price: isNaN(price) ? null : price,
      slug,
      description,
      locked: false, // ✅ for admin-bookings.js
      createdAt: serverTimestamp()
    });
    msg.textContent = "✅ Added successfully. Marker will appear on map.";
    // optional: clear fields
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// Admin access check
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("You must be logged in to access this page.");
    location.href = "login.html";
    return;
  }
  // Verify Firestore flag isAdmin
  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists() || snap.data().isAdmin !== true) {
      alert("Access denied. Admins only.");
      location.href = "index.html";
    }
  } catch (err) {
    console.error("Error checking admin:", err);
    alert("Error checking admin access");
    location.href = "index.html";
  }
});
