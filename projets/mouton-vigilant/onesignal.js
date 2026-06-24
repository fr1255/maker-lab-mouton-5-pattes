window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {

  await OneSignal.init({
    appId: "33afb21b-f145-4372-ae00-b7f5f656e025"
  });

  const bouton = document.getElementById("activerNotifications");
  const etat = document.getElementById("etatNotifications");

  if (!bouton || !etat) return;

  async function majEtat() {
    if (OneSignal.Notifications.permission) {
      etat.textContent = "✅ Notifications activées";
      bouton.textContent = "🔔 Notifications activées";
    } else {
      etat.textContent = "Notifications non activées";
      bouton.textContent = "🔔 Activer les notifications";
    }
  }

  await majEtat();

  bouton.onclick = async function () {

    try {

      await OneSignal.Notifications.requestPermission();

      await majEtat();

      console.log("Permission :", OneSignal.Notifications.permission);

    } catch (e) {

      console.error(e);

      etat.textContent = "⚠️ Erreur";

    }

  };

});
