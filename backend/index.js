const PORT = 7733

const express = require('express'),
  app = express(),
  cors = require('cors')

app.use(cors())
app.use(express.json())

app.listen(PORT, () => console.log(`Running on ${PORT}`))
