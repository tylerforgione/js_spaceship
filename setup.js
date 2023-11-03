document.addEventListener("DOMContentLoaded", function () {
  const setupForm = document.getElementById("setupForm");

  setupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve player information from the form
    const subject = document.getElementById("subject").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const handedness = document.getElementById("handedness").value;

    // Store the player information or pass it to your game initialization function
    // For example, you can use localStorage or variables to store this data

    // Redirect to the main game screen
  });

  // Inside your setup.js
  setupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      subject: document.getElementById("subject").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      handedness: document.getElementById("handedness").value,
    };

    // Make an HTTP POST request to your server to save the data
    fetch("http://localhost:3000/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Form data saved successfully");
          // Redirect or perform other actions as needed
          window.location.href = "please.html";
        } else {
          console.error("Failed to save form data");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
