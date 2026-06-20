<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0b1220">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Mouton Vigilant">
  <title>Mouton Vigilant</title>
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="images/apple-touch-icon.png">
  <link rel="icon" type="image/png" href="images/favicon.png">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app-shell">
    <header class="hero">
      <img src="images/logo.png" alt="Logo Mouton Vigilant" class="app-logo">
      <div>
        <p class="badge">Application santé • PWA hors-ligne</p>
        <h1>Mouton Vigilant</h1>
        <p class="subtitle">N’oubliez plus jamais votre traitement.</p>
      </div>
    </header>

    <main>
      <section id="screen-home" class="screen active">
        <div class="top-line">
          <div>
            <h2>Aujourd’hui</h2>
            <p id="todayLabel" class="muted"></p>
          </div>
          <button id="resetToday" class="ghost">Réinitialiser</button>
        </div>

        <div id="medList" class="med-list"></div>

        <article class="card vitamin-card">
          <div>
            <p class="time">Vitamine D</p>
            <h3>Colécalciférol</h3>
            <p id="vitaminLabel" class="muted"></p>
          </div>
          <button id="takeVitamin" class="pill-button">Pris</button>
        </article>

        <article class="card info-card">
          <h3>Installation sur iPhone</h3>
          <p>Dans Safari : <strong>Partager</strong> → <strong>Sur l’écran d’accueil</strong>.</p>
          <p class="muted">Une fois chargée, l’application reste disponible hors-ligne.</p>
        </article>
      </section>

      <section id="screen-history" class="screen">
        <h2>Historique</h2>
        <div id="historyList" class="history-list"></div>
      </section>

      <section id="screen-settings" class="screen">
        <h2>Réglages</h2>
        <article class="card">
          <h3>Horaires</h3>
          <form id="settingsForm" class="settings-form"></form>
          <button id="saveSettings" class="primary">Enregistrer</button>
        </article>
        <article class="card">
          <h3>Notifications</h3>
          <p class="muted">Sur iPhone, une PWA ne peut pas toujours déclencher des notifications locales si elle est fermée. Cette V1 garde surtout l’historique hors-ligne. Les rappels natifs seront une étape suivante.</p>
          <button id="askNotification" class="ghost">Tester notification</button>
        </article>
        <article class="card">
          <h3>Site</h3>
          <a class="site-link" href="https://fr1255.github.io/maker-lab-mouton-5-pattes/">Le Mouton à 5 Pattes</a>
        </article>
      </section>
    </main>

    <nav class="bottom-nav" aria-label="Navigation principale">
      <button class="nav-btn active" data-screen="home">Accueil</button>
      <button class="nav-btn" data-screen="history">Historique</button>
      <button class="nav-btn" data-screen="settings">Réglages</button>
    </nav>
  </div>
  <script src="app.js"></script>
</body>
</html>
