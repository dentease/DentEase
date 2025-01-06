// Variabili globali
const searchButton = document.getElementById("searchButton");
const dentistListDiv = document.getElementById("dentistList");
const dentistDetailsDiv = document.getElementById("dentistDetails");
const backButton = document.getElementById("backButton");
const websiteButton = document.getElementById("websiteButton");
let map;

// Funzione per avviare la ricerca dei dentisti
searchButton.addEventListener("click", function() {
    searchButton.style.display = 'none';  // Nascondi il bottone di ricerca
    dentistListDiv.style.display = 'block';  // Mostra la lista dei dentisti

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchDentists, showError);
    } else {
        alert("La geolocalizzazione non è supportata dal tuo browser.");
    }
});

// Funzione per ottenere i dentisti tramite API di Google
function fetchDentists(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const radius = 5000; // 5 km

    // URL dell'API di Google Places
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=dentist&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const dentists = data.results;
                let listItems = '';
                dentists.forEach(dentist => {
                    listItems += `
                        <li onclick="showDentistDetails(${dentist.geometry.location.lat}, ${dentist.geometry.location.lng}, '${dentist.name}', '${dentist.vicinity}', '${dentist.rating}', '${dentist.website || ''}')">
                            <h3>${dentist.name}</h3>
                            <p>${dentist.vicinity}</p>
                            <p>Rating: ${dentist.rating || 'N/A'}</p>
                        </li>
                    `;
                });
                dentistListDiv.innerHTML = `<ul>${listItems}</ul>`;
            } else {
                dentistListDiv.innerHTML = "<p>Nessun dentista trovato nei dintorni.</p>";
            }
        })
        .catch(err => {
            alert("Errore nel caricamento dei dentisti.");
            console.log(err);
        });
}

// Funzione per gestire gli errori di geolocalizzazione
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Permesso di geolocalizzazione negato.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Posizione non disponibile.");
            break;
        case error.TIMEOUT:
            alert("Timeout nella geolocalizzazione.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Errore sconosciuto.");
            break;
    }
}

// Funzione per mostrare i dettagli del dentista
function showDentistDetails(lat, lng, name, address, rating, website) {
    dentistListDiv.style.display = 'none';
    dentistDetailsDiv.style.display = 'block';

    document.getElementById("dentistName").textContent = name;
    document.getElementById("dentistAddress").textContent = address;
    document.getElementById("dentistRating").textContent = `Rating: ${rating || 'N/A'}`;

    if (website) {
        websiteButton.style.display = 'inline-block';
        websiteButton.onclick = function() {
            window.open(website, '_blank');
        };
    } else {
        websiteButton.style.display = 'none';
    }

    // Mostrare la mappa con la posizione del dentista
    const location = { lat: lat, lng: lng };
    if (!map) {
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 14,
            center: location
        });
    }
    new google.maps.Marker({
        position: location,
        map: map,
        title: name
    });
}

// Torna alla schermata principale
backButton.addEventListener("click", function() {
    dentistListDiv.style.display = 'none';
    dentistDetailsDiv.style.display = 'none';
    searchButton.style.display = 'inline-block';  // Mostra il bottone di ricerca
});
