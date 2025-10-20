// health.js

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector("#healthSearch");
    const articles = document.querySelectorAll(".health-resources article");

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();
            articles.forEach(article => {
                const text = article.innerText.toLowerCase();
                article.style.display = text.includes(query) ? "block" : "none";
            });
        });
    }

    // Placeholder "Read More" functionality
    const readMoreButtons = document.querySelectorAll(".health-resources button");
    readMoreButtons.forEach(button => {
        button.addEventListener("click", () => {
            alert("Full article feature coming soon 🐾");
        });
    });
});