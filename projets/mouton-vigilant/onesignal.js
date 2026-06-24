window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {
  alert("OneSignal démarre");

  await OneSignal.init({
    appId: "33afb21b-f145-4372-ae00-b7f5f656e025"
  });

  alert("OneSignal initialisé");

  const bouton = document.getElementById("activerNotifications");

  bouton.onclick = async function () {
    alert("Bouton cliqué");
    await OneSignal.Notifications.requestPermission();
    alert("Permission : " + OneSignal.Notifications.permission);
  };
});
