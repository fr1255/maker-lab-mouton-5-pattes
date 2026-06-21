const medicamentsParDefaut = [
  {
    id: "levo",
    heure: "07h30",
    nom: "Levothyrox",
    nombre: "1 comprimé",
    date: "",
    note: "À jeun"
  },
  {
    id: "candesartan",
    heure: "08h30",
    nom: "Candésartan cilexétil",
    nombre: "1 comprimé",
    date: "",
    note: "Pas en même temps que le Levothyrox"
  },
  {
    id: "statine",
    heure: "22h00",
    nom: "Ézétimibe + Rosuvastatine",
    nombre: "1 comprimé",
    date: "",
    note: "Le soir"
  }
];

const aujourdHui = new Date().toISOString().slice(0, 10);

const cleMedicaments = "mouton-vigilant-medicaments";
const cleJour = "mouton-vigilant-prises-" + aujourdHui;
const cleHistorique = "mouton-vigilant-historique";
const clePrenom = "mouton-vigilant-prenom";
const cleAlarmes = "mouton-vigilant-alarmes-" + aujourdHui;

let medicaments = JSON.parse(localStorage.getItem(cleMedicaments)) || medicamentsParDefaut;
let prises = JSON.parse(localStorage.getItem(cleJour)) || {};
let historique = JSON.parse(localStorage.getItem(cleHistorique)) || [];
let alarmesEnvoyees = JSON.parse(localStorage.getItem(cleAlarmes)) || {};
let prenom = localStorage.getItem(clePrenom) || "";

const zoneMedicaments = document.getElementById("listeMedicaments");
const zoneHistorique = document.getElementById("historique");
const zoneBonjour = document.getElementById("bonjour");

const champPrenom = document.getElementById("prenom");
const boutonPrenom = document.getElementById("sauverPrenom");

const boutonAlarmes = document.getElementById("activerAlarmes");
const champMedNom = document.getElementById("medNom");
const champMedHeure = document.getElementById("medHeure");
const champMedNombre = document.getElementById("medNombre");
const champMedDate = document.getElementById("medDate");
const boutonAjouterMedicament = document.getElementById("ajouterMedicament");

function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function heureCouranteFormat() {
  return new Date()
    .toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    })
    .replace(":", "h");
}

function normaliserHeure(heure) {
  return heure.replace(":", "h");
}

function sauvegarder() {
  localStorage.setItem(cleMedicaments, JSON.stringify(medicaments));
  localStorage.setItem(cleJour, JSON.stringify(prises));
  localStorage.setItem(cleHistorique, JSON.stringify(historique));
  localStorage.setItem(cleAlarmes, JSON.stringify(alarmesEnvoyees));
  localStorage.setItem(clePrenom, prenom);
}

function afficherPrenom() {
  if (zoneBonjour) {
    zoneBonjour.textContent = prenom ? "Bonjour " + prenom : "Bonjour";
  }

  if (champPrenom) {
    champPrenom.value = prenom;
  }
}

function afficherMedicaments() {
  if (!zoneMedicaments) return;

  zoneMedicaments.innerHTML = "";

  medicaments.forEach((med) => {
    const dejaPris = prises[med.id];

    const ligne = document.createElement("div");
    ligne.className = "medicament";

    ligne.innerHTML = `
      <strong>${med.heure}</strong>

      <span>
        ${med.nom}
        <small>${med.nombre || ""}</small>
        ${med.date ? `<small>Depuis le ${med.date}</small>` : ""}
        ${med.note ? `<small>${med.note}</small>` : ""}
        ${dejaPris ? `<em>Pris à ${dejaPris}</em>` : `<em>À prendre</em>`}
      </span>

      <div class="actions-med">
        <button class="${dejaPris ? "pris" : ""}">
          ${dejaPris ? "✓ Pris" : "Pris"}
        </button>

        <button class="supprimer" title="Supprimer">
          🗑️
        </button>
      </div>
    `;

    ligne.querySelector("button").addEventListener("click", () => {
      if (prises[med.id]) {
        delete prises[med.id];

        historique = historique.filter(
          (item) => !(item.date === aujourdHui && item.id === med.id)
        );
      } else {
        const h = heureActuelle();
        prises[med.id] = h;

        historique.unshift({
          date: aujourdHui,
          heure: h,
          id: med.id,
          nom: med.nom
        });
      }

      sauvegarder();
      afficherMedicaments();
      afficherHistorique();
    });

    ligne.querySelector(".supprimer").addEventListener("click", () => {
      if (confirm("Supprimer ce médicament ?")) {
        medicaments = medicaments.filter((m) => m.id !== med.id);
        delete prises[med.id];
        sauvegarder();
        afficherMedicaments();
      }
    });

    zoneMedicaments.appendChild(ligne);
  });
}

function afficherHistorique() {
  if (!zoneHistorique) return;

  if (historique.length === 0) {
    zoneHistorique.innerHTML = `<p class="muted">Aucune prise enregistrée.</p>`;
    return;
  }

  zoneHistorique.innerHTML = historique
    .slice(0, 12)
    .map(
      (item) => `
      <div class="historique-item">
        <strong>${item.date}</strong>
        <span>${item.heure} — ${item.nom}</span>
      </div>
    `
    )
    .join("");
}

function envoyerNotification(med) {
  if (!("Notification" in window)) {
    alert("Les notifications ne sont pas disponibles sur cet appareil.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification("🐑 Mouton Vigilant", {
      body: "Il est l'heure de prendre : " + med.nom,
      icon: "icône-192.png"
    });

    if ("vibrate" in navigator) {
      navigator.vibrate([500, 200, 500]);
    }
  }
}

function verifierAlarmes() {
  const maintenant = heureCouranteFormat();

  medicaments.forEach((med) => {
    if (
      normaliserHeure(med.heure) === maintenant &&
      !prises[med.id] &&
      !alarmesEnvoyees[med.id]
    ) {
      envoyerNotification(med);
      alarmesEnvoyees[med.id] = true;
      sauvegarder();
    }
  });
}

if (boutonAlarmes) {
  boutonAlarmes.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      alert("Notifications non compatibles sur cet appareil.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      alert("Alarmes activées.");
    } else {
      alert("Notifications refusées.");
    }
  });
}

if (boutonPrenom) {
  boutonPrenom.addEventListener("click", () => {
    prenom = champPrenom.value.trim();
    sauvegarder();
    afficherPrenom();
  });
}

if (boutonAjouterMedicament) {
  boutonAjouterMedicament.addEventListener("click", () => {
    const nom = champMedNom.value.trim();
    const heure = champMedHeure.value;
    const nombre = champMedNombre.value.trim();
    const date = champMedDate.value;

    if (!nom || !heure) {
      alert("Il faut au minimum le nom du médicament et l'heure.");
      return;
    }

    const nouveauMedicament = {
      id: "med-" + Date.now(),
      heure: normaliserHeure(heure),
      nom: nom,
      nombre: nombre || "1 prise",
      date: date,
      note: ""
    };

    medicaments.push(nouveauMedicament);

    champMedNom.value = "";
    champMedHeure.value = "";
    champMedNombre.value = "";
    champMedDate.value = "";

    sauvegarder();
    afficherMedicaments();
  });
}

afficherPrenom();
afficherMedicaments();
afficherHistorique();
verifierAlarmes();

setInterval(verifierAlarmes, 30000);
