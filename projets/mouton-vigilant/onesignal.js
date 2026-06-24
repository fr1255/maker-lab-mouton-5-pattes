window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: "33afb21b-f145-4372-ae00-b7f5f656e025",
    notifyButton: {
      enable: false
    },
    serviceWorkerPath: "OneSignalSDKWorker.js",
    serviceWorkerParam: {
      scope: "./"
    }
  });

  const bouton = document.getElementById("activerNotifications");
  const etat = document.getElementById("etatNotifications");

  if (!bouton || !etat) return;

  bouton.addEventListener("click", async function () {
    try {
      etat.textContent = "Activation en cours...";

      await OneSignal.Slidedown.promptPush();

      setTimeout(async function () {
        const permission = OneSignal.Notifications.permission;

        if (permission) {
          etat.textContent = "✅ Notifications activées";
          bouton.textContent = "🔔 Notifications activées";
        } else {
          etat.textContent = "Notifications non activées";
        }
      }, 3000);

    } catch (e) {
      console.error(e);
      etat.textContent = "⚠️ Erreur OneSignal";
    }
  });
});
