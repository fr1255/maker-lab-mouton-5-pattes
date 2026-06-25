// ==============================
// Notifications - Mouton Vigilant
// ==============================

// Initialisation OneSignal
window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {

  try {

    await OneSignal.init({
      appId: "33afb21b-f145-4372-ae00-b7f5f656e025",
      notifyButton: {
        enable: false
      }
    });

    console.log("🐑 OneSignal initialisé");

  } catch (e) {

    console.error("Erreur OneSignal :", e);

  }

});


// Demande d'autorisation
async function activerNotifications() {

  const OneSignal = window.OneSignal;

  if (!OneSignal) {
    alert("OneSignal n'est pas encore chargé.");
    return;
  }

  try {

    await OneSignal.Notifications.requestPermission();

    const autorise = OneSignal.Notifications.permission;

    const etat1 = document.getElementById("etatNotifications");
    const etat2 = document.getElementById("etatNotificationsMouton");

    if (autorise) {

      if (etat1) etat1.textContent = "🟢 Notifications activées";
      if (etat2) etat2.textContent = "🟢 Notifications activées";

      alert("✅ Notifications activées.");

    } else {

      if (etat1) etat1.textContent = "Notifications non activées";

      alert("Les notifications n'ont pas été autorisées.");

    }

  } catch (e) {

    console.error(e);
    alert("Erreur lors de l'activation des notifications.");

  }

}


// Notification de test
async function testerNotification() {

  alert(
    "La notification de test sera envoyée depuis OneSignal.\n\n" +
    "Cette fonction sera terminée dans la prochaine étape."
  );

}

// =========================================
// Ouverture depuis une notification
// =========================================
function ouvrirDepuisNotification() {

  const params = new URLSearchParams(window.location.search);
  const med = params.get("med");

  if (!med) return;

  changerPage("aujourdhui");

  setTimeout(() => {

    const element = document.getElementById("med-" + med);

    if (!element) {
      console.log("Médicament non trouvé :", med);
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    element.style.border = "3px solid #4CAF50";
    element.style.borderRadius = "12px";
    element.style.padding = "8px";

    setTimeout(() => {
      element.style.border = "";
      element.style.padding = "";
    }, 5000);

  }, 500);

}
