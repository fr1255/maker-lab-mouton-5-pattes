// ==============================
// Médicaments - Mouton Vigilant V6
// ==============================

const URL_SERVEUR_PRIS =
  "https://mouton-vigilant-server.fr12andco55.workers.dev/pris";

function creerIdMedicament(nom) {
  let id = String(nom || "medicament")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!id) id = "medicament";

  let idFinal = id;
  let compteur = 2;

  while (medicaments.some((m) => m.id === idFinal)) {
    idFinal = id + "-" + compteur;
    compteur++;
  }

  return idFinal;
}

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

async function envoyerPriseAuServeur(med) {
  try {
    if (!med || !med.nom) return;

    const userId = obtenirUserId();

    const reponse = await fetch(URL_SERVEUR_PRIS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        medicament: med.nom
      })
    });

    const resultat = await reponse.json();
    console.log("🐑 Prise envoyée au serveur :", resultat);

  } catch (e) {
    console.error("Erreur envoi prise serveur :", e);
  }
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
      const etaitPris = !!prises[med.id];

      basculerPrise(med.id);

      const estPrisMaintenant = !etaitPris;

      if (estPrisMaintenant) {
        envoyerPriseAuServeur(med);
      }
    });

    zoneMedicaments.appendChild(ligne);
  });

  afficherResumeJour();
}

function afficherParametresMedicaments() {
  if (!zoneParametresMedicaments) return;

  zoneParametresMedicaments.innerHTML = "";

  medicaments.forEach((med) => {
    const ligne = document.createElement("div");
    ligne.className = "medicament";

    ligne.innerHTML = `
      <strong>${afficherHeure(med.heure)}</strong>

      <span>
        ${med.nom}
        <small>${med.nombre || ""}</small>
        ${med.date ? `<small>Depuis le ${med.date}</small>` : ""}
        ${med.note ? `<small>${med.note}</small>` : ""}
        <small>ID notification : ${med.id}</small>
      </span>

      <div class="actions-med">
        <button class="supprimer">🗑️ Supprimer</button>
      </div>
    `;

    ligne.querySelector(".supprimer").addEventListener("click", () => {
      if (confirm("Supprimer ce médicament ?")) {
        medicaments = medicaments.filter((m) => m.id !== med.id);
        delete prises[med.id];
        historique = historique.filter((item) => item.id !== med.id);

        sauvegarder();
        afficherMedicaments();
        afficherParametresMedicaments();
        afficherSuiviSiOuvert();
      }
    });

    zoneParametresMedicaments.appendChild(ligne);
  });
}

function initialiserMedicaments() {
  if (!boutonAjouterMedicament) return;

  boutonAjouterMedicament.addEventListener("click", () => {
    const nom = champMedNom.value.trim();
    const heure = champMedHeure.value;
    const nombre = champMedNombre.value.trim();
    const date = champMedDate.value;

    if (!nom || !heure) {
      alert("Il faut au minimum le nom du médicament et l'heure.");
      return;
    }

    medicaments.push({
      id: creerIdMedicament(nom),
      heure,
      nom,
      nombre: nombre || "1 prise",
      date,
      note: ""
    });

    champMedNom.value = "";
    champMedHeure.value = "";
    champMedNombre.value = "";
    champMedDate.value = "";

    sauvegarder();
    afficherMedicaments();
    afficherParametresMedicaments();
    afficherSuiviSiOuvert();

    alert("Médicament ajouté.");
  });
}
