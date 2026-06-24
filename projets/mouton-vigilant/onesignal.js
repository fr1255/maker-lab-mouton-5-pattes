window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {

    const boutonActiver = document.getElementById("activerNotifications");
    const etatParam = document.getElementById("etatNotifications");

    const etatMouton = document.getElementById("etatNotificationsMouton");
    const boutonTest = document.getElementById("testerNotification");

    function mettreAJourEtat() {

        if (OneSignal.Notifications.permission) {

            if (etatParam)
                etatParam.textContent = "🟢 Notifications activées";

            if (etatMouton)
                etatMouton.textContent = "🟢 Notifications activées";

        } else {

            if (etatParam)
                etatParam.textContent = "🔴 Notifications désactivées";

            if (etatMouton)
                etatMouton.textContent = "🔴 Notifications désactivées";

        }

    }

    mettreAJourEtat();

    if (boutonActiver) {

        boutonActiver.addEventListener("click", async function () {

            try {

                if (etatParam)
                    etatParam.textContent = "🟡 Activation en cours...";

                await OneSignal.Notifications.requestPermission();

                if (!OneSignal.Notifications.permission) {

                    mettreAJourEtat();
                    return;

                }

                await OneSignal.User.PushSubscription.optIn();

                setTimeout(function () {

                    const id = OneSignal.User.PushSubscription.id;

                    if (id) {

                        mettreAJourEtat();

                        boutonActiver.textContent =
                            "🔔 Notifications activées";

                    } else {

                        if (etatParam)
                            etatParam.textContent =
                                "⚠️ Abonnement non créé";

                    }

                }, 2000);

            } catch (e) {

                console.error(e);

                alert("Erreur OneSignal : " + e);

            }

        });

    }

    if (boutonTest) {

        boutonTest.addEventListener("click", function () {

            alert(
                "🎉 Les notifications sont prêtes !\n\nLa prochaine étape consiste à envoyer une vraie notification de test depuis OneSignal."
            );

        });

    }

});
