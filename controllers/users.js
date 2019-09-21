const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('events', {
    name: 1,
    date: 1,
    description: 1,
    location: 1,
    startTime: 1,
    endTime: 1,
    user: 1,
    repeatOption: 1
  })
  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (body.password.length < 3)
    return response
      .status(400)
      .json({ error: 'password must be at least 3 character long' })
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      birthday: body.birthday ? body.birthday : null,
      email: body.email,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter
