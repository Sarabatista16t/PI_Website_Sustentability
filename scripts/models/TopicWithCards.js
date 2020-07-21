const mongoose = require('mongoose');

var TopicWithCardsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    card1_title: { type: String, required: false },
    card1_text: { type: String, required: false },
    card1_img: { type: String, required: false },
    card2_title: { type: String, required: false },
    card2_text: { type: String, required: false },
    card2_img: { type: String, required: false },
    card3_title: { type: String, required: false },
    card3_text: { type: String, required: false },
    card3_img: { type: String, required: false },
    idUser: { type: String, required: true },
    date: { type: Date, required: false }
});

module.exports = mongoose.model('TopicWithCards', TopicWithCardsSchema);