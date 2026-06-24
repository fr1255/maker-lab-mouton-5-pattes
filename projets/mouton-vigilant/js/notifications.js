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

  if (!OneSignal) return;

  await OneSignal.Notifications.requestPermission();

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
