// ===============================
// MOUTON VIGILANT - ONESIGNAL V2.2
// ===============================

window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function(OneSignal) {
  try {
    await OneSignal.init({
      appId: "33afb21b-f145-4372-ae00-b7f5f656e025",
      serviceWorkerPath: "OneSignalSDKWorker.js",
      serviceWorkerParam: {
        scope: "./"
      }
    });

    const bouton = document.getElementById("activerNotifications");
    const etat = document.getElementById("etatNotifications");

    if (!bouton || !etat) return;

    function mettreAJourEtat() {
      if (OneSignal.Notifications.permission) {
        etat.textContent = "✅ Notifications activées";
        bouton.textContent = "🔔 Notifications activées";
      } else {
        etat.textContent = "Notifications non activées";
        bouton.textContent = "🔔 Activer les notifications";
      }
    }

    mettreAJourEtat();

    bouton.addEventListener("click", async function() {
      try {
        await OneSignal.Notifications.requestPermission();
        mettreAJourEtat();
      } catch (erreur) {
        console.error("Erreur OneSignal :", erreur);
        etat.textContent = "⚠️ Erreur pendant l’activation";
      }
    });

  } catch (erreur) {
    console.error("Erreur initialisation OneSignal :", erreur);

    const etat = document.getElementById("etatNotifications");
    if (etat) {
      etat.textContent = "⚠️ OneSignal non disponible";
    }
  }
});
