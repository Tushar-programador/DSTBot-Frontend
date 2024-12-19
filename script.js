document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-form");
  const spinner = document.getElementById("spinner");
  const rowsContainer = document.getElementById("rowsContainer");
  const addRowBtn = document.getElementById("addRowBtn");
  const basedURL = "https://dst-bot-ff9l.onrender.com";

  // Initialize Quill.js
  const quill = new Quill("#quill-editor", {
    theme: "snow",
  });

  // Add new button row
  addRowBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "input-row mb-3";
    row.innerHTML = `
      <div class="row g-3 align-items-center">
        <div class="col-auto">
          <input type="text" class="form-control" placeholder="Button Text" />
        </div>
        <div class="col-auto">
          <input type="url" class="form-control" placeholder="Button URL" />
        </div>
        <div class="col-auto">
          <button type="button" class="btn btn-danger remove-row">Remove</button>
        </div>
      </div>
    `;
    rowsContainer.appendChild(row);

    // Remove button row
    row.querySelector(".remove-row").addEventListener("click", () => {
      row.remove();
    });
  });

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show spinner
    spinner.style.display = "flex";

    try {
      const caption = quill.root.innerHTML.trim();
      const imageInput = document.getElementById("imageInput");
      const image = imageInput.files[0];
      const passwordInput = document.getElementById("passwordInput");
      const password = passwordInput.value.trim(); // Get the password value

      console.log("Caption:", caption);
      console.log("Image:", image);
      console.log("Password:", password);

      if (caption === "<p><br></p>" && !image) {
        console.log("Validation failed: No caption or image provided.");
        alert("Please provide either a caption or an image.");
        spinner.style.display = "none";
        return; // Stop further execution
      }

      if (!password) {
        console.log("Validation failed: Password is required.");
        alert("Password must be provided.");
        spinner.style.display = "none";
        return; // Stop further execution
      }

      const buttons = [];
      const rows = rowsContainer.querySelectorAll(".input-row");
      rows.forEach((row) => {
        const textInput = row.querySelector("input[type='text']").value.trim();
        const urlInput = row.querySelector("input[type='url']").value.trim();
        if (textInput && urlInput) {
          buttons.push({ text: textInput, url: urlInput });
        }
      });

      const formData = new FormData();
      formData.append("caption", caption);
      if (image) formData.append("image", image);
      formData.append("password", password); // Append the password
      formData.append("buttons", JSON.stringify(buttons));

      const response = await fetch(`${basedURL}/send-message`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      const data = await response.json();
      console.log("Success:", data);
      alert("Message sent");

      form.reset();
      quill.root.innerHTML = "";
      rowsContainer.innerHTML = "";
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      spinner.style.display = "none"; // Hide spinner
    }
  });
});
