// ==============================
// Prises - Mouton Vigilant V5
// Sécurité : une prise validée ne peut plus être annulée
// ==============================

function basculerPrise(id) {

  // 🔒 Si la prise est déjà enregistrée,
  // on empêche toute suppression ou annulation.
  if (prises[id]) {
    alert("🔒 Cette prise est déjà enregistrée et protégée.");
    return;
  }

  const med = medicaments.find((m) => m.id === id);
  if (!med) return;

  const element = document.getElementById("med-" + id);

  const h = heureActuelle();
  prises[id] = h;

  historique.unshift({
    date: aujourdHui,
    heure: h,
    id: med.id,
    nom: med.nom,
    etat: "pris"
  });

  if (element) {
    element.style.background = "#E8F5E9";
    element.style.border = "3px solid #4CAF50";

    setTimeout(() => {
      element.style.border = "";
      element.style.background = "";
    }, 1000);
  }

  sauvegarder();
  afficherMedicaments();
  afficherSuiviSiOuvert();
}
