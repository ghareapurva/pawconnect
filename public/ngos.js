// ngos.js

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector("#ngoSearch");
    const ngoCards = document.querySelectorAll(".ngo-card");

    // Search functionality (by name or location)
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();
            ngoCards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(query) ? "block" : "none";
            });
        });
    }

    // Placeholder: NGO details popup (future expansion)
    ngoCards.forEach(card => {
        card.addEventListener("click", () => {
            alert(More info about ${card.querySelector("h3").innerText} coming soon 🐾);
        });
    });
});