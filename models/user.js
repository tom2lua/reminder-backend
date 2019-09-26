const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 6
  },
  passwordHash: String,
  firstName: String,
  lastName: String,
  birthday: Date,
  email: {
    type: String,
    unique: true
  },
  settings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Settings'
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)
