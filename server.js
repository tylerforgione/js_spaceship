const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("mongodb").MongoClient;
const json2csv = require("json2csv").parse;
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Change this to match your client's origin.
  })
);
async function exportToCSV() {
  try {
    const data = await SpacebarPressEvent.find().lean().exec(); // Ensure this returns the desired data
    const csv = json2csv(data);
    fs.writeFileSync(`output.csv`, csv); // Use 'await' and 'fs.promises.writeFile()' for proper async handling
    console.log("Exported");
  } catch (error) {
    console.log("Error:", error);
  }
}
app.use(bodyParser.json());
setInterval(() => {
  exportToCSV();
}, 10000);
// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB URL)
mongoose.connect(
  "mongodb+srv://tylerforgione26:HMsXmBEcR9QOL4Tp@spaceshipcluster.0qqoxqa.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define a MongoDB schema and model for your data
const participantSchema = new mongoose.Schema({
  subject: String,
  age: String,
  gender: String,
  handedness: String,
});

const Participant = mongoose.model("Participant", participantSchema);

// Set up a route to handle form submissions
app.post("/submit-form", (req, res) => {
  console.log("it work");
  const formData = req.body;

  // Create a new participant document
  const participant = new Participant(formData);

  // Save the data to the database using Promises
  participant
    .save()
    .then(() => {
      res.status(200).send("Form data saved successfully");
    })
    .catch((err) => {
      console.error("Error saving data:", err);
      res.status(500).send("Internal Server Error");
    });
});

// Define a Mongoose model for spacebar press events
const SpacebarPressEvent = mongoose.model("SpacebarPressEvent", {
  timestamp: Number,
});

// Route to receive and store spacebar press events
app.post("/submit-spacebar-press", async (req, res) => {
  const { timestamp } = req.body;

  try {
    // Create a new SpacebarPressEvent document and save it to the database
    const spacebarPressEvent = new SpacebarPressEvent({ timestamp });
    await spacebarPressEvent.save();
    console.log("Spacebar press event saved successfully");
    res.sendStatus(200);
  } catch (error) {
    console.error("Failed to save spacebar press event:", error);
    res.status(500).send("Failed to save spacebar press event");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Define a schema for the questionnaire answers
const questionnaireSchema = new mongoose.Schema({
  answer: String,
  qTime: Number,
});

// Create a model based on the schema
const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Route to handle saving questionnaire answers
app.post("/submit-answer", async (req, res) => {
  try {
    const { answer, qTime } = req.body;

    // Create a new Questionnaire instance
    const questionnaire = new Questionnaire({
      answer,
      qTime,
    });

    // Save the questionnaire data to MongoDB
    await questionnaire.save();

    res.status(200).send("Questionnaire answer saved successfully");
  } catch (error) {
    console.error("Error saving questionnaire answer:", error);
    res.status(500).send("Internal Server Error");
  }
});
