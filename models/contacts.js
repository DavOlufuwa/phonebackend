const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const {Schema, model} = mongoose

const contactsSchema = new Schema({
  name: {
   type: String,
   minlength: 3,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{5,}$|^\d{2}-\d{6,}$/.test(v)
      }, 
      message: props => `${props.value} is not a valid phone number, please check the format`
    }
  },
})

contactsSchema.plugin(uniqueValidator)

contactsSchema.set('toJSON', {
  transform: ( document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  } 
})


const Contacts = model('Contacts', contactsSchema)

module.exports = Contacts