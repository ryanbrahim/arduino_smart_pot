// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")

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
  console.log(`Moisture level: ${req.body.data} at ${req.body.published_at}`)
  res.status(200).end() // Responding is important
})