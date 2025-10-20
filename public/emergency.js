// emergency.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#emergencyForm");
    const alertList = document.querySelector("#alertList");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Collect form values
            const alertType = document.querySelector("#alertType").value;
            const location = document.querySelector("#location").value;
            const details = document.querySelector("#details").value;
            const contact = document.querySelector("#contact").value;

            // Create alert card
            const alertCard = document.createElement("article");
            alertCard.classList.add("alert-card", alertType);
            alertCard.innerHTML = `
                <h3>🚨 ${alertType.toUpperCase()} ALERT</h3>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Details:</strong> ${details}</p>
                <p><strong>Contact:</strong> ${contact}</p>
                <button class="dismiss-btn">Dismiss</button>
            `;

            // Replace "no alerts" message if present
            if (alertList.querySelector("p")) {
                alertList.innerHTML = "";
            }

            // Add new alert to board
            alertList.appendChild(alertCard);

            // Clear form
            form.reset();

            // Dismiss button
            alertCard.querySelector(".dismiss-btn").addEventListener("click", () => {
                alertCard.remove();

                // If no alerts remain, show placeholder text
                if (alertList.children.length === 0) {
                    alertList.innerHTML = <p>No active alerts right now 🚦</p>;
                }
            });
        });
    }
});