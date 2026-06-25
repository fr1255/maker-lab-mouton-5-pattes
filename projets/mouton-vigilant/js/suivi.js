// ==============================
// Suivi - Mouton Vigilant V5
// ==============================

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
  const dernierOubli = oublisDates.length > 0 ? oublisDates[oublisDates.length - 1] : null;

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

function initialiserSuivi() {
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
        bouton.textContent = "📊 Voir le suivi des traitements";
      }
    }
  });
}
