const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const recipeRoutes = require('./routes/recipes.routes')
const userRoutes = require('./routes/users.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/healthz', (req, res) => {
  res.status(200).send('OK')
})

app.use('/', authRoutes)
app.use('/recipes', recipeRoutes)
app.use('/users', userRoutes)

module.exports = { app }
