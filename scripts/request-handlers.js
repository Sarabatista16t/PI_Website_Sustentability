"use strict";
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const options = require("../config/options.json");

const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth.js')
const crypto = require('crypto')

const SALT_WORK_FACTOR = 10
const router = express.Router()
const authRouter = express.Router({ mergeParams: true })

/**
 * The Register function creates the user and places him in the database
 * @param {*} req 
 * @param {*} res 
 */
async function register(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const user = new User(req.body)

    try {
        // hashes the password
        user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR)

        // creates the token
        const token = crypto.randomBytes(20).toString('hex')

        // create an expiration date (7 days)
        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        user.confirmEmailToken = {
            token,
            expirationDate
        }

        /*if (req.body.internal) {
            user.roles = ['intern']
        } else {
            user.roles = ['extern']
        }*/

        await user.save()

        res.sendStatus(200)
            // send an email asking to confirm the email given
        const email = new Email(user.email, 'confirm_email', {
            token: token
        })
        email.send()
    } catch (error) {
        res.status(400).json(error.errors)
    }
}

/**
 * Function to confirm the email, once the user registered in the platform.
 * @param {*} req 
 * @param {*} res 
 */
async function confirmEmail(req, res) {
    try {
        const user = await User.findOne({
            $and: [
                { 'confirmEmailToken.token': req.params.token },
                { 'confirmEmailToken.expirationDate': { $gte: new Date() } } // expiration date greater than or equal to the current date
            ]
        })

        if (!user) return res.status(404).json({ error: 'A token fornecida é inválida' })

        await User.updateOne({ _id: user._id }, {
            'confirmEmailToken.token': undefined,
            'confirmEmailToken.expirationDate': undefined,
            emailConfirmation: true
        })

        return res.sendStatus(200)
    } catch (err) {
        return res.sendStatus(500)
    }
}

/**
 * Funtion to do the login in the platform.
 * @param {*} req 
 * @param {*} res 
 */
