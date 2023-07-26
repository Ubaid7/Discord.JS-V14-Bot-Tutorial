const mongo = require('mongoose')

const reputationSchema = new mongo.Schema({
    Guild: String,
    User: String,
    Reputation: Number
})

module.exports = mongo.model('Reputation', reputationSchema)