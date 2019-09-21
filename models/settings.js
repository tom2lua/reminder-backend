const mongoose = require('mongoose')

const settingsSchema = mongoose.Schema({
  darkMode: {
    type: Boolean,
    default: false
  },
  startDayOfWeek: {
    type: String,
    default: 'Monday'
  }
})

settingsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Settings', settingsSchema)
