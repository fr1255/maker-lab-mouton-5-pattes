// ==============================
// Notifications - Mouton Vigilant V6
// Diagnostic simple utilisateur
// ==============================

window.OneSignalDeferred = window.OneSignalDeferred || [];
window.MOUTON_ONESIGNAL_ID = null;

OneSignalDeferred.push(async function (OneSignal) {
  try {
    await OneSignal.init({
      appId: "33afb21b-f145-4372-ae00-b7f5f656e025",
      notifyButton: { enable: false }
    });

    console.log("🐑 OneSignal initialisé");

    setTimeout(() => {
      const id = OneSignal.User?.PushSubscription?.id || null;
      window.MOUTON_ONESIGNAL_ID = id;
      console.log("🐑 OneSignal ID téléphone :", id);
    }, 1500);

    mettreAJourEtatNotifications();

  } catch (e) {
    console.error("Erreur OneSignal :", e);
  }
});

function mettreAJourEtatNotifications() {
  const etat1 = document.getElementById("etatNotifications");
  const etat2 = document.getElementById("etatNotificationsMouton");

  const permissionOk = window.OneSignal?.Notifications?.permission;

  if (permissionOk) {
    if (etat1) etat1.textContent = "🟢 Notifications activées";
    if (etat2) etat2.textContent = "🟢 Je veille sur vous";
  } else {
    if (etat1) etat1.textContent = "Notifications non activées";
    if (etat2) etat2.textContent = "🔴 Une vérification est conseillée";
  }
}

async function activerNotifications() {
  const OneSignal = window.OneSignal;

  if (!OneSignal) {
    alert("OneSignal n'est pas encore chargé.");
    return;
  }

  try {
    await OneSignal.Notifications.requestPermission();
    mettreAJourEtatNotifications();

    setTimeout(() => {
      const id = OneSignal.User?.PushSubscription?.id || null;
      window.MOUTON_ONESIGNAL_ID = id;
      console.log("🐑 OneSignal ID téléphone :", id);
    }, 1500);

    if (OneSignal.Notifications.permission) {
      alert("✅ Notifications activées.");
    } else {
      alert("Les notifications n'ont pas été autorisées.");
    }

  } catch (e) {
    console.error(e);
    alert("Erreur lors de l'activation des notifications.");
  }
}

async function verifierLeMouton() {
  const etat = document.getElementById("etatNotificationsMouton");
  const bouton = document.getElementById("testerNotification");

  if (etat) etat.textContent = "🐑 Vérification en cours...";
  if (bouton) bouton.disabled = true;

  try {
    if (!navigator.onLine) {
      if (etat) etat.textContent = "🔴 Pas de connexion Internet";

      alert(
        "🐑 Je ne peux pas joindre le service.\n\n" +
        "Vérifiez votre connexion Internet puis réessayez."
      );
      return;
    }

    const reponse = await fetch(
      "https://mouton-vigilant-server.fr12andco55.workers.dev/health"
    );

    if (!reponse.ok) {
      if (etat) etat.textContent = "🔴 Service indisponible";

      alert(
        "🐑 Le service de rappel est momentanément indisponible.\n\n" +
        "Réessayez dans quelques minutes."
      );
      return;
    }

    const data = await reponse.json();

    if (!data.ok) {
      if (etat) etat.textContent = "🔴 Service indisponible";

      alert(
        "🐑 Le service de rappel est momentanément indisponible.\n\n" +
        "Réessayez dans quelques minutes."
      );
      return;
    }

    const permissionOk = window.OneSignal?.Notifications?.permission;

    if (!permissionOk) {
      if (etat) etat.textContent = "🔴 Notifications non activées";

      alert(
        "🐑 Je ne peux pas encore vous prévenir.\n\n" +
        "Appuyez sur « Activer les notifications » dans les paramètres."
      );
      return;
    }

    let id = window.OneSignal?.User?.PushSubscription?.id || null;

    if (!id) {
      id = window.MOUTON_ONESIGNAL_ID;
    }

    if (!id) {
      if (etat) etat.textContent = "🟠 Téléphone en cours d'enregistrement";

      alert(
        "🐑 Votre téléphone n'est pas encore prêt.\n\n" +
        "Attendez quelques secondes puis réessayez."
      );
      return;
    }

    window.MOUTON_ONESIGNAL_ID = id;

    if (etat) etat.textContent = "🟢 Je veille sur vous";

    alert(
      "🐑 Tout est prêt !\n\n" +
      "Je veille bien sur vos médicaments."
    );

  } catch (e) {
    console.error("Diagnostic Mouton :", e);

    if (etat) etat.textContent = "🔴 Vérification impossible";

    alert(
      "🐑 Je n'arrive pas à vérifier les notifications.\n\n" +
      "Réessayez dans quelques minutes."
    );

  } finally {
    if (bouton) bouton.disabled = false;
  }
}

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

    element.style.transition = "all 0.3s";
    element.style.border = "3px solid #4CAF50";
    element.style.borderRadius = "12px";
    element.style.background = "#E8F5E9";
    element.style.padding = "8px";

    const bouton = element.querySelector("button");
    if (bouton) bouton.focus();

  }, 400);
}

function initialiserNotifications() {
  const boutonActiverNotifications = document.getElementById("activerNotifications");
  const boutonTesterNotification = document.getElementById("testerNotification");

  if (boutonActiverNotifications) {
    boutonActiverNotifications.addEventListener("click", activerNotifications);
  }

  if (boutonTesterNotification) {
    boutonTesterNotification.textContent =
      "🐑 Vérifier que le mouton veille bien sur moi";

    boutonTesterNotification.addEventListener("click", verifierLeMouton);
  }

  mettreAJourEtatNotifications();
}
