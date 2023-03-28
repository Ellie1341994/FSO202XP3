const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const [a,b,password, name, number] = process.argv

const url =
  `mongodb+srv://phonebookmdb:${password}@phonebookmdbcluster.xuwxvux.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
})

const PhonebookEntry = mongoose.model('PhonebookEntry', entrySchema)

if (name && number) {
    const entry = new PhonebookEntry({
        name,
        number,
    })
    entry.save().then(r =>{
        console.log(`Added ${entry.name} number: ${number} to Phonebook`)
        mongoose.connection.close()
    })
}
else {
    PhonebookEntry.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(entry => {
        console.log(` ${entry.name} ${entry.number}`)
    })
  })
}