const mongoose = require('mongoose')

var TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: false },
    idUser: { type: String, required: true }
})

module.exports = mongoose.model('Topic', TopicSchema)