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

function afficherMedicaments() {
  if (!zoneMedicaments) return;

  zoneMedicaments.innerHTML = "";

  medicaments.forEach((med) => {
    const dejaPris = prises[med.id];

    const ligne = document.createElement("div");
    ligne.className = "medicament";
    ligne.id = "med-" + med.id;

    ligne.innerHTML = `
      <strong>${afficherHeure(med.heure)}</strong>

      <span>
        ${med.nom}
        <small>${med.nombre || ""}</small>
        ${med.note ? `<small>${med.note}</small>` : ""}
        ${dejaPris ? `<em>✅ Pris à ${dejaPris}</em>` : `<em>○ À prendre</em>`}
      </span>

      <div class="actions-med">
        <button class="${dejaPris ? "pris" : ""}">
          ${dejaPris ? "✓ Pris" : "○ Pris"}
        </button>
      </div>
    `;

    ligne.querySelector("button").addEventListener("click", () => {
      basculerPrise(med.id);
    });

    zoneMedicaments.appendChild(ligne);
  });

  afficherResumeJour();
}
