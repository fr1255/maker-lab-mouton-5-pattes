// ==============================
// Prises - Mouton Vigilant V5
// ==============================

function basculerPrise(id) {
  const med = medicaments.find((m) => m.id === id);
  if (!med) return;

  const element = document.getElementById("med-" + id);

  if (prises[id]) {
    delete prises[id];

    historique = historique.filter(
      (item) => !(item.date === aujourdHui && item.id === id)
    );
  } else {
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
  }

  sauvegarder();
  afficherMedicaments();
  afficherSuiviSiOuvert();
}
