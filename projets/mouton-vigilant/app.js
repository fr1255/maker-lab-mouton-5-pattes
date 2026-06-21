const medicaments = [
  {
    id: "levo",
    heure: "07h30",
    nom: "Levothyrox",
    note: "À jeun"
  },
  {
    id: "candesartan",
    heure: "08h30",
    nom: "Candésartan cilexétil",
    note: "Pas en même temps que le Levothyrox"
  },
  {
    id: "statine",
    heure: "22h00",
    nom: "Ézétimibe + Rosuvastatine",
    note: "Le soir"
  }
];

const aujourdHui = new Date().toISOString().slice(0, 10);
const cleJour = "mouton-vigilant-" + aujourdHui;
const cleHistorique = "mouton-vigilant-historique";

let prises = JSON.parse(localStorage.getItem(cleJour)) || {};
let historique = JSON.parse(localStorage.getItem(cleHistorique)) || [];

function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function sauvegarder() {
  localStorage.setItem(cleJour, JSON.stringify(prises));
  localStorage.setItem(cleHistorique, JSON.stringify(historique));
}

function afficherMedicaments() {
  const zone = document.getElementById("listeMedicaments");
  zone.innerHTML = "";

  medicaments.forEach(med => {
    const dejaPris = prises[med.id];

    const ligne = document.createElement("div");
    ligne.className = "medicament";

    ligne.innerHTML = `
      <strong>${med.heure}</strong>
      <span>
        ${med.nom}
        <small>${med.note}</small>
        ${dejaPris ? `<em>Pris à ${dejaPris}</em>` : ""}
      </span>
      <button class="${dejaPris ? "pris" : ""}">
        ${dejaPris ? "✓ Pris" : "Pris"}
      </button>
    `;

    ligne.querySelector("button").addEventListener("click", () => {
      if (prises[med.id]) {
        delete prises[med.id];
      } else {
        const h = heureActuelle();
        prises[med.id] = h;

        historique.unshift({
          date: aujourdHui,
          heure: h,
          nom: med.nom
        });
      }

      sauvegarder();
      afficherMedicaments();
      afficherHistorique();
    });

    zone.appendChild(ligne);
  });
}

function afficherHistorique() {
  const zone = document.getElementById("historique");

  if (historique.length === 0) {
    zone.innerHTML = `<p class="muted">Aucune prise enregistrée.</p>`;
    return;
  }

  zone.innerHTML = historique.slice(0, 10).map(item => `
    <div class="historique-item">
      <strong>${item.date}</strong>
      <span>${item.heure} — ${item.nom}</span>
    </div>
  `).join("");
}

afficherMedicaments();
afficherHistorique();
