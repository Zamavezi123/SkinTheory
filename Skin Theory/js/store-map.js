// ========================================
// SKIN THEORY - INTERACTIVE STORE MAP
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // Find the map container on the page.
    const mapElement = document.getElementById("store-map");

    // Stop if the current page does not contain the map.
    if (!mapElement) {
        return;
    }

    // Check whether Leaflet has loaded successfully.
    if (typeof L === "undefined") {
        console.error(
            "Leaflet could not be loaded. Please check your internet connection."
        );
        return;
    }

    // ========================================
    // FOUR SKIN THEORY STORE LOCATIONS
    // ========================================

    const stores = [

        {
            name: "Location 1: London Flagship (UK)",
            storeName: "Skin Theory - Marylebone",
            address: "14 Chiltern Street, London, W1U 7QG, United Kingdom",
            phone: "+44 20 7946 0821",
            hours: "Mon-Sat, 10:00-17:00",
            latitude: 51.5217,
            longitude: -0.1530
        },

        {
            name: "Location 2: Cape Town (South Africa)",
            storeName: "Skin Theory - V&A Waterfront",
            address: "Shop 12 Victoria Wharf, Cape Town, 8001, South Africa",
            phone: "+27 21 418 3392",
            hours: "Mon-Sun, 9:00-16:00",
            latitude: -33.9036,
            longitude: 18.4207
        },

        {
            name: "Location 3: New York (USA)",
            storeName: "Skin Theory - Soho",
            address: "121 Spring Street, New York, NY 10012, United States",
            phone: "+1 212 666 0148",
            hours: "Mon-Sun, 10:00-17:00",
            latitude: 40.7228,
            longitude: -73.9990
        },

        {
            name: "Location 4: Accra (Ghana)",
            storeName: "Skin Theory - Airport City",
            address: "Liberation Road, Accra, Ghana",
            phone: "+233 30 274 1122",
            hours: "Mon-Sat, 9:00-17:00",
            latitude: 5.6052,
            longitude: -0.1710
        }

    ];

    // ========================================
    // CREATE THE MAP
    // ========================================

    const map = L.map("store-map");

    // Add OpenStreetMap tiles.
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">' +
                'OpenStreetMap</a> contributors',

            maxZoom: 19
        }
    ).addTo(map);

    // ========================================
    // ADD THE STORE MARKERS
    // ========================================

    const markers = [];

    stores.forEach(function (store) {

        // Create a marker for each store.
        const marker = L.marker([
            store.latitude,
            store.longitude
        ]).addTo(map);

        // Create the information displayed when a marker is clicked.
        const popupContent = `
            <div class="store-popup">

                <h3>${store.name}</h3>

                <p>
                    <strong>${store.storeName}</strong>
                </p>

                <p>
                    <strong>Address:</strong><br>
                    ${store.address}
                </p>

                <p>
                    <strong>Phone:</strong><br>
                    ${store.phone}
                </p>

                <p>
                    <strong>Opening Hours:</strong><br>
                    ${store.hours}
                </p>

            </div>
        `;

        // Attach the popup to the marker.
        marker.bindPopup(popupContent);

        // Save the marker so the map can display all four locations.
        markers.push(marker);

    });

    // ========================================
    // DISPLAY ALL FOUR LOCATIONS
    // ========================================

    const storeBounds = L.featureGroup(markers).getBounds();

    map.fitBounds(storeBounds, {
        padding: [40, 40]
    });

    // Make sure the map displays correctly after loading.
    setTimeout(function () {
        map.invalidateSize();
    }, 200);

});