// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs')

// Open file for logging


// Initialize express and define a port
const app = express()
const PORT = 25565

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

// Testing express server
app.get('/', (req, res) => {
  res.status(200).send(JSON.stringify({
    msg: 'Express Server Works!'
  }))
})

// Define webhook
app.use(bodyParser.json())
app.post("/hook", (req, res) => {
  // console.log(`Got a POST: ${JSON.stringify(req.body, null, 2)}`) // Call your action on the request here
  let moisture_level_data = req.body.data;
  let timestamp = req.body.published_at;
  console.log(`Moisture level: ${moisture_level_data} at ${timestamp}`)

  let logger = fs.createWriteStream('moisture_data.csv', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })
  logger.write(`${moisture_level_data}, ${timestamp}\n`)
  logger.end()
  res.status(200).end() // Responding is important
})