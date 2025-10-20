
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#tipSearch");
  const tips = document.querySelectorAll(".tip-card");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Live search in tips
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const filter = searchInput.value.toLowerCase();
      tips.forEach(tip => {
        const text = tip.innerText.toLowerCase();
        tip.style.display = text.includes(filter) ? "block" : "none";
      });
    });
  }

  // Category filtering
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");

      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      tips.forEach(tip => {
        const categories = tip.getAttribute("data-categories");
        tip.style.display = (category === "all" || categories.includes(category)) ? "block" : "none";
      });
    });
  });

  // Toggle resources content
  document.querySelectorAll(".resource-item").forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-target");
      const content = document.getElementById(targetId);

      document.querySelectorAll(".resource-content").forEach(el => {
        if (el.id !== targetId) el.classList.remove("show");
      });

      content.classList.toggle("show");
    });
  });

  // ===== FAQ Toggle =====
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.parentElement; // .faq-item
      item.classList.toggle("active");
    });
  });
});

