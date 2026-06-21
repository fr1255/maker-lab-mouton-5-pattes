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
const cleAlarmes = "mouton-vigilant-alarmes-" + aujourdHui;

let prises = JSON.parse(localStorage.getItem(cleJour)) || {};
let historique = JSON.parse(localStorage.getItem(cleHistorique)) || [];
let alarmesEnvoyees = JSON.parse(localStorage.getItem(cleAlarmes)) || {};

function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function heureCouranteFormat() {
  const d = new Date();
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  }).replace(":", "h");
}

function sauvegarder() {
  localStorage.setItem(cleJour, JSON.stringify(prises));
  localStorage.setItem(cleHistorique, JSON.stringify(historique));
  localStorage.setItem(cleAlarmes, JSON.stringify(alarmesEnvoyees));
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

  if (!zone) return;

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

function envoyerNotification(med) {
  if (!("Notification" in window)) {
    alert("Les notifications ne sont pas disponibles sur cet appareil.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification("🐑 Mouton Vigilant", {
      body: `Il est l’heure de prendre : ${med.nom}`,
      icon: "icône-192.png"
    });

    if ("vibrate" in navigator) {
      navigator.vibrate([500, 200, 500]);
    }
  }
}

function verifierAlarmes() {
  const maintenant = heureCouranteFormat();

  medicaments.forEach(med => {
    if (
      med.heure === maintenant &&
      !prises[med.id] &&
      !alarmesEnvoyees[med.id]
    ) {
      envoyerNotification(med);
      alarmesEnvoyees[med.id] = true;
      sauvegarder();
    }
  });
}

const boutonAlarmes = document.getElementById("activerAlarmes");

if (boutonAlarmes) {
  boutonAlarmes.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      alert("Notifications non compatibles.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      alert("Alarmes activées.");
    } else {
      alert("Les notifications sont refusées.");
    }
  });
}

setInterval(verifierAlarmes, 30000);

afficherMedicaments();
afficherHistorique();
verifierAlarmes();
