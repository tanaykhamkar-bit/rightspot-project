// map.js
import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export async function initMap(type = 'PG') {
  // create map
  const map = L.map('map').setView([19.24064730821389, 73.13233330849506], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // permanent red-dot (fake live location)
  L.circleMarker([19.24064730821389, 73.13233330849506], {
    radius: 8, color: '#e63946', fillColor:'#e63946', fillOpacity:1
  }).addTo(map).bindPopup('You (approx.)');

  // fetch listings of given type
  const q = query(collection(db, 'pgs'), where('type', '==', type));
  const snap = await getDocs(q);
  snap.forEach(doc => {
    const d = doc.data();
    if (!d) return;
    const marker = L.marker([d.lat, d.lng]).addTo(map);
    const lockedLabel = d.locked ? '<div style="color:red;font-weight:700">LOCKED</div>' : '';
    marker.bindPopup(`<b>${d.title}</b><br>${d.address || ''}<br>₹ ${d.price || 'N/A'}<br>${lockedLabel}<br><button onclick="window.location='details.html?slug=${encodeURIComponent(d.slug)}'">View</button>`);
    // clicking marker popup View will navigate to details page by slug
  });
}
