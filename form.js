class Form {
    constructor(idValiderButton, idAnnulerClicker, idNomInput, idPrenomInput, idTimeLeft, idTimerPart) {
        this.validerButton = document.getElementById(idValiderButton);
        this.annulerClicker = document.getElementById(idAnnulerClicker);
        this.nomInput = document.getElementById(idNomInput);
        this.prenomInput = document.getElementById(idPrenomInput);
        this.timeLeft = document.getElementById(idTimeLeft);
        this.timerPart = document.getElementById(idTimerPart);
        this.initEvent();
    }
    
    initEvent() {
        this.timeLeft.style.display = "none";
        let that = this;
        
        if ((localStorage.getItem("nom"))&&(localStorage.getItem("prenom"))) {
            let nameSave = localStorage.getItem("nom");
            let fnameSave = localStorage.getItem("prenom");
            
            this.nomInput.value = nameSave;
            this.prenomInput.value = fnameSave;
        }
        if ((sessionStorage.getItem("station"))&&(sessionStorage.getItem("timer"))) {
            this.timeLeft.style.display = "block";
            this.timerOn((sessionStorage.getItem("station")), (sessionStorage.getItem("timer")));
        }
        
        // Vérification de l'accès au bouton valider 
        this.nomInput.addEventListener("input", function() {
            sign.clear();
            that.validerButton.disabled = true;
        });
        
        this.prenomInput.addEventListener("input", function() {
            sign.clear();
            that.validerButton.disabled = true;
        });
        
        this.annulerClicker.addEventListener("click", function(e) {
            e.preventDefault();
            that.clearTheInput(); // Efface le contenu des input
            sign.clear(); // Efface la signature
            
            map.confirmation.style.display = "none"; // Retire le formulaire de confirmation
            map.borderMap.classList.remove("adaptability"); // Ré-adapte la taille de la map
            that.validerButton.disabled = true; // Repasse le bouton valider en inaccèssible 
        });
        
        this.validerButton.addEventListener("click", function() {
            const adresseElt = document.getElementsByClassName("address")[0].textContent; // Récupération de l'adresse afficher dans les détails de la station
            
            localStorage.setItem("nom", that.nomInput.value);
            localStorage.setItem("prenom", that.prenomInput.value);
            
            clearInterval(that.countdownID);
            that.timerOn(adresseElt, 1200); // Cela enclanche le timer, en définissant l'adresse et le temps imparti qui sera affiché
            that.timeLeft.style.display = "block"; // Affiche la barre textuelle qui confirme la réservation
            map.confirmation.style.display = "none"; // Fait disparaître le formulaire de confirmation
            
            sign.clear();
            map.borderMap.classList.remove("adaptability");
            that.validerButton.disabled = true;
        });
    }
    
    timerOn(addressStation, countdownSetting) {
        this.addressStation = addressStation;
        this.time = countdownSetting;
        
        this.countdownID = setInterval(() => {
            const {minutes, secondes} = this.minLeft(this.time); // Détermine ce que sont minutes et secondes, puis combien dans le compte à rebours
            // Permet de conserver l'adresse de station réserver et pour combien de temps. Sur cette session.
            sessionStorage.setItem("station", this.addressStation);
            sessionStorage.setItem("timer", this.time);
            
            this.timeLeft.innerHTML = `Voilà ! Le vélo est bien réservé à <span>${this.addressStation}</span> pour les <span>${minutes}:${secondes} prochaines minutes`; // texte afficher dans la barre textuelle qui confirme la réservation avec adresse et compte à rebours
            this.timeCountdown(); // Retire -1 au compte à rebours
            
            if (this.time === -1) {
                clearInterval(this.countdownID); // Arrête le timer quand celui ci arrive à 0
                this.timeLeft.innerHTML = `Ah ! Semblerait que la réservation en station <span>${this.addressStation}</span> soit expiré... on espère que vous avez apprécié.` // Texte afficher quand la réservation est expiré
                sessionStorage.clear("station", "timer"); // On supprimer toutes traces du timer de la session quand celui ci est arrivé au bout
            }
        }, 1000) // Détermine tout les combien de temps doit être décrementer le temps imparti (chaques secondes)
    }
    
    accessBtn() { // Vérifie sous quelles conditions le button valider doit être accèssible. S'il n'y a pas de nom, prénom et signature ajouté, ce dernier n'est pas cliquable.
        console.log(sign.pixel);
        if (this.nomInput.value == "") {
            this.validerButton.disabled = true;
        } else if (this.prenomInput.value == "") {
            this.validerButton.disabled = true;
        } else if (sign.pixel < 5) {
            this.validerButton.disabled = true;
        } else {
            this.validerButton.disabled = false;
        }
    }
    
    timeCountdown() { // décremente un temps déterminer de 1
        this.time = this.time - 1;
    }
        
    minLeft() { // Détermine comment s'affichent les minutes et les secondes
        let minutes = Math.floor(this.time / 60); // 1200/60 = 20 minutes
        let secondes = this.time - minutes * 60; // 1200 - (20*60) = 1
        
        if (secondes < 10) {
            secondes = `0${secondes}`;
        } 
        if (minutes < 10) {
            minutes = `0${minutes}`;
        } return {minutes, secondes};
    }
    
    clearTheInput() {
        this.nomInput.value = "";
        this.prenomInput.value = "";
    }
}