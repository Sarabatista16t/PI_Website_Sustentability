const mongoose = require('mongoose')

/**
 * Model to represent a simple topic schema.
 */
var TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: false },
    idUser: { type: String, required: true },
    date: { type: Date, required: false }
})

module.exports = mongoose.model('Topic', TopicSchema)