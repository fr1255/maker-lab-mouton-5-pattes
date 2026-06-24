// ==============================
// Utils - Mouton Vigilant
// ==============================

function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function afficherHeure(heure) {
  return heure.replace(":", "h");
}

function dateLocale(date) {
  return date.toISOString().slice(0, 10);
}

function texteDateFR(dateTexte) {
  const d = new Date(dateTexte + "T12:00:00");
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long"
  });
}

function dateDebutMois() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function heureDepassee(heure) {
  const maintenant = new Date();
  const [h, m] = heure.split(":").map(Number);

  const cible = new Date();
  cible.setHours(h, m, 0, 0);

  return maintenant >= cible;
}
