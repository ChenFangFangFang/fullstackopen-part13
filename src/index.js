require('dotenv').config()
require('express-async-errors')
const express = require('express')
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const { errorHandler } = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const app = express()

app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()