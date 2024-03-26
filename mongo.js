const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://admin:${password}@mytestdatabase.dx9jj7h.mongodb.net/contactApp?retryWrites=true&w=majority&appName=MyTestDatabase`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
  })
  
const Contact = mongoose.model('Contact', contactSchema)

console.log(process.argv.length)
switch(process.argv.length) {
    case 3:
        console.log('phonebook:')
        Contact.find({}).then(result => {
            result.forEach(contact => {
              console.log(`${contact.name} ${contact.number}`)
            })
            mongoose.connection.close()
          })
        break;
    case 5:
        const contact = new Contact({
            name: process.argv[3],
            number: process.argv[4]
          })
          
          contact.save().then(result => {
            console.log(`added ${contact.name} number ${contact.number} to phonebook`)
            mongoose.connection.close()
          })
        break;
    default:
        break;
}