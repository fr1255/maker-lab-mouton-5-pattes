window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {

  try {

    await OneSignal.init({
      appId: "33afb21b-f145-4372-ae00-b7f5f656e025"
    });

    console.log("✅ OneSignal initialisé");

    const bouton = document.getElementById("activerNotifications");
    const etat = document.getElementById("etatNotifications");

    if (!bouton || !etat) {
      console.log("⚠️ Bouton ou texte introuvable");
      return;
    }

    async function mettreAJourEtat() {

      if (OneSignal.Notifications.permission) {

        etat.textContent = "✅ Notifications activées";
        bouton.textContent = "🔔 Notifications activées";

      } else {

        etat.textContent = "Notifications non activées";
        bouton.textContent = "🔔 Activer les notifications";

      }

    }

    await mettreAJourEtat();

    bouton.onclick = async function () {

      try {

        await OneSignal.Notifications.requestPermission();

        await mettreAJourEtat();

      } catch (e) {

        console.error(e);

        etat.textContent = "⚠️ Erreur OneSignal";

      }

    };

  } catch (e) {

    console.error("Erreur OneSignal :", e);

  }

});
