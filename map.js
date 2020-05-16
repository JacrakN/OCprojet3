class Map {
    constructor(idReservation, idConfirmation, idBoutonReserver, idBorderMap) {
        this.reservation = document.getElementById(idReservation);
        this.confirmation = document.getElementById(idConfirmation);
        this.boutonReserver = document.getElementById(idBoutonReserver);
        this.borderMap = document.getElementById(idBorderMap);
        this.initMap();
        this.loadApi();
        this.initReservationPart();
    }
    
    // Paramètres de la carte
    // & ajout de la carte à l'objet
    initMap() {
        this.map = L.map('map', {
            center: [45.743317, 4.855747],
            minZoom: 11,
            zoom: 15
        });
        
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a', 'b', 'c']
        }).addTo(this.map);
        
        this.reservation.style.display = "none";
        this.confirmation.style.display = "none";
    }

    // Charge l'API pour récupérer les données en JSON de toutes les stations
    loadApi() {
        $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=4c1788e0a107d1760817ce61cab17064e6880ce2").then((api) => {
            this.api = api;
            this.initMarkers();
        });
    }
    
    initMarkers() {
        let markerClusters = L.markerClusterGroup();
        let imageLink = "";
        
        for (let i = 0; i < this.api.length; i++) { // Choisit le bon icon en fonction de l'état de la station
            const station = this.api[i];
            
            if (station.status === "CLOSED") {
                imageLink = "pin-closed";
            } else if (station.available_bikes === 0) {
                imageLink = "pin-none";
            } else {
                imageLink = "pin-station";
            }
            const markerIcon = L.icon({
                iconUrl: `images/${imageLink}.png`,
                iconSize: [48, 48],
            });
            
            this.marker = L.marker( [station.position.lat, station.position.lng], {icon: markerIcon} ); // Détermine ce qu'est un marqueur par sa position sur la carte et l'icon choisit
            this.marker.bindPopup(station.address); // Fait apparaître une bulle au click avec l'adresse de la station
            this.previewStation(station);
            markerClusters.addLayer(this.marker); // créer des groupes de marqueurs 
        }
        this.map.addLayer(markerClusters); // Ajoute les groupes de marqueur à la carte
    }
    
    previewStation(station) {
        if (this.marker) {
            this.marker.addEventListener("click", () => {
                const infos = document.querySelector("#infos-station");
                    
                if (station.status === "OPEN") {
                    station.status = "OUVERTE";
                } else if (station.status === "CLOSED") {
                    station.status = "FERMÉE";
                }
                this.reservation.style.display = "block"; // Fait apparaître les détails des stations
                
                if (station.available_bikes === 0) { // Pas d'accès au bouton de réservation quand il n'y a pas de vélo dispo
                    this.boutonReserver.style.display = "none";
                } else {
                    this.boutonReserver.style.display = "block";
                }
                
                infos.innerHTML = `
                    <p>Nom : ${station.name}</p>
                    <p>Adresse : <span class="address">${station.address}</span></p>
                    <p>Est actuellement <span>${station.status}</span></p>
                    <p><span>${station.available_bike_stands}</span> places restantes</p>
                    <p><span>${station.available_bikes}</span> vélos disponibles</p>
                `;
            });
        }
    }
    
    initReservationPart() {
        this.boutonReserver.addEventListener("click", () => {
            this.confirmation.style.display = "block";
            this.borderMap.classList.add("adaptability");
        });
    }
}
