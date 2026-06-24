window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {

  alert("OneSignal démarre");

  try {

    await OneSignal.init({
      appId: "33afb21b-f145-4372-ae00-b7f5f656e025"
    });

    alert("OneSignal initialisé");

  } catch (e) {

    alert("Erreur init : " + e);

    console.error(e);

  }

});
