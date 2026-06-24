// ==============================
// Médicaments - Mouton Vigilant
// ==============================

function afficherResumeJour() {
  if (!zoneResumeJour) return;

  const total = medicaments.length;
  const pris = Object.keys(prises).length;
  const reste = total - pris;

  zoneResumeJour.textContent =
    total + " médicament(s) aujourd'hui — " +
    pris + " pris, " +
    reste + " à prendre";
}
