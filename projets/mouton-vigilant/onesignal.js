window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {

  const bouton = document.getElementById("activerNotifications");
  const etat = document.getElementById("etatNotifications");

  if (!bouton || !etat) return;

  bouton.onclick = async function () {
    try {
      etat.textContent = "Activation en cours...";

      await OneSignal.Notifications.requestPermission();

      await OneSignal.User.PushSubscription.optIn();

      setTimeout(function () {
        const id = OneSignal.User.PushSubscription.id;

        alert("Permission : " + OneSignal.Notifications.permission + "\nID : " + id);

        if (id) {
          etat.textContent = "✅ Notifications activées";
          bouton.textContent = "🔔 Notifications activées";
        } else {
          etat.textContent = "⚠️ Permission OK mais abonnement non créé";
        }
      }, 3000);

    } catch (e) {
      alert("Erreur : " + e);
      etat.textContent = "⚠️ Erreur OneSignal";
    }
  };

});
