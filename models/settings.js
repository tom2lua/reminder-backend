const mongoose = require('mongoose')

const settingsSchema = mongoose.Schema({
  darkMode: {
    type: Boolean,
    default: false
  },
  firstDayOfWeek: {
    type: String,
    default: 'Monday'
  },
  is12HourFormat: {
    type: Boolean,
    default: true
  },
  isNotiEnabled: {
    type: Boolean,
    default: false
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
