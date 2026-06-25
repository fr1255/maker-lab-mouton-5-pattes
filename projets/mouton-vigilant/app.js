// =====================
// MOUTON VIGILANT V4
// =====================

// ===== Données par défaut =====
const medicamentsParDefaut = [
  { id: "levo", heure: "07:30", nom: "Levothyrox", nombre: "1 comprimé", date: "", note: "À jeun" },
  { id: "candesartan", heure: "08:30", nom: "Candésartan cilexétil", nombre: "1 comprimé", date: "", note: "Pas en même temps que le Levothyrox" },
  { id: "statine", heure: "22:00", nom: "Ézétimibe + Rosuvastatine", nombre: "1 comprimé", date: "", note: "Le soir" }
];

const aujourdHui = new Date().toISOString().slice(0, 10);

const cleMedicaments = "mouton-vigilant-medicaments";
const cleJour = "mouton-vigilant-prises-" + aujourdHui;
const cleHistorique = "mouton-vigilant-historique";
const clePrenom = "mouton-vigilant-prenom";

let medicaments = JSON.parse(localStorage.getItem(cleMedicaments)) || medicamentsParDefaut;
let prises = JSON.parse(localStorage.getItem(cleJour)) || {};
let historique = JSON.parse(localStorage.getItem(cleHistorique)) || [];
let prenom = localStorage.getItem(clePrenom) || "";

// ===== Éléments HTML =====
const zoneMedicaments = document.getElementById("listeMedicaments");
const zoneParametresMedicaments = document.getElementById("listeParametresMedicaments");
const zoneBonjour = document.getElementById("bonjour");
const zoneResumeJour = document.getElementById("resumeJour");

const zoneSuivi = document.getElementById("suiviTraitements");

const champPrenom = document.getElementById("prenom");
const boutonPrenom = document.getElementById("sauverPrenom");

const boutonCalendrier = document.getElementById("creerCalendrier");

const champMedNom = document.getElementById("medNom");
const champMedHeure = document.getElementById("medHeure");
const champMedNombre = document.getElementById("medNombre");
const champMedDate = document.getElementById("medDate");
const boutonAjouterMedicament = document.getElementById("ajouterMedicament");

// ===== Outils =====
function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function afficherHeure(heure) {
  return heure.replace(":", "h");
}

