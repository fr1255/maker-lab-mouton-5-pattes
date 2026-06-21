// ==================================================
// MOUTON VIGILANT - app.js
// Version simple fonctionnelle
// ==================================================

// Médicaments préconfigurés
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

// Date du jour
const aujourdHui = new Date().toISOString().slice(0, 10);

// Clés de sauvegarde
const cleJour = "mouton-vigilant-prises-" + aujourdHui;
const cleHistorique = "mouton-vigilant-historique";
const clePrenom = "mouton-vigilant-prenom";
const cleAlarmes = "mouton-vigilant-alarmes-" + aujourdHui;

// Données sauvegardées
let prises = JSON.parse(localStorage.getItem(cleJour)) || {};
let historique = JSON.parse(localStorage.getItem(cleHistorique)) || [];
let alarmesEnvoyees = JSON.parse(localStorage.getItem(cleAlarmes)) || {};
let prenom = localStorage.getItem(clePrenom) || "";

// Éléments HTML
const zoneMedicaments = document.getElementById("listeMedicaments");
const zoneHistorique = document.getElementById("historique");
const zoneBonjour = document.getElementById("bonjour");
const champPrenom = document.getElementById("prenom");
const boutonPrenom = document.getElementById("sauverPrenom");
const boutonAlarmes = document.getElementById("activerAlarmes");

// Heure actuelle affichée
function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Heure au format 07h30 pour comparaison avec les médicaments
function heureCouranteFormat() {
  return new Date()
    .toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    })
    .replace(":", "h");
}

// Sauvegarde locale
function sauvegarder() {
  localStorage.setItem(cleJour, JSON.stringify(prises));
  localStorage.setItem(cleHistorique, JSON.stringify(historique));
  localStorage.setItem(cleAlarmes, JSON.stringify(alarmesEnvoyees));
  localStorage.setItem(clePrenom, prenom);
}

// Affichage du prénom
function afficherPrenom() {
  if (zoneBonjour) {
    zoneBonjour.textContent = prenom ? "Bonjour " + prenom : "Bonjour";
  }

  if (champPrenom) {
    champPrenom.value = prenom;
  }
}

// Affichage des médicaments
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
        <small>${med.note}</small>
        ${dejaPris ? `<em>Pris à ${dejaPris}</em>` : `<em>À prendre</em>`}
      </span>

      <button class="${dejaPris ? "pris" : ""}">
        ${dejaPris ? "✓ Pris" : "Pris"}
      </button>
    `;

    const bouton = ligne.querySelector("button");

    bouton.addEventListener("click", () => {
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

// Affichage de l'historique
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

// Notification
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

// Vérification des alarmes
function verifierAlarmes() {
  const maintenant = heureCouranteFormat();

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

// Bouton activation alarmes
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

// Bouton prénom
if (boutonPrenom) {
  boutonPrenom.addEventListener("click", () => {
    prenom = champPrenom.value.trim();
    sauvegarder();
    afficherPrenom();
  });
}

// Lancement
afficherPrenom();
afficherMedicaments();
afficherHistorique();
verifierAlarmes();

// Vérifie toutes les 30 secondes
setInterval(verifierAlarmes, 30000);