async function login(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            error: 'Missing email or password'
        })
    }

    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({
                error: 'Utilizador inexistente'
            })
        }

        if (!user.emailConfirmation) {
            return res.status(403).json({
                error: 'É necessário confirmar o e-mail.'
            })
        }

        const isMatch = await user.comparePassword(req.body.password)
        if (!isMatch) {
            return res.status(403).json({
                error: 'Invalid credentials'
            })
        }

        const token = jwt.sign({ user }, options.secrectKey.SECRET_KEY, { expiresIn: '24h' })
        return res.json(user.filter({ token }))
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function forgotPassword(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.sendStatus(200)
        }

        const token = crypto.randomBytes(20).toString('hex')

        // create an expiration date
        const expirationDate = new Date(Date.now() + 3600000)

        await User.updateOne({ _id: user._id }, { 'changePasswordToken.token': token, 'changePasswordToken.expirationDate': expirationDate })

        // send an email with the link to recover password
        const email = new Email(user.email, 'recover_password', {
            name: user.name,
            token: token
        })
        email.send()

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function validateRecoverPasswordToken(req, res) {
    try {
        const user = await User.findOne({
            $and: [
                { 'changePasswordToken.token': req.params.token },
                { 'changePasswordToken.expirationDate': { $gte: new Date() } } // expiration date greater than or equal to the current date
            ]
        })

        if (!user) {
            return res.sendStatus(404)
        }

        return res.sendStatus(200)
    } catch (err) {
        return res.sendStatus(500)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function recoverPassword(req, res) {
    try {
        const user = await User.findOne({
            $and: [
                { 'changePasswordToken.token': req.params.token },
                { 'changePasswordToken.expirationDate': { $gte: new Date() } } // expiration date greater than or equal to the current date
            ]
        })

        if (!user) {
            return res.sendStatus(404)
        }

        if (req.body.newPassword === req.body.confirmNewPassword) {
            // set the new password as the user password
            const newPassword = await bcrypt.hash(req.body.newPassword, SALT_WORK_FACTOR)

            await User.updateOne({ _id: user._id }, {
                'changePasswordToken.token': undefined,
                'changePasswordToken.expirationDate': undefined,
                password: newPassword
            })

            // send an email confirming that the password was changed
            const email = new Email(user.email, 'changed_password', {
                name: user.name
            })
            email.send()

            return res.sendStatus(200)
        } else {
            return res.status(400).json({ error: "newPassword and confirmPassword don't match" })
        }
    } catch (err) {
        return res.sendStatus(500)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function changePassword(req, res) {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.sendStatus(404)
        }

        const isMatch = await user.comparePassword(req.body.oldPassword)
        if (!isMatch) {
            return res.status(400).json({
                error: "Password doesn't match."
            })
        }

        const newPassword = await bcrypt.hash(req.body.newPassword, SALT_WORK_FACTOR)
        await User.updateOne({ _id: user._id }, { password: newPassword })
        return res.sendStatus(200)
    } catch (err) {
        return res.sendStatus(500)
    }
}

module.exports.register = register;
module.exports.login = login;
module.exports.forgotPassword = forgotPassword;
module.exports.changePassword = changePassword;
module.exports.recoverPassword = recoverPassword;
module.exports.validateRecoverPasswordToken = validateRecoverPasswordToken;
module.exports.confirmEmail = confirmEmail;


/**
 * Função para adicionar ou atualizar (upsert) um utilizador na base de dados.
 * @param {*} req 
 * @param {*} res 
 */
function createUpdateUser(req, res) {
    let client = getMongoDbClient();

    client.connect(function(err) {
        if (err) {
            res.json({ "message": "error", "error": err });
        } else {
            let collection = client.dv('BeAware').collection("user");

            collection.update({
                    _id: new ObjectID(req.method === 'PUT' ? req.body.id : null)
                }, {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    userRole: req.body.userRole
                }, {
                    multi: false,
                    upsert: true
                },
                function(err, response) {
                    if (err, response) {
                        if (err) {
                            res.sendStatus(404);
                        } else {
                            res.send(response.result);
                        }
                    }
                    client.close();
                }
            );
        }
    });
}

/**
 * Função para retornar a lista de utilizadores da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getUsers(req, res) {

    let client = new MongoClient(options.mongoDB.connectionString, { useUnifiedTopology: true });

    client.connect(function(err) {

        if (err) {

            res.json({ "message": "error", "error": err });

        } else {

            let collection = client.db('BeAware').collection("user");
            // (COMPLETAR)
            collection.find({}, { _id: 1, name: 1, birthDate: 1, idCountry: 1 }).toArray(function(err, documents) {

                if (err) {

                    res.json({ "message": "error", "error": err });

                } else {

                    res.json({ "message": "success", "person": documents });

                }

            });

            client.close();

        }

    });

}



/**
 * Função para remover uma pessoa da BD.
 * @param {*} req 
 * @param {*} res 
 */
function removePerson(req, res) {

    let client = new MongoClient(options.mongoDB.connectionString, { useUnifiedTopology: true });

    client.connect(function(err) {

        if (err) {

            res.json({ "message": "error", "error": err });

        } else {

            let collection = client.db('pi-lab11').collection("person");

            collection.remove({ _id: new ObjectID(req.params.id) }, { justOne: true }, function(err) {

                if (err) {

                    res.sendStatus(404);

                } else {

                    res.sendStatus(200);

                }

                client.close();

            });

        }

    });

}

/**
 * Função para retornar a lista de paises da BD.
 * @param {*} req 
 * @param {*} res 
 */
function getCountries(req, res) {

    let client = new MongoClient(options.mongoDB.connectionString, { useUnifiedTopology: true });

    client.connect(function(err) {

        if (err) {

            res.json({ "message": "error", "error": err });

        } else {

            let collection = client.db('pi-lab11').collection("country");

            collection.find({}, { _id: 1, name: 1, shortName: 1 }).toArray(function(err, documents) {

                if (err) {

                    res.json({ "message": "error", "error": err });

                } else {

                    res.send({ "message": "success", "country": documents });

                }

                client.close();

            });

        }

    });

}


});

}
}