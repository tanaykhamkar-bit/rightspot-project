// map.js
import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export async function initMap(type = "PG") {
  // Create the map centered at fixed demo location
  const map = L.map("map").setView([19.24064730821389, 73.13233330849506], 13);

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Permanent red-dot (fake live location for demo)
  L.circleMarker([19.24064730821389, 73.13233330849506], {
    radius: 8,
    color: "#e63946",
    fillColor: "#e63946",
    fillOpacity: 1,
  })
    .addTo(map)
    .bindPopup("You (approx.)");

  // Fetch listings of given type
  const q = query(collection(db, "pgs"), where("type", "==", type));
  const snap = await getDocs(q);

  snap.forEach((docSnap) => {
    const d = docSnap.data();
    if (!d) return;

    // Fallback for coordinates: supports {lat, lng} or nested {coordinates:{lat,lng}}
    const lat = d.coordinates?.lat ?? d.lat;
    const lng = d.coordinates?.lng ?? d.lng;
    if (lat == null || lng == null) return; // skip if missing coords

    const marker = L.marker([lat, lng]).addTo(map);

    // Show locked label if needed
    const lockedLabel = d.locked
      ? '<div style="color:red;font-weight:700">LOCKED</div>'
      : "";

    // Ensure we always have a title
    const name = d.title || d.name || "Untitled Listing";

    // Use slug (used in details.js) or fallback to Firestore doc id
    const slug = d.slug || docSnap.id;

    marker.bindPopup(`
      <b>${name}</b><br>
      ${d.address || ""}<br>
      ₹ ${d.price || "N/A"}<br>
      ${lockedLabel}<br>
      <button onclick="window.location='details.html?slug=${encodeURIComponent(
        slug
      )}'">View</button>
    `);
  });
}
