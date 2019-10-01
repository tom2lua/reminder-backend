const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const eventsRouter = require('./controllers/events')
const eventTypesRouter = require('./controllers/eventTypes')

logger.info('Connecting to ', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('Error connecting to MongDB:', error.message)
  })
mongoose.set('useCreateIndex', true)

//Middlewares usage:
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

//Routes usage:
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/events', eventsRouter)
app.use('/api/eventTypes', eventTypesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
