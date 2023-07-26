const mongo = require('mongoose')

const welcomeSchema = new mongo.Schema({
    Guild: String,
    Channel: String,
    Message: String,
    Role: String,
    Rule: String,
})

module.exports = mongo.model('Welcome', welcomeSchema)