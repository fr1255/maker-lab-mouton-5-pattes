const medicamentsParDefaut = [
  {
    id: "levo",
    heure: "07:30",
    nom: "Levothyrox",
    nombre: "1 comprimé",
    date: "",
    note: "À jeun"
  },
  {
    id: "candesartan",
    heure: "08:30",
    nom: "Candésartan cilexétil",
    nombre: "1 comprimé",
    date: "",
    note: "Pas en même temps que le Levothyrox"
  },
  {
    id: "statine",
    heure: "22:00",
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
const zoneParametresMedicaments = document.getElementById("listeParametresMedicaments");
const zoneHistorique = document.getElementById("historique");
const zoneBonjour = document.getElementById("bonjour");

const champPrenom = document.getElementById("prenom");
const boutonPrenom = document.getElementById("sauverPrenom");

const boutonAlarmes = document.getElementById("activerAlarmes");
const boutonCalendrier = document.getElementById("creerCalendrier");

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

function heurePourComparaison() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function afficherHeure(heure) {
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
      <strong>${afficherHeure(med.heure)}</strong>

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

    zoneMedicaments.appendChild(ligne);
  });
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
      </span>

      <div class="actions-med">
        <button class="supprimer" title="Supprimer">
          🗑️ Supprimer
        </button>
      </div>
    `;

    ligne.querySelector(".supprimer").addEventListener("click", () => {
      if (confirm("Supprimer ce médicament ?")) {
        medicaments = medicaments.filter((m) => m.id !== med.id);
        delete prises[med.id];
        delete alarmesEnvoyees[med.id];

        historique = historique.filter((item) => item.id !== med.id);

        sauvegarder();
        afficherMedicaments();
        afficherParametresMedicaments();
        afficherHistorique();
      }
    });

    zoneParametresMedicaments.appendChild(ligne);
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

async function activerNotifications() {
  if (!("Notification" in window)) {
    alert("Les notifications ne sont pas disponibles sur cet appareil.");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

function envoyerNotification(med) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const titre = "🐑 Mouton Vigilant";
  const message =
    "Il est l'heure de prendre : " +
    med.nom +
    (med.nombre ? " — " + med.nombre : "");

  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(titre, {
        body: message,
        icon: "icon-192.png",
        badge: "icon-192.png",
        vibrate: [500, 200, 500],
        requireInteraction: true
      });
    });
  } else {
    new Notification(titre, {
      body: message,
      icon: "icon-192.png"
    });
  }

  if ("vibrate" in navigator) {
    navigator.vibrate([500, 200, 500]);
  }
}

function verifierAlarmes() {
  const maintenant = heurePourComparaison();

  medicaments.forEach((med) => {
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

function dateICS(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function nettoyerTexteICS(texte) {
  return String(texte || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function creerRappelsCalendrier() {
  let contenu = "BEGIN:VCALENDAR\r\n";
  contenu += "VERSION:2.0\r\n";
  contenu += "CALSCALE:GREGORIAN\r\n";
  contenu += "PRODID:-//Mouton Vigilant//FR\r\n";

  medicaments.forEach((med) => {
    const [h, m] = med.heure.split(":");
    const debut = new Date();
    debut.setHours(Number(h), Number(m), 0, 0);

    const fin = new Date(debut);
    fin.setMinutes(fin.getMinutes() + 5);

    contenu += "BEGIN:VEVENT\r\n";
    contenu += "UID:" + med.id + "-" + Date.now() + "@mouton-vigilant\r\n";
    contenu += "SUMMARY:" + nettoyerTexteICS("Prendre " + med.nom) + "\r\n";
    contenu += "DESCRIPTION:" + nettoyerTexteICS((med.nombre || "") + " " + (med.note || "")) + "\r\n";
    contenu += "DTSTART:" + dateICS(debut) + "\r\n";
    contenu += "DTEND:" + dateICS(fin) + "\r\n";
    contenu += "RRULE:FREQ=DAILY\r\n";
    contenu += "BEGIN:VALARM\r\n";
    contenu += "TRIGGER:-PT0M\r\n";
    contenu += "ACTION:DISPLAY\r\n";
    contenu += "DESCRIPTION:" + nettoyerTexteICS("🐑 Mouton Vigilant - " + med.nom) + "\r\n";
    contenu += "END:VALARM\r\n";
    contenu += "END:VEVENT\r\n";
  });

  contenu += "END:VCALENDAR\r\n";

  const blob = new Blob([contenu], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const lien = document.createElement("a");
  lien.href = url;
  lien.download = "mouton-vigilant-rappels.ics";
  document.body.appendChild(lien);
  lien.click();
  document.body.removeChild(lien);

  URL.revokeObjectURL(url);
}

if (boutonAlarmes) {
  boutonAlarmes.addEventListener("click", async () => {
    const ok = await activerNotifications();

    if (ok) {
      alert("Alarmes activées. Test de notification envoyé.");
      envoyerNotification({
        nom: "Test de notification",
        nombre: "Mouton Vigilant fonctionne"
      });
    } else {
      alert("Notifications refusées. Il faut les autoriser dans le navigateur.");
    }
  });
}

if (boutonCalendrier) {
  boutonCalendrier.addEventListener("click", creerRappelsCalendrier);
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
      heure: heure,
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
    afficherParametresMedicaments();
  });
}

afficherPrenom();
afficherMedicaments();
afficherParametresMedicaments();
afficherHistorique();
verifierAlarmes();

setInterval(verifierAlarmes, 15000);
