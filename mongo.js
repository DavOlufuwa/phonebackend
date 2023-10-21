const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://oluscopix:${password}@test-cluster.jcdvizl.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contacts', contactSchema)

if (process.argv.length === 3) {
  
  return Contact.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
      mongoose.connection.close()
    })
  })
}

else if (process.argv.length<5) {
  console.log('Please check your entries')
  process.exit(1)
}


const newContact = new Contact({
  name: name,
  number: number,
})

newContact.save().then(result => {
  console.log(`added ${result.name} ${result.number} to phonebook`)
  mongoose.connection.close()
})
