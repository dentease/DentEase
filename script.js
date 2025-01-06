// Aggiungi qui il codice per la geolocalizzazione e l'integrazione con le API di Google
const searchButton = document.getElementById("searchButton");
const backButton = document.getElementById("backButton");
const websiteButton = document.getElementById("websiteButton");
const dentistInfo = document.getElementById("dentistInfo");
const dentistsList = document.getElementById("dentistsList");
const logo = document.querySelector(".logo");

searchButton.addEventListener("click", function() {
    // Mostra il logo e chiama la funzione per ottenere i dentisti
    dentistsList.innerHTML = "<p>Caricamento in corso...</p>";
    dentistsList.style.display = "block";
    dentistInfo.style.display = "none";
    getNearbyDentists();
});

backButton.addEventListener("click", function() {
    dentistInfo.style.display = "none";
    dentistsList.style.display = "block";
});

websiteButton.addEventListener("click", function() {
    // Logica per aprire il sito web del dentista
});

// Funzione per ottenere i dentisti dal API di Google Places
async function getNearbyDentists() {
    if (!navigator.geolocation) {
        alert("La geolocalizzazione non è supportata dal tuo browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = ""; // Sostituisci con la tua API Key di Google
        const radius = 5000; // Raggio in metri
        const type = "dentist";

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error_message) {
                throw new Error(data.error_message);
            }

            if (data.results && data.results.length > 0) {
                dentistsList.innerHTML = "";

                // Aggiungi il logo sopra la lista
                const logoElement = document.createElement("h1");
                logoElement.className = "logo";
                logoElement.textContent = "DentEase - Find Your Dentist!";
                dentistsList.appendChild(logoElement);

                data.results.forEach(dentist => {
                    const div = document.createElement("div");
                    div.className = "dentist-item";
                    div.innerHTML = `<strong>${dentist.name}</strong>`;
                    div.style.margin = "10px 0";
                    div.style.padding = "10px";
                    div.style.border = "1px solid #ddd";
                    div.style.borderRadius = "5px";
                    div.style.backgroundColor = "#f9f9f9";
                    div.style.cursor = "pointer";
                    div.addEventListener("click", () => {
                        showDentistInfo(dentist);
                    });
                    dentistsList.appendChild(div);
                });

                dentistsList.style.display = "block";
            } else {
                dentistsList.innerHTML = "<p>Nessun dentista trovato.</p>";
                dentistsList.style.display = "block";
            }
        } catch (error) {
            console.error("Errore durante la chiamata all'API di Google Places:", error);
            alert(`Errore API: ${error.message}`);
        }
    }, (error) => {
        console.error("Errore nella geolocalizzazione:", error);
        alert("Errore nella geolocalizzazione. Verifica le autorizzazioni.");
    });
}

function showDentistInfo(dentist) {
    dentistInfo.style.display = "block";
    dentistsList.style.display = "none";

    const dentistName = document.getElementById("dentistName");
    const dentistAddress = document.getElementById("dentistAddress");
    const googleRating = document.getElementById("googleRating");
    const map = document.getElementById("map");

    dentistName.textContent = `Nome: ${dentist.name}`;
    dentistAddress.textContent = `Indirizzo: ${dentist.vicinity}`;
    googleRating.textContent = `Rating Google: ${dentist.rating || "N/A"}`;

    const lat = dentist.geometry.location.lat;
    const lng = dentist.geometry.location.lng;

    const mapFrame = document.createElement("iframe");
    mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDWJb7ndaGTMoVqT3FuVIhE_XbVgTxOMwE&q=${lat},${lng}`;
    mapFrame.style.width = "100%";
    mapFrame.style.height = "300px";
    mapFrame.style.border = "0";
    map.innerHTML = "";
    map.appendChild(mapFrame);

    websiteButton.onclick = () => {
        if (dentist.website) {
            window.open(dentist.website, "_blank");
        } else {
            alert("Nessun sito web disponibile per questo dentista.");
        }
    };
}
