const mongoose = require('mongoose')

const {Schema, model} = mongoose


const contactsSchema = new Schema({
  name: String,
  number: String,
})

contactsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  } 
})

const Contacts = model('Contacts', contactsSchema)

module.exports = Contacts