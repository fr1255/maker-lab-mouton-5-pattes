// ==============================
// Navigation - Mouton Vigilant V5
// ==============================

function changerPage(page) {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });

  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const section = document.getElementById("page-" + page);
  const bouton = document.querySelector(`[data-page="${page}"]`);

  if (section) section.classList.add("active");
  if (bouton) bouton.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initialiserNavigation() {
  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.addEventListener("click", () => changerPage(btn.dataset.page));
  });
}
