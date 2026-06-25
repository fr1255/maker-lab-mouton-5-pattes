// ==============================
// Prises - Mouton Vigilant V5
// ==============================

function basculerPrise(id) {
  const med = medicaments.find((m) => m.id === id);
  if (!med) return;

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
  }

  sauvegarder();
  afficherMedicaments();
  afficherSuiviSiOuvert();
}
