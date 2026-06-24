window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {

    const bouton = document.getElementById("activerNotifications");
    const etat = document.getElementById("etatNotifications");

    if (!bouton || !etat) return;

    // Affichage de l'état au démarrage
    try {

        if (OneSignal.Notifications.permission) {

            etat.textContent = "✅ Notifications autorisées";

        } else {

            etat.textContent = "Notifications non activées";

        }

    } catch (e) {
        console.log(e);
    }

    bouton.addEventListener("click", async function () {

        try {

            etat.textContent = "Activation en cours...";

            await OneSignal.Notifications.requestPermission();

            if (!OneSignal.Notifications.permission) {

                etat.textContent = "❌ Permission refusée";

                return;

            }

            await OneSignal.User.PushSubscription.optIn();

            setTimeout(async () => {

                const id = OneSignal.User.PushSubscription.id;
                const token = OneSignal.User.PushSubscription.token;
                const optedIn = OneSignal.User.PushSubscription.optedIn;

                console.log("Subscription ID :", id);
                console.log("Token :", token);
                console.log("Opted In :", optedIn);

                alert(
                    "Permission : " + OneSignal.Notifications.permission +
                    "\nOptIn : " + optedIn +
                    "\nID : " + id +
                    "\nToken : " + token
                );

                if (id) {

                    etat.textContent = "✅ Notifications activées";
                    bouton.textContent = "🔔 Notifications activées";

                } else {

                    etat.textContent = "⚠️ Permission accordée mais aucun abonnement créé.";

                }

            }, 3000);

        } catch (e) {

            console.error(e);

            alert("Erreur : " + e);

            etat.textContent = "⚠️ Erreur OneSignal";

        }

    });

});
