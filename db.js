const mongoose = require('mongoose')
const User = require('./scripts/models/User.js')
const Topic = require('./scripts/models/Topic.js')
const TopicWithCards = require('./scripts/models/TopicWithCards.js')
const bcrypt = require('bcrypt')
const options = require('./config/options.json')

function connect() {
    mongoose.connect(options.mongoDB.connectionString, { useUnifiedTopology: true, useNewUrlParser: true })

    mongoose.connection.once('open', async() => {
        console.log('MongoDB database connection established successfully')
        console.log('Creating the necessary base data...')

        try {
            await Promise.all([createAdmin(), createEditor(), createDefaultSimpleTopic(), createDefaultTopicWithImage(), createDefaultTopicWithCards()])
            console.log('Succesfully created the base data')
        } catch (err) {
            console.error('Something went wrong during the creation of the base data...')
            console.error('Shutting down...')
            process.exit(1)
        }
    })

    mongoose.connection.on('error', err => {
        console.error(err)
    })
}

function createAdmin() {
    return new Promise((resolve, reject) => {
        User.findOne({ email: 'admin@ips.pt' }).then((result) => {
            if (!result) {
                const password = bcrypt.hashSync(options.admin.password, 10)

                User.create({
                    email: 'admin@ips.pt',
                    name: 'Sara Batista',
                    password: password,
                    emailConfirmation: true,
                    roles: ['admin']
                }, function(err) {
                    if (err) {
                        console.error('Unable to create the admin account.')
                        console.error(err)
                        reject(err)
                    } else {
                        console.log('Successfully created the admin account')
                    }
                })
            }
        })

        resolve()
    })
}

function createEditor() {
    return new Promise((resolve, reject) => {
        User.findOne({ email: 'editor@ips.pt' }).then((result) => {
            if (!result) {
                const password = bcrypt.hashSync(options.admin.password, 10)

                User.create({
                    email: 'editor@ips.pt',
                    name: 'Bruno Dias',
                    password: password,
                    emailConfirmation: true,
                    roles: ['editor']
                }, function(err) {
                    if (err) {
                        console.error('Unable to create the editor account.')
                        console.error(err)
                        reject(err)
                    } else {
                        console.log('Successfully created the editor account')
                    }
                })
            }
        })

        resolve()
    })
}

function createDefaultSimpleTopic() {
    return new Promise((resolve, reject) => {
        Topic.findOne({ title: 'Um pequeno artigo sobre sustentabilidade' }).then((result) => {
            if (!result) {

                Topic.create({
                    title: 'Um pequeno artigo sobre sustentabilidade',
                    text: 'Sustentabilidade é uma característica ou condição de um processo ou de um sistema que permite a sua permanência, em certo nível, por um determinado prazo. Ultimamente, este conceito tornou-se um princípio segundo o qual o uso dos recursos naturais para a satisfação de necessidades presentes não pode comprometer a satisfação das necessidades das gerações futuras. Este novo princípio foi ampliado para a expressão "sustentabilidade no longo prazo", um "longo prazo" de termo indefinido.',
                    idUser: '1'
                }, function(err) {
                    if (err) {
                        console.error('Unable to create the default topic.')
                        console.error(err)
                        reject(err)
                    } else {
                        console.log('Successfully created the default topic')
                    }
                })
            }
        })
        resolve()
    })
}

function createDefaultTopicWithImage() {
    return new Promise((resolve, reject) => {
        Topic.findOne({ title: 'Um grande artigo sobre sustentabilidade' }).then((result) => {
            if (!result) {

                Topic.create({
                    title: 'Um grande artigo sobre sustentabilidade',
                    text: 'Sustentabilidade é uma característica ou condição de um processo ou de um sistema que permite a sua permanência, em certo nível, por um determinado prazo. Ultimamente, este conceito tornou-se um princípio segundo o qual o uso dos recursos naturais para a satisfação de necessidades presentes não pode comprometer a satisfação das necessidades das gerações futuras. Este novo princípio foi ampliado para a expressão "sustentabilidade no longo prazo", um "longo prazo" de termo indefinido.',
                    image: 'https://cdn4.ecycle.com.br/cache/images/2020-07/50-650-sustentabilidade.jpg',
                    idUser: '1'
                }, function(err) {
                    if (err) {
                        console.error('Unable to create the default topic.')
                        console.error(err)
                        reject(err)
                    } else {
                        console.log('Successfully created the default topic')
                    }
                })
            }
        })
        resolve()
    })
}

function createDefaultTopicWithCards() {
    return new Promise((resolve, reject) => {
        TopicWithCards.findOne({ title: 'Um grande artigo sobre sustentabilidade' }).then((result) => {
            if (!result) {

                TopicWithCards.create({
                    title: 'Um grande artigo sobre sustentabilidade',
                    text: 'Sustentabilidade é uma característica ou condição de um processo ou de um sistema que permite a sua permanência, em certo nível, por um determinado prazo.',
                    card1_text: 'Card 1',
                    card1_img: 'https://cdn4.ecycle.com.br/cache/images/2020-07/50-650-sustentabilidade.jpg',
                    card2_text: 'Card 2',
                    card2_img: 'https://cdn4.ecycle.com.br/cache/images/2020-07/50-650-sustentabilidade.jpg',
                    card3_text: 'Card 3',
                    card3_img: 'https://cdn4.ecycle.com.br/cache/images/2020-07/50-650-sustentabilidade.jpg',
                    idUser: '1'
                }, function(err) {
                    if (err) {
                        console.error('Unable to create the default topic with cards.')
                        console.error(err)
                        reject(err)
                    } else {
                        console.log('Successfully created the default topic with cards')
                    }
                })
            }
        })
        resolve()
    })
}

module.exports = {
    connect
}