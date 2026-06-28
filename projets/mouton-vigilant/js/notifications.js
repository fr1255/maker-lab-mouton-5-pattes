// ==============================
// Notifications - Mouton Vigilant V6
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
    if (etat2) etat2.textContent = "🟢 Notifications activées";
  } else {
    if (etat1) etat1.textContent = "Notifications non activées";
    if (etat2) etat2.textContent = "Notifications non activées";
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

async function testerNotification() {
  try {
    if (!window.MOUTON_ONESIGNAL_ID) {
      alert("Active d'abord les notifications, puis réessaie.");
      return;
    }

    const maintenantUTC = new Date();
    maintenantUTC.setUTCMinutes(maintenantUTC.getUTCMinutes() + 2);

    const heureTest =
      String(maintenantUTC.getUTCHours()).padStart(2, "0") +
      ":" +
      String(maintenantUTC.getUTCMinutes()).padStart(2, "0");

    const medicamentTest = {
      id: "test-mouton",
      nom: "Test Mouton Vigilant",
      heure: heureTest,
      nombre: "Notification de test",
      date: new Date().toISOString().slice(0, 10),
      test: true
    };

    medicaments = medicaments.filter(med => med.id !== "test-mouton");
    medicaments.push(medicamentTest);

    sauvegarder();

    alert(
      "🐑 Test programmé.\n\n" +
      "La notification doit arriver dans environ 2 minutes.\n\n" +
      "Heure envoyée au serveur : " + heureTest
    );

    setTimeout(() => {
      medicaments = medicaments.filter(med => med.id !== "test-mouton");
      sauvegarder();
    }, 10 * 60 * 1000);

  } catch (e) {
    console.error("Erreur test notification :", e);
    alert("Erreur pendant le test de notification.");
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
    boutonTesterNotification.addEventListener("click", testerNotification);
  }

  mettreAJourEtatNotifications();
}
