const mongoose = require('mongoose')
const User = require('./www/scripts/models/User.js')
const bcrypt = require('bcrypt')
const options = require('./config/options.json')

function connect() {
    mongoose.connect(options.mongoDB.connectionString, { useUnifiedTopology: true, useNewUrlParser: true })

    mongoose.connection.once('open', async() => {
        console.log('MongoDB database connection established successfully')
        console.log('Creating the necessary base data...')

        try {
            await Promise.all([createAdmin(), createEditor()])
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
                    name: 'Admin',
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
                    name: 'publisher',
                    password: password,
                    emailConfirmation: true,
                    roles: ['Editor']
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

module.exports = {
    connect
}