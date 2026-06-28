// secours.js — Mouton Vigilant
// Prépare les rappels de secours localement dans l'iPhone

const CLE_SECOURS_MOUTON = "mouton_secours_local_v1";

function lireMedicamentsPourSecours() {
  try {
    return JSON.parse(localStorage.getItem("medicaments") || "[]");
  } catch (e) {
    console.error("Erreur lecture médicaments secours :", e);
    return [];
  }
}

function genererPlanningSecours(nombreDeJours = 7) {
  const medicaments = lireMedicamentsPourSecours();
  const planning = [];

  const maintenant = new Date();

  for (let jour = 0; jour < nombreDeJours; jour++) {
    const date = new Date(maintenant);
    date.setDate(maintenant.getDate() + jour);

    medicaments.forEach((med) => {
      if (!med.nom || !med.heure) return;

      const [heures, minutes] = med.heure.split(":").map(Number);

      const rappel = new Date(date);
      rappel.setHours(heures, minutes, 0, 0);

      planning.push({
        id: `${med.nom}-${rappel.toISOString()}`,
        nom: med.nom,
        dose: med.dose || "",
        heure: med.heure,
        date: rappel.toISOString(),
        statut: "préparé"
      });
    });
  }

  localStorage.setItem(CLE_SECOURS_MOUTON, JSON.stringify(planning));

  return planning;
}

function afficherSecoursLocal() {
  const zone = document.getElementById("zoneSecoursLocal");
  if (!zone) return;

  const planning = genererPlanningSecours(7);

  zone.innerHTML = `
    <div class="card">
      <h3>Secours local préparé</h3>
      <p>
        ${planning.length} rappels sont préparés dans ce téléphone
        pour les 7 prochains jours.
      </p>
      <p class="petit-texte">
        Cette étape prépare les données. Les notifications locales seront ajoutées ensuite.
      </p>
    </div>
  `;
}

function initialiserSecoursLocal() {
  const bouton = document.getElementById("btnSecoursLocal");
  if (!bouton) return;

  bouton.addEventListener("click", afficherSecoursLocal);
}

document.addEventListener("DOMContentLoaded", initialiserSecoursLocal);
