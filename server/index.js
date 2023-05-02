// Require express and body-parser
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");

// Connect to database
const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

// Create table if needed
sql = `CREATE TABLE IF NOT EXISTS moisture_series(id INTEGER PRIMARY KEY, moisture, timestamp)`;
db.run(sql);

// Initialize express and define a port
const app = express();
const PORT = 25565;

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Testing express server
app.get("/", (req, res) => {
  res.status(200).send(
    JSON.stringify({
      msg: "Express Server Works!",
    })
  );
});

// Define webhook
app.use(bodyParser.json());
app.post("/hook", (req, res) => {
  // console.log(`Got a POST: ${JSON.stringify(req.body, null, 2)}`) // Call your action on the request here
  let moisture_level_data = req.body.data;
  let timestamp = req.body.published_at;
  console.log(`Moisture level: ${moisture_level_data} at ${timestamp}`);

  // Insert data to table
  sql = `INSERT INTO moisture_series(moisture, timestamp) VALUES (?,?)`;
  db.run(sql, [moisture_level_data, timestamp], (err) => {
    if (err) return console.error(err.message);
  });

  res.status(200).end(); // Responding is important
});


// HTTP GET data from database
app.get("/data", async (req, res) => {
  console.log("\n------- Handling data request! -------");
  // Query the database

  sql = `SELECT * FROM moisture_series`;
  db.serialize(() => {
    db.all(sql, [], (err, moisture_data) => {
      if (err) return console.error(err.message);
      console.log(` Sent '${moisture_data.length}' rows!`);
      // Send HTTP response
      res.status(200).send(
        JSON.stringify({
          data: moisture_data,
        })
      );
    });
  });
});
