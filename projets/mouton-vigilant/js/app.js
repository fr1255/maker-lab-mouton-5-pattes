
// =====================
// MOUTON VIGILANT V5
// =====================

// Données par défaut
const medicamentsParDefaut = [];

const aujourdHui = new Date().toISOString().slice(0, 10);

const cleMedicaments = "mouton-vigilant-medicaments";
const cleJour = "mouton-vigilant-prises-" + aujourdHui;
const cleHistorique = "mouton-vigilant-historique";
const clePrenom = "mouton-vigilant-prenom";

let medicaments = JSON.parse(localStorage.getItem(cleMedicaments)) || medicamentsParDefaut;
let prises = JSON.parse(localStorage.getItem(cleJour)) || {};
let historique = JSON.parse(localStorage.getItem(cleHistorique)) || [];
let prenom = localStorage.getItem(clePrenom) || "";

// Éléments HTML
const zoneMedicaments = document.getElementById("listeMedicaments");
const zoneParametresMedicaments = document.getElementById("listeParametresMedicaments");
const zoneBonjour = document.getElementById("bonjour");
const zoneResumeJour = document.getElementById("resumeJour");
const zoneSuivi = document.getElementById("suiviTraitements");

const champPrenom = document.getElementById("prenom");
const boutonPrenom = document.getElementById("sauverPrenom");

const champMedNom = document.getElementById("medNom");
const champMedHeure = document.getElementById("medHeure");
const champMedNombre = document.getElementById("medNombre");
const champMedDate = document.getElementById("medDate");
const champMedDuree = document.getElementById("medDuree");   
const boutonAjouterMedicament = document.getElementById("ajouterMedicament");

function afficherPrenom() {
  if (zoneBonjour) {
    zoneBonjour.textContent = prenom ? "Bonjour " + prenom : "Bonjour";
  }

  if (champPrenom) {
    champPrenom.value = prenom;
  }
}

function initialiserParametres() {
  if (boutonPrenom) {
    boutonPrenom.addEventListener("click", () => {
      prenom = champPrenom.value.trim();
      sauvegarder();
      afficherPrenom();
      alert("Prénom enregistré.");
    });
  }
}

function demarrerApplication() {
  initialiserNavigation();
  initialiserMedicaments();
  initialiserSuivi();
  initialiserNotifications();
  initialiserParametres();

  afficherPrenom();
  afficherMedicaments();
  afficherParametresMedicaments();
  ouvrirDepuisNotification();
}

demarrerApplication();
