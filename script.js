const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const filterButton = document.getElementById("filterButton");
const toast = document.getElementById("toast");
const aboutButton = document.getElementById("aboutButton");

let activeFilter = "all";
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function filterCards() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  const cards = [...document.querySelectorAll(".work-card")];
  let visible = 0;

  cards.forEach((card) => {
    const text = `${card.dataset.search || ""} ${card.innerText}`.toLowerCase();
    const category = card.dataset.category || "";
    const matchesQuery = text.includes(query);
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const show = matchesQuery && matchesFilter;
    card.hidden = !show;
    if (show) visible++;
  });

  // Hide section headings when every card inside that section is filtered out.
  document.querySelectorAll(".collection-label").forEach((label) => {
    const section = label.nextElementSibling;
    if (!section) return;
    const sectionCards = [...section.querySelectorAll(".work-card")];
    label.hidden = sectionCards.length > 0 && sectionCards.every((card) => card.hidden);
  });

  emptyState.hidden = visible > 0;
}

searchInput?.addEventListener("input", filterCards);

filterButton?.addEventListener("click", () => {
  const filters = [
    { value: "all", label: "All work" },
    { value: "academics", label: "Academics" },
    { value: "learning", label: "Skill Lab" },
    { value: "projects", label: "Projects" },
  ];
  const current = filters.findIndex((item) => item.value === activeFilter);
  const next = filters[(current + 1) % filters.length];
  activeFilter = next.value;
  filterButton.innerHTML = `${next.label} <span>⌄</span>`;
  filterCards();
});

aboutButton?.addEventListener("click", () => {
  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".repo-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const url = link.dataset.url;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    showToast(`Demo link: ${link.dataset.repo || "Add your repository URL"} — edit index.html to connect your work.`);
  });
});

// Smoothly mark the current navigation section.
const navLinks = [...document.querySelectorAll(".nav-link")];
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
