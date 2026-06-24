window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {
  alert("onesignal.js OK");

  const bouton = document.getElementById("activerNotifications");
  const etat = document.getElementById("etatNotifications");

  if (!bouton || !etat) {
    alert("Bouton introuvable");
    return;
  }

  bouton.onclick = async function () {
    alert("Bouton cliqué");

    try {
      await OneSignal.Notifications.requestPermission();

      alert("Permission : " + OneSignal.Notifications.permission);

      if (OneSignal.Notifications.permission) {
        etat.textContent = "✅ Notifications activées";
        bouton.textContent = "🔔 Notifications activées";
      } else {
        etat.textContent = "Notifications non activées";
      }

    } catch (e) {
      alert("Erreur permission : " + e);
    }
  };
});