function sauvegarder() {
  localStorage.setItem(cleMedicaments, JSON.stringify(medicaments));
  localStorage.setItem(cleJour, JSON.stringify(prises));
  localStorage.setItem(cleHistorique, JSON.stringify(historique));
  localStorage.setItem(clePrenom, prenom);
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

// ===== Accueil =====
function afficherPrenom() {
  if (zoneBonjour) {
    zoneBonjour.textContent = prenom ? "Bonjour " + prenom : "Bonjour";
  }

  if (champPrenom) {
    champPrenom.value = prenom;
  }
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

// ===== Prise =====
function basculerPrise(id) {
  const med = medicaments.find((m) => m.id === id);
  if (!med) return;

  if (prises[id]) {
    delete prises[id];

    historique = historique.filter(
      (item) => !(item.date === aujourdHui && item.id === id)
    );
  } else {
    const h = heureActuelle();
    prises[id] = h;

    historique.unshift({
      date: aujourdHui,
      heure: h,
      id: med.id,
      nom: med.nom,
      etat: "pris"
    });
  }

  sauvegarder();
  afficherMedicaments();
  afficherSuiviSiOuvert();
}

// ===== Médicaments =====
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

    medicaments.push({
      id: "med-" + Date.now(),
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

// ===== Suivi =====
function calculerSuiviMedicament(med) {
  const debut = med.date
    ? new Date(med.date + "T12:00:00")
    : dateDebutMois();

  const aujourd = new Date();
  const datesPrevues = [];

  let d = new Date(debut);

  while (d <= aujourd) {
    const dateTexte = dateLocale(d);

    if (dateTexte !== aujourdHui || heureDepassee(med.heure)) {
      datesPrevues.push(dateTexte);
    }

    d.setDate(d.getDate() + 1);
  }

  const prisesMed = historique.filter((item) => item.id === med.id);
  const datesPrises = prisesMed.map((item) => item.date);

  const oublisDates = datesPrevues.filter((date) => !datesPrises.includes(date));

  const prevues = datesPrevues.length;
  const realisees = datesPrevues.filter((date) => datesPrises.includes(date)).length;
  const oublis = oublisDates.length;
  const pourcentage = prevues > 0 ? Math.round((realisees / prevues) * 100) : 100;

  const dernierOubli = oublisDates.length > 0
    ? oublisDates[oublisDates.length - 1]
    : null;

  return { prevues, realisees, oublis, pourcentage, dernierOubli };
}

function niveauSuivi(pourcentage) {
  if (pourcentage >= 95) return { icone: "🟢", texte: "Excellent" };
  if (pourcentage >= 90) return { icone: "🟢", texte: "Très bon" };
  if (pourcentage >= 80) return { icone: "🟡", texte: "Bon suivi" };
  if (pourcentage >= 60) return { icone: "🟠", texte: "Quelques oublis" };
  return { icone: "🔴", texte: "Suivi à renforcer" };
}

function afficherSuivi() {
  if (!zoneSuivi) return;

  let totalPrevues = 0;
  let totalRealisees = 0;
  let totalOublis = 0;
  let html = "";

  medicaments.forEach((med) => {
    const suivi = calculerSuiviMedicament(med);
    totalPrevues += suivi.prevues;
    totalRealisees += suivi.realisees;
    totalOublis += suivi.oublis;
  });

  const pourcentageGeneral =
    totalPrevues > 0 ? Math.round((totalRealisees / totalPrevues) * 100) : 100;

  const niveauGeneral = niveauSuivi(pourcentageGeneral);

  html += `
    <div class="historique-item">
      <strong>🏆 Suivi général</strong>
      <span>${niveauGeneral.icone} ${niveauGeneral.texte}</span>
      <span><strong>${pourcentageGeneral} %</strong></span>
      <span>${totalRealisees} prises réalisées / ${totalPrevues} prévues</span>
      <span>⚠ ${totalOublis} oubli${totalOublis > 1 ? "s" : ""}</span>
    </div>
  `;

  medicaments.forEach((med) => {
    const suivi = calculerSuiviMedicament(med);
    const niveau = niveauSuivi(suivi.pourcentage);

    html += `
      <div class="historique-item">
        <strong>💊 ${med.nom}</strong>
        <span>${niveau.icone} ${niveau.texte}</span>
        <span><strong>${suivi.pourcentage} %</strong></span>
        <span>${suivi.realisees} prises réalisées / ${suivi.prevues} prévues</span>
        <span>⚠ ${suivi.oublis} oubli${suivi.oublis > 1 ? "s" : ""}</span>
        <span>
          ${suivi.dernierOubli
            ? "Dernier oubli : " + texteDateFR(suivi.dernierOubli)
            : "Aucun oubli 👍"}
        </span>
      </div>
    `;
  });

  zoneSuivi.innerHTML = html;
}

function afficherSuiviSiOuvert() {
  if (zoneSuivi && zoneSuivi.style.display === "block") {
    afficherSuivi();
  }
}

document.addEventListener("click", (event) => {
  if (event.target && event.target.id === "afficherSuivi") {
    const zone = document.getElementById("suiviTraitements");
    const bouton = document.getElementById("afficherSuivi");

    if (!zone || !bouton) return;

    if (zone.style.display === "none" || zone.style.display === "") {
      afficherSuivi();
      zone.style.display = "block";
      bouton.textContent = "Masquer le suivi";
    } else {
      zone.style.display = "none";
      bouton.textContent = "📊 Consulter le suivi";
    }
  }
});

// ===== Rappels iPhone =====
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


function lienPris(med) {
  const base = window.location.href
    .split("?")[0]
    .replace("https://", "webapp://")
    .replace("http://", "webapp://");

  return base + "?pris=" + encodeURIComponent(med.id);
}

function lienReporter(med, minutes) {
  const base = window.location.href
    .split("?")[0]
    .replace("https://", "webapp://")
    .replace("http://", "webapp://");

  return base + "?reporter=" + minutes + "&med=" + encodeURIComponent(med.id);
}

function creerRappelUnique(med, minutes) {
  const debut = new Date();
  debut.setMinutes(debut.getMinutes() + Number(minutes));

  const fin = new Date(debut);
  fin.setMinutes(fin.getMinutes() + 5);

  let contenu = "BEGIN:VCALENDAR\r\n";
  contenu += "VERSION:2.0\r\n";
  contenu += "CALSCALE:GREGORIAN\r\n";
  contenu += "PRODID:-//Mouton Vigilant//FR\r\n";
  contenu += "BEGIN:VEVENT\r\n";
  contenu += "UID:report-" + med.id + "-" + Date.now() + "@mouton-vigilant\r\n";
  contenu += "SUMMARY:" + nettoyerTexteICS("Rappel : " + med.nom) + "\r\n";
  contenu += "DESCRIPTION:" + nettoyerTexteICS(
    "🐑 Mouton Vigilant\n\n" +
    med.nom + "\n\n" +
    "✅ J’ai pris :\n" +
    lienPris(med)
  ) + "\r\n";
  contenu += "URL:" + lienPris(med) + "\r\n";
  contenu += "DTSTART:" + dateICS(debut) + "\r\n";
  contenu += "DTEND:" + dateICS(fin) + "\r\n";
  contenu += "BEGIN:VALARM\r\n";
  contenu += "TRIGGER:-PT0M\r\n";
  contenu += "ACTION:DISPLAY\r\n";
  contenu += "DESCRIPTION:" + nettoyerTexteICS("🐑 Rappel - " + med.nom) + "\r\n";
  contenu += "END:VALARM\r\n";
  contenu += "END:VEVENT\r\n";
  contenu += "END:VCALENDAR\r\n";

  telechargerICS(contenu, "mouton-vigilant-report.ics");
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
    contenu += "DESCRIPTION:" + nettoyerTexteICS(
      "🐑 Mouton Vigilant\n\n" +
      med.nom + "\n" +
      (med.nombre || "") + "\n" +
      (med.note || "") + "\n\n" +
      "✅ J’ai pris :\n" +
      lienPris(med) + "\n\n" +
      "⏰ Reporter de 10 min :\n" +
      lienReporter(med, 10) + "\n\n" +
      "⏰ Reporter de 30 min :\n" +
      lienReporter(med, 30)
    ) + "\r\n";
    contenu += "URL:" + lienPris(med) + "\r\n";
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

  telechargerICS(contenu, "mouton-vigilant-rappels.ics");
}

function telechargerICS(contenu, nomFichier) {
  const blob = new Blob([contenu], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const lien = document.createElement("a");
  lien.href = url;
  lien.download = nomFichier;
  document.body.appendChild(lien);
  lien.click();
  document.body.removeChild(lien);

  URL.revokeObjectURL(url);
}

if (boutonCalendrier) {
  boutonCalendrier.addEventListener("click", creerRappelsCalendrier);
}

// ===== Liens calendrier : pris / reporter =====
function verifierLiensCalendrier() {
  const params = new URLSearchParams(window.location.search);

  const idPris = params.get("pris");
  const reporter = params.get("reporter");
  const medReporter = params.get("med");

  if (reporter && medReporter) {
    const med = medicaments.find((m) => m.id === medReporter);

    if (med) {
      creerRappelUnique(med, reporter);
      alert("⏰ Nouveau rappel créé dans " + reporter + " minutes pour " + med.nom);
    }

    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  if (idPris) {
    const med = medicaments.find((m) => m.id === idPris);
    if (!med) return;

    if (!prises[idPris]) {
      const h = heureActuelle();
      prises[idPris] = h;

      historique.unshift({
        date: aujourdHui,
        heure: h,
        id: med.id,
        nom: med.nom,
        etat: "pris"
      });

      sauvegarder();
      alert("✅ " + med.nom + " enregistré comme pris à " + h);
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// ===== Navigation =====
function changerPage(page) {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });

  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const section = document.getElementById("page-" + page);
  const bouton = document.querySelector(`[data-page="${page}"]`);

  if (section) section.classList.add("active");
  if (bouton) bouton.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".page-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    changerPage(btn.dataset.page);
  });
});

// ===== Paramètres =====
if (boutonPrenom) {
  boutonPrenom.addEventListener("click", () => {
    prenom = champPrenom.value.trim();
    sauvegarder();
    afficherPrenom();
    alert("Prénom enregistré.");
  });
}

const boutonActiverNotifications = document.getElementById("activerNotifications");

if (boutonActiverNotifications) {
  boutonActiverNotifications.addEventListener("click", activerNotifications);
}
// ===== Initialisation =====
verifierLiensCalendrier();
afficherPrenom();
afficherMedicaments();
ouvrirDepuisNotification();
afficherParametresMedicaments();

