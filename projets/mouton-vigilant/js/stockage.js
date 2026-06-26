// ==============================
// Stockage - Mouton Vigilant V6
// ==============================

const URL_SERVEUR_MOUTON =
  "https://mouton-vigilant-server.fr12andco55.workers.dev/save";

function obtenirUserId() {
  let id = localStorage.getItem("mouton-vigilant-user-id");

  if (!id) {
    id = "user-" + crypto.randomUUID();
    localStorage.setItem("mouton-vigilant-user-id", id);
  }

  return id;
}

function sauvegarder() {
  localStorage.setItem(cleMedicaments, JSON.stringify(medicaments));
  localStorage.setItem(cleJour, JSON.stringify(prises));
  localStorage.setItem(cleHistorique, JSON.stringify(historique));
  localStorage.setItem(clePrenom, prenom);

  envoyerRappelsAuServeur();
}

async function envoyerRappelsAuServeur() {
  try {
    const onesignalId = window.MOUTON_ONESIGNAL_ID;

    if (!onesignalId) {
      console.log("🐑 OneSignal ID pas encore disponible.");
      return;
    }

    const rappels = medicaments.map((med) => ({
      medicament: med.nom,
      heure: med.heure
    }));

    const reponse = await fetch(URL_SERVEUR_MOUTON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: obtenirUserId(),
        onesignal_id: onesignalId,
        rappels: rappels
      })
    });

    const resultat = await reponse.json();
    console.log("🐑 Synchronisation serveur :", resultat);

  } catch (e) {
    console.error("Erreur synchronisation serveur :", e);
  }
}
