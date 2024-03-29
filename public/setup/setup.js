// const { get } = require("mongoose");
document.addEventListener("DOMContentLoaded", function () {
  localStorage.clear();
  const setupForm = document.getElementById("setupForm");
  const path = window.location.pathname;
  console.log(path);

  var done = false;
  localStorage.setItem("done", done);

  var random = Math.random();
  localStorage.setItem("random", random);

  var block = 1;
  localStorage.setItem("block", block);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  localStorage.setItem("date", today);

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

  var cond;

  // Inside your setup.js
  setupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      subject: document.getElementById("subject").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      handedness: document.getElementById("handedness").value,
      date: localStorage.getItem("date"),
      cond: localStorage.getItem("cond"),
    };

    // Make an HTTP POST request to your server to save the data
    fetch("https://js-spaceship-lucy-conditions.fly.dev/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.id);
        localStorage.setItem("id", data.id);
        console.log(localStorage.getItem("id"));
        console.log("Form data saved successfully");
        switch (path) {
          case "/setup/short-1":
            window.location.href = "/short-1";
            localStorage.setItem("root", "/short-1");
            localStorage.setItem("cond", "short");
            break;
          case "/setup/short-2-15":
            window.location.href = "/short-2-15";
            localStorage.setItem("root", "/short-2-15");
            localStorage.setItem("cond", "short");
            break;
          case "/setup/short-16":
            window.location.href = "/short-16";
            localStorage.setItem("cond", "test");
            localStorage.setItem("root", "/short-16");
            break;
          case "/setup/long-1":
            window.location.href = "/long-1";
            localStorage.setItem("cond", "long");
            break;
          case "/setup/long-2":
            window.location.href = "/long-2";
            localStorage.setItem("cond", "long");
            break;
          case "/setup/long-3":
            window.location.href = "/long-3";
            localStorage.setItem("root", "/long-3");
            localStorage.setItem("cond", "test");
            break;
          default:
            window.location.href = "/short-1";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
