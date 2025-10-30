document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#adoptionForm");
  const petGrid = document.querySelector(".pet-grid");
  const searchBar = document.querySelector("#searchPets");
  const uploadArea = document.querySelector("#uploadArea");
  const fileInput = document.querySelector("#petImage");
  const fileName = document.querySelector("#fileName");
  const previewImg = document.querySelector("#previewImg");
  const uploadBtn = document.querySelector(".upload-btn");
  const formMessage = document.querySelector("#formMessage");

  // Store pets from backend
  let pets = [];

  // Upload area click
  uploadArea.addEventListener("click", () => fileInput.click());
  uploadBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  // Drag & drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#2575fc";
    uploadArea.style.backgroundColor = "#f0f8ff";
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "#ccc";
    uploadArea.style.backgroundColor = "transparent";
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#ccc";
    uploadArea.style.backgroundColor = "transparent";
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelection(e.dataTransfer.files[0]);
    }
  });

  // File input change
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length) {
      handleFileSelection(fileInput.files[0]);
    }
  });

  function handleFileSelection(file) {
    if (!file.type.match("image.*")) {
      showMessage("Please select a valid image file", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image must be less than 5MB", "error");
      return;
    }
    fileName.textContent = `Selected: ${file.name}`;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  // Form submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Form submission started");
      
      const petName = document.querySelector("#petName").value.trim();
      const animalType = document.querySelector("#animalType").value;
      const breed = document.querySelector("#breed").value.trim() || "Mixed";
      const age = document.querySelector("#age").value || "Not specified";
      const gender = document.querySelector("#gender").value || "Not specified";
      const description = document.querySelector("#description").value.trim();
      const contact = document.querySelector("#contact").value.trim();

      // Validate form
      if (!petName || !animalType || !description || !contact) {
        showMessage("Please fill in all required fields", "error");
        return;
      }

      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("petName", petName);
      formData.append("animalType", animalType);
      formData.append("breed", breed);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("description", description);
      formData.append("contact", contact);
      
      if (fileInput.files[0]) {
        formData.append("petImage", fileInput.files[0]);
        console.log("Image file added to form data");
      } else {
        console.log("No image file selected");
      }

      // Submit to backend - UPDATED URL
      fetch("https://pawconnect-u65b.onrender.com/api/pets", {
        method: "POST",
        body: formData
      })
      .then(response => {
        console.log("Response received", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data received", data);
        if (data.error) {
          showMessage(data.error, "error");
        } else {
          showMessage("Pet added successfully!", "success");
          form.reset();
          fileName.textContent = "";
          previewImg.style.display = "none";
          loadPets(); // Reload pets from backend
        }
      })
      .catch(error => {
        console.error("Error:", error);
        showMessage("Error adding pet. Please try again.", "error");
      });
    });
  }

  // Load pets from backend - UPDATED URL
  function loadPets() {
    console.log("Loading pets from backend");
    fetch("https://pawconnect-u65b.onrender.com/api/pets")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Pets loaded:", data);
        pets = data;
        renderPets(pets);
      })
      .catch(error => {
        console.error("Error loading pets:", error);
        petGrid.innerHTML = `<p>Error loading pets. Please try again later.</p>`;
      });
  }

  // Show message
  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = type;
    setTimeout(() => {
      formMessage.textContent = "";
      formMessage.className = "";
    }, 5000);
  }

  // Render pets
  function renderPets(petArray) {
    petGrid.innerHTML = "";
    if (petArray.length === 0) {
      petGrid.innerHTML = `<p class="no-pets">No pets available for adoption 🐾</p>`;
      return;
    }
    petArray.forEach((pet) => {
      const petCard = document.createElement("article");
      petCard.classList.add("pet-card");
      petCard.dataset.id = pet.id;
      petCard.innerHTML = `
        <div class="pet-image">
          <img src="${pet.imageData}" alt="${pet.petName}">
        </div>
        <div class="pet-info">
          <h4>${pet.petName}</h4>
          <p><strong>Type:</strong> ${pet.animalType}</p>
          <p><strong>Breed:</strong> ${pet.breed}</p>
          <p><strong>Age:</strong> ${pet.age}</p>
          <p><strong>Gender:</strong> ${pet.gender}</p>
          <p><strong>Description:</strong> ${pet.description}</p>
          <p><strong>Contact:</strong> ${pet.contact}</p>
          <div class="adopt-actions">
            <button class="adopt-btn">Adopt</button>
            <button class="foster-btn">Foster</button>
            <button class="remove-btn">Remove</button>
          </div>
        </div>
      `;
      petCard.querySelector(".adopt-btn").addEventListener("click", () => {
        alert(`You chose to adopt ${pet.petName}! 🐾 Contact: ${pet.contact}`);
      });
      petCard.querySelector(".foster-btn").addEventListener("click", () => {
        alert(`You chose to foster ${pet.petName}! 🐾 Contact: ${pet.contact}`);
      });
      petCard.querySelector(".remove-btn").addEventListener("click", () => {
        if (confirm(`Are you sure you want to remove ${pet.petName} from the adoption list?`)) {
          removePet(pet.id);
        }
      });
      petGrid.appendChild(petCard);
    });
  }

  // Remove pet from backend - UPDATED URL
  function removePet(petId) {
    fetch(`https://pawconnect-u65b.onrender.com/api/pets/${petId}`, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        alert("Error removing pet: " + data.error);
      } else {
        showMessage("Pet removed successfully", "success");
        loadPets(); // Reload pets from backend
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error removing pet. Please try again.");
    });
  }

  // Search filter
  searchBar.addEventListener("input", (e) => {
    const search = e.target.value.toLowerCase();
    const filtered = pets.filter(
      (pet) =>
        pet.petName.toLowerCase().includes(search) ||
        pet.animalType.toLowerCase().includes(search) ||
        pet.breed.toLowerCase().includes(search) ||
        pet.description.toLowerCase().includes(search)
    );
    renderPets(filtered);
  });

  // Initial load of pets
  loadPets();
});