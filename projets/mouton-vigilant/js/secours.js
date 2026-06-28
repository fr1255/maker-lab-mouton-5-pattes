// secours.js — Mouton Vigilant V7
// Couche de secours iPhone par fichier calendrier .ics
// Ne modifie pas OneSignal, ne modifie pas les prises, ne casse pas V6.

function lireMedicamentsSecours() {
  try {
    return JSON.parse(localStorage.getItem("medicaments") || "[]");
  } catch (e) {
    console.error("Erreur lecture médicaments :", e);
    return [];
  }
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

  medicaments.forEach((med) => {
    if (!med.nom || !med.heure) return;

    const [h, m] = med.heure.split(":").map(Number);

    const debut = new Date();
    debut.setHours(h, m, 0, 0);

    if (debut < maintenant) {
      debut.setDate(debut.getDate() + 1);
    }

    const fin = new Date(debut.getTime() + 5 * 60 * 1000);

    ics += "BEGIN:VEVENT\r\n";
    ics += `UID:${med.nom}-${med.heure}@mouton-vigilant\r\n`;
    ics += `DTSTAMP:${formatDateICS(new Date())}\r\n`;
    ics += `DTSTART:${formatDateICS(debut)}\r\n`;
    ics += `DTEND:${formatDateICS(fin)}\r\n`;
    ics += `SUMMARY:💊 ${med.nom}\r\n`;
    ics += `DESCRIPTION:Rappel médicament Mouton Vigilant\r\n`;

    ics += "BEGIN:VALARM\r\n";
    ics += "ACTION:DISPLAY\r\n";
    ics += `DESCRIPTION:💊 Prendre ${med.nom}\r\n`;
    ics += "TRIGGER:-PT0M\r\n";
    ics += "END:VALARM\r\n";

    ics += "END:VEVENT\r\n";
  });

  ics += "END:VCALENDAR\r\n";

  return ics;
}

function telechargerCalendrierSecours() {
  const ics = genererICS();

  const blob = new Blob([ics], {
    type: "text/calendar;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);

  const lien = document.createElement("a");
  lien.href = url;
  lien.download = "mouton-vigilant-secours.ics";
  lien.click();

  URL.revokeObjectURL(url);
}

function initialiserSecours() {
  const bouton = document.getElementById("btnSecoursIphone");
  if (!bouton) return;

  bouton.addEventListener("click", telechargerCalendrierSecours);
}

document.addEventListener("DOMContentLoaded", initialiserSecours);
