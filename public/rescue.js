// rescue.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#rescueReportForm");
    const rescueCasesSection = document.querySelector(".rescue-cases");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Get form values
            const animalType = document.querySelector("#animalType").value;
            const location = document.querySelector("#location").value;
            const description = document.querySelector("#description").value;
            const contact = document.querySelector("#contact").value;

            // Create new rescue case card
            const newCase = document.createElement("article");
            newCase.classList.add("rescue-card");
            newCase.innerHTML = `
                <h4>${animalType}</h4>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Reported By:</strong> ${contact}</p>
                <div class="rescue-actions">
                    <button class="respond-btn">Respond</button>
                    <button class="resolve-btn">Mark as Resolved</button>
                </div>
            `;

            // Append to rescue cases section
            rescueCasesSection.appendChild(newCase);

            // Clear form
            form.reset();

            // Respond button functionality
            newCase.querySelector(".respond-btn").addEventListener("click", () => {
                alert(Thank you for responding to the ${animalType} case 🐾);
            });

            // Resolve button functionality
            newCase.querySelector(".resolve-btn").addEventListener("click", () => {
                newCase.style.opacity = "0.6";
                newCase.style.background = "#d4edda"; // soft green
                newCase.querySelector(".resolve-btn").disabled = true;
                newCase.querySelector(".resolve-btn").innerText = "Resolved ✅";
            });
        });
    }
});