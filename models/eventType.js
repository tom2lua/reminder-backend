const mongoose = require('mongoose')

const eventTypeSchema = mongoose.Schema({
  name: String,
  iconClass: String,
  representColor: String
})

eventTypeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('EventType', eventTypeSchema)
