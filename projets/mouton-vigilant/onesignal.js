window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {

  const bouton = document.getElementById("activerNotifications");
  const etat = document.getElementById("etatNotifications");

  bouton.onclick = async function () {

    await OneSignal.Notifications.requestPermission();

    alert("Permission : " + OneSignal.Notifications.permission);

    try {

      const id = await OneSignal.User.PushSubscription.id;

      alert("Subscription ID : " + id);

      const token = await OneSignal.User.PushSubscription.token;

      alert("Token : " + token);

    } catch (e) {

      alert("Erreur : " + e);

    }

  };

});
