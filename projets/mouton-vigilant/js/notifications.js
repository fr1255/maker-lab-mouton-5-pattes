// ==============================
// Notifications - Mouton Vigilant V7
// Vérification simple + vraie notification de test
// ==============================

window.OneSignalDeferred = window.OneSignalDeferred || [];
window.MOUTON_ONESIGNAL_ID = null;

const SERVEUR_MOUTON = "https://mouton-vigilant-server.fr12andco55.workers.dev";

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
    return false;
  }

  try {
    const etat = document.getElementById("etatNotifications");

    if (etat) etat.textContent = "🟡 Activation en cours...";

    await OneSignal.Notifications.requestPermission();

    if (!OneSignal.Notifications.permission) {
      mettreAJourEtatNotifications();
      alert("Les notifications n'ont pas été autorisées.");
      return false;
    }

    await OneSignal.User.PushSubscription.optIn();

    await new Promise(resolve => setTimeout(resolve, 2000));

    const id = OneSignal.User?.PushSubscription?.id || null;
    window.MOUTON_ONESIGNAL_ID = id;

    console.log("🐑 OneSignal ID téléphone :", id);

    mettreAJourEtatNotifications();

    alert("✅ Notifications activées.");

    return true;

  } catch (e) {
    console.error("Erreur activation notifications :", e);
    alert("Erreur lors de l'activation des notifications.");
    return false;
  }
}
async function verifierQueLeMoutonVeille() {
  const etat = document.getElementById("etatNotificationsMouton");
  const bouton = document.getElementById("testerNotification");

  if (etat) etat.textContent = "🐑 Vérification en cours...";
  if (bouton) bouton.disabled = true;

  try {
    // 1. Internet
    if (!navigator.onLine) {
      if (etat) etat.textContent = "🔴 Pas de connexion Internet";
      alert("🐑 Je ne peux pas joindre le service.\n\nVérifiez votre connexion Internet puis réessayez.");
      return;
    }

    // 2. Serveur
    const health = await fetch(SERVEUR_MOUTON + "/health");

    if (!health.ok) {
      if (etat) etat.textContent = "🔴 Service indisponible";
      alert("🐑 Le service de rappel est momentanément indisponible.\n\nRéessayez dans quelques minutes.");
      return;
    }

    const healthData = await health.json();

    if (!healthData.ok) {
      if (etat) etat.textContent = "🔴 Service indisponible";
      alert("🐑 Le service de rappel est momentanément indisponible.\n\nRéessayez dans quelques minutes.");
      return;
    }

    // 3. OneSignal chargé
    const OneSignal = window.OneSignal;

    if (!OneSignal) {
      if (etat) etat.textContent = "🟠 Service de notification en chargement";
      alert("🐑 Les notifications ne sont pas encore prêtes.\n\nAttendez quelques secondes puis réessayez.");
      return;
    }

    // 4. Permission notifications
    if (!OneSignal.Notifications.permission) {
      const ok = await activerNotifications();

      if (!ok) {
        if (etat) etat.textContent = "🔴 Notifications non activées";
        alert("🐑 Je ne peux pas encore vous prévenir.\n\nAutorisez les notifications pour que je puisse veiller sur vos médicaments.");
        return;
      }
    }

    // 5. Récupération ID téléphone
    let onesignalId =
      OneSignal.User?.PushSubscription?.id ||
      window.MOUTON_ONESIGNAL_ID ||
      null;

    if (!onesignalId) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      onesignalId =
        OneSignal.User?.PushSubscription?.id ||
        window.MOUTON_ONESIGNAL_ID ||
        null;
    }

    if (!onesignalId) {
      if (etat) etat.textContent = "🟠 Téléphone en cours d'enregistrement";
      alert("🐑 Votre téléphone n'est pas encore prêt.\n\nAttendez quelques secondes puis réessayez.");
      return;
    }

    window.MOUTON_ONESIGNAL_ID = onesignalId;

    // 6. Vraie notification de test
    const reponse = await fetch(SERVEUR_MOUTON + "/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        onesignal_id: onesignalId
      })
    });

    const resultat = await reponse.json();

    if (!resultat.ok) {
      console.error("Erreur test notification :", resultat);

      if (etat) etat.textContent = "🔴 Notification impossible";

      alert("🐑 Je n'arrive pas à envoyer la notification de test.\n\nRéessayez dans quelques minutes.");
      return;
    }

    // 7. Succès
    const maintenant = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });

    if (etat) {
      etat.textContent = "🟢 Je veille sur vous";
      etat.dataset.derniereVerification = maintenant;
    }

    localStorage.setItem("mouton_derniere_verification", maintenant);

    alert(
      "🐑 Tout est prêt !\n\n" +
      "Je veille bien sur vos médicaments.\n\n" +
      "Une notification de test va arriver."
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

async function testerNotification() {
  await verifierQueLeMoutonVeille();
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

    boutonTesterNotification.addEventListener("click", verifierQueLeMoutonVeille);
  }

  mettreAJourEtatNotifications();
}
