// secours.js — Mouton Vigilant V7
// Couche de secours iPhone par fichier calendrier .ics
// Ne modifie pas OneSignal, ne modifie pas les prises, ne casse pas V6.

function lireMedicamentsSecours() {
  const clesPossibles = [
    "medicaments",
    "mouton_medicaments",
    "moutonVigilant_medicaments",
    "mouton_medicaments_v1"
  ];

  for (const cle of clesPossibles) {
    try {
      const donnees = JSON.parse(localStorage.getItem(cle) || "[]");

      if (Array.isArray(donnees) && donnees.length > 0) {
        console.log("Médicaments trouvés dans :", cle, donnees);
        return donnees;
      }
    } catch (e) {
      console.warn("Clé ignorée :", cle);
    }
  }

  console.warn("Aucun médicament trouvé dans le stockage local.");
  return [];
}

function nettoyerTexteICS(texte) {
  return String(texte || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatDateICS(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";
}

function genererICS() {
  const medicaments = lireMedicamentsSecours();
  const maintenant = new Date();

  let ics = "";
  ics += "BEGIN:VCALENDAR\r\n";
  ics += "VERSION:2.0\r\n";
  ics += "PRODID:-//Mouton Vigilant//Secours iPhone//FR\r\n";
  ics += "CALSCALE:GREGORIAN\r\n";
  ics += "METHOD:PUBLISH\r\n";

  medicaments.forEach((med, index) => {
    const nom = med.nom || med.name || med.titre || med.medicament || "";
    const heure = med.heure || med.time || med.horaire || "";

    if (!nom || !heure) return;

    const [h, m] = heure.split(":").map(Number);

    if (Number.isNaN(h) || Number.isNaN(m)) return;

    const debut = new Date();
    debut.setHours(h, m, 0, 0);

    if (debut < maintenant) {
      debut.setDate(debut.getDate() + 1);
    }

    const fin = new Date(debut.getTime() + 5 * 60 * 1000);

    const nomPropre = nettoyerTexteICS(nom);
    const uid = `${Date.now()}-${index}-${nomPropre}-${heure}@mouton-vigilant`;

    ics += "BEGIN:VEVENT\r\n";
    ics += `UID:${uid}\r\n`;
    ics += `DTSTAMP:${formatDateICS(new Date())}\r\n`;
    ics += `DTSTART:${formatDateICS(debut)}\r\n`;
    ics += `DTEND:${formatDateICS(fin)}\r\n`;
    ics += `SUMMARY:💊 ${nomPropre}\r\n`;
    ics += `DESCRIPTION:Rappel médicament Mouton Vigilant : ${nomPropre}\r\n`;

    ics += "BEGIN:VALARM\r\n";
    ics += "ACTION:DISPLAY\r\n";
    ics += `DESCRIPTION:💊 Prendre ${nomPropre}\r\n`;
    ics += "TRIGGER:PT0M\r\n";
    ics += "END:VALARM\r\n";

    ics += "END:VEVENT\r\n";
  });

  ics += "END:VCALENDAR\r\n";

  return ics;
}

function ouvrirCalendrierSecours() {
  const ics = genererICS();

  if (!ics.includes("BEGIN:VEVENT")) {
    alert("Aucun médicament trouvé pour créer le calendrier de secours.");
    return;
  }

  const dataUrl = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);

  window.location.href = dataUrl;
}

function initialiserSecours() {
  const bouton = document.getElementById("btnSecoursIphone");
  if (!bouton) return;

  bouton.addEventListener("click", ouvrirCalendrierSecours);
}

document.addEventListener("DOMContentLoaded", initialiserSecours);
