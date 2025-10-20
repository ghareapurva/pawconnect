document.addEventListener("DOMContentLoaded", () => {
    const vetDirectory = document.querySelector(".vet-directory");
    const searchInput = document.querySelector("#vetSearch");
    const specializationFilter = document.querySelector("#specializationFilter");

    const vetMarkers = [];
    let userLocation = null;
    let userMarker = null;

    // Fetch vets from server
    fetch("http://localhost:3000/vets") // replace with your server endpoint
        .then(res => res.json())
        .then(vets => {
            vets.forEach(vet => {
                const card = document.createElement("article");
                card.classList.add("vet-card");
                card.dataset.lat = vet.lat || "20.5937"; // default if missing
                card.dataset.lng = vet.lng || "78.9629"; // default if missing
                card.dataset.specialization = vet.specialization || "Small Animals";

                card.innerHTML = `
                    <h3>${vet.name}</h3>
                    <p><strong>Specialization:</strong> ${vet.specialization}</p>
                    <p><strong>Location:</strong> ${vet.location}</p>
                    <p><strong>Contact:</strong> ${vet.phone_number}</p>
                    <p><strong>Distance:</strong> <span class="distance">-</span></p>
                    <button>Book Appointment</button>
                `;

                vetDirectory.appendChild(card);

                // Add Book button listener
                card.querySelector("button").addEventListener("click", () => {
                    alert("Appointment booking feature coming soon 🐾");
                });

                // Add marker on map
                const lat = parseFloat(card.dataset.lat);
                const lng = parseFloat(card.dataset.lng);

                const vetIcon = L.divIcon({
                    html: '<div style="background-color: #4e89ae; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">V</div>',
                    className: 'vet-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                const marker = L.marker([lat, lng], { icon: vetIcon })
                    .addTo(map)
                    .bindPopup(`
                        <strong>${vet.name}</strong><br>
                        ${vet.specialization}<br>
                        ${vet.location}
                    `);

                marker.cardElement = card;
                vetMarkers.push(marker);

                // Click card to open marker popup
                card.addEventListener("click", () => {
                    map.setView([lat, lng], 13);
                    marker.openPopup();
                });
            });
        })
        .then(() => {
            // Apply filter after cards are loaded
            filterVets();
        })
        .catch(err => console.error("Error fetching vets:", err));

    // Filter function
    function filterVets() {
        const query = searchInput.value.toLowerCase();
        const selectedSpecialization = specializationFilter.value.toLowerCase();
        const vetCards = document.querySelectorAll(".vet-card");

        vetCards.forEach(card => {
            const text = card.innerText.toLowerCase();
            const specialization = card.querySelector("p strong").nextSibling.textContent.trim().toLowerCase();

            const matchesSearch = text.includes(query);
            const matchesSpecialization =
                selectedSpecialization === "all" || specialization.includes(selectedSpecialization);

            card.style.display = (matchesSearch && matchesSpecialization) ? "block" : "none";

            // Show/hide corresponding marker
            vetMarkers.forEach(marker => {
                if (marker.cardElement === card) {
                    if (card.style.display === "block") {
                        if (!map.hasLayer(marker)) marker.addTo(map);
                    } else {
                        if (map.hasLayer(marker)) map.removeLayer(marker);
                    }
                }
            });
        });
    }

    // Input listeners
    searchInput.addEventListener("input", filterVets);
    specializationFilter.addEventListener("change", filterVets);

    // Map initialization
    const map = L.map('vetMap').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Find Vets Nearby button
    document.getElementById('findVetsNearby').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                userLocation = { lat, lng };
                map.setView([lat, lng], 12);

                if (userMarker) map.removeLayer(userMarker);

                const userIcon = L.divIcon({
                    html: '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">Y</div>',
                    className: 'user-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup('Your Location').openPopup();

                // Calculate distance
                vetMarkers.forEach(marker => {
                    const d = calculateDistance(lat, lng, marker.getLatLng().lat, marker.getLatLng().lng);
                    marker.cardElement.querySelector(".distance").textContent = `${d.toFixed(1)} km`;
                    marker.cardElement.dataset.distance = d;
                });

                // Sort by distance
                const vetCards = Array.from(document.querySelectorAll(".vet-card"));
                vetCards.sort((a, b) => parseFloat(a.dataset.distance || Infinity) - parseFloat(b.dataset.distance || Infinity))
                    .forEach(c => vetDirectory.appendChild(c));
            }, err => alert("Unable to get your location. Please allow location access."));
        } else {
            alert("Geolocation not supported by your browser.");
        }
    });

    // Reset view button
    document.getElementById('resetView').addEventListener('click', () => {
        map.setView([20.5937, 78.9629], 5);
        if (userMarker) map.removeLayer(userMarker);
        userMarker = null;
        userLocation = null;

        document.querySelectorAll(".vet-card .distance").forEach(el => el.textContent = "-");
    });

    // Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat/2)**2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
});

const searchInput = document.querySelector("#vetSearch");
const specializationFilter = document.querySelector("#specializationFilter");
const vetDirectory = document.querySelector(".vet-directory");

let vetCards = [];

// Function to fetch and render vets
async function fetchVets(query = "") {
    try {
        const res = await fetch(`http://localhost:3000/hospitals/search?q=${encodeURIComponent(query)}`);
        const vets = await res.json();

        vetDirectory.innerHTML = "";
        vetCards = [];

        vets.forEach(vet => {
            const card = document.createElement("article");
            card.classList.add("vet-card");
            card.dataset.lat = vet.latitude;
            card.dataset.lng = vet.longitude;
            card.dataset.specialization = vet.specialization;

            card.innerHTML = `
                <h3>${vet.name}</h3>
                <p><strong>Specialization:</strong> ${vet.specialization}</p>
                <p><strong>Location:</strong> ${vet.location}</p>
                <p><strong>Contact:</strong> ${vet.contact}</p>
                <p><strong>Distance:</strong> <span class="distance">-</span></p>
                <button>Book Appointment</button>
            `;

            vetDirectory.appendChild(card);
            vetCards.push(card);

            // Booking placeholder
            card.querySelector("button").addEventListener("click", () => {
                alert("Appointment booking feature coming soon 🐾");
            });
        });

        filterVets(); // apply specialization filter if selected
    } catch (err) {
        console.error("Error fetching vets:", err);
    }
}

// Function to filter vets locally (specialization dropdown)
function filterVets() {
    const specialization = specializationFilter.value.toLowerCase();
    vetCards.forEach(card => {
        const cardSpec = card.dataset.specialization.toLowerCase();
        card.style.display = specialization === "all" || cardSpec === specialization ? "block" : "none";
    });
}

// Event listeners
searchInput.addEventListener("input", () => fetchVets(searchInput.value));
specializationFilter.addEventListener("change", filterVets);

// Initial fetch
fetchVets();

