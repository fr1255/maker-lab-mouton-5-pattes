// ==============================
// Suivi - Mouton Vigilant
// ==============================

function calculerSuiviMedicament(med) {
  const debut = med.date
    ? new Date(med.date + "T12:00:00")
    : dateDebutMois();

  const aujourd = new Date();
  const datesPrevues = [];

  let d = new Date(debut);

  while (d <= aujourd) {
    const dateTexte = dateLocale(d);

    if (dateTexte !== aujourdHui || heureDepassee(med.heure)) {
      datesPrevues.push(dateTexte);
    }

    d.setDate(d.getDate() + 1);
  }

  const prisesMed = historique.filter((item) => item.id === med.id);
  const datesPrises = prisesMed.map((item) => item.date);
  const oublisDates = datesPrevues.filter((date) => !datesPrises.includes(date));

  const prevues = datesPrevues.length;
  const realisees = datesPrevues.filter((date) => datesPrises.includes(date)).length;
  const oublis = oublisDates.length;
  const pourcentage = prevues > 0 ? Math.round((realisees / prevues) * 100) : 100;

  const dernierOubli = oublisDates.length > 0
    ? oublisDates[oublisDates.length - 1]
    : null;

  return { prevues, realisees, oublis, pourcentage, dernierOubli };
}

function niveauSuivi(pourcentage) {
  if (pourcentage >= 95) return { icone: "🟢", texte: "Excellent" };
  if (pourcentage >= 90) return { icone: "🟢", texte: "Très bon" };
  if (pourcentage >= 80) return { icone: "🟡", texte: "Bon suivi" };
  if (pourcentage >= 60) return { icone: "🟠", texte: "Quelques oublis" };
  return { icone: "🔴", texte: "Suivi à renforcer" };
}
