// lostfound.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#lostFoundForm");
    const reportsSection = document.querySelector(".lostfound-list");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Get form values
            const status = document.querySelector("#status").value;
            const petName = document.querySelector("#petName").value || "Unknown";
            const animalType = document.querySelector("#animalType").value;
            const location = document.querySelector("#location").value;
            const description = document.querySelector("#description").value;
            const contact = document.querySelector("#contact").value;

            // Create report card
            const reportCard = document.createElement("article");
            reportCard.classList.add("report-card");
            reportCard.innerHTML = `
                <h4>${status} Pet</h4>
                <p><strong>Name:</strong> ${petName}</p>
                <p><strong>Type:</strong> ${animalType}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Contact:</strong> ${contact}</p>
                <div class="report-actions">
                    <button class="contact-btn">Contact Reporter</button>
                    <button class="resolve-btn">Mark as Reunited</button>
                </div>
            `;

            // Add report card to section
            reportsSection.appendChild(reportCard);

            // Clear form
            form.reset();

            // Contact button functionality
            reportCard.querySelector(".contact-btn").addEventListener("click", () => {
                alert(Please reach out to: ${contact});
            });

            // Resolve button functionality
            reportCard.querySelector(".resolve-btn").addEventListener("click", () => {
                reportCard.style.opacity = "0.6";
                reportCard.style.background = "#d4edda"; // soft green
                reportCard.querySelector(".resolve-btn").disabled = true;
                reportCard.querySelector(".resolve-btn").innerText = "Reunited ✅";
            });
        });
    }
});