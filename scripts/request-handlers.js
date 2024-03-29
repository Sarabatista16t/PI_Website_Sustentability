"use strict";
const options = require("../config/options.json");

const mongoose = require('mongoose');
mongoose.connect(options.mongoDB.connectionString, { useNewUrlParser: true });

const bcrypt = require('bcrypt')
const User = require('../scripts/models/User.js')
const Topic = require('../scripts/models/Topic.js')
const TopicWithCards = require('../scripts/models/TopicWithCards.js')
const Email = require('../email/Email.js')

const SALT_WORK_FACTOR = 10

/*====================================================================================*/
/*==================             AUTENTICATION               =========================*/
/*====================================================================================*/

/**
 * Route to do the login in the platform.
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

        const isMatch = await user.comparePassword(req.body.password)
        if (!isMatch) {
            return res.status(403).json({
                error: 'Invalid credentials'
            })
        }
        return res.json({ msg: "smth", user: user })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

/**
 * Route to change the user's password.
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

/*====================================================================================*/
/*==================               CRUD USER                 =========================*/
/*====================================================================================*/

/**
 * Route to get all the users.
 * @param {*} req 
 * @param {*} res 
 */
function getAllUsers(req, res) {
    User.find({}).then((users) => {
        res.json(users);
    });
}

/**
 * Route to get a specific user.
 * @param {*} req 
 * @param {*} res 
 */
function getUser(req, res) {
    User.findOne({ _id: req.params.id }), (user => {
        //      if (err) return res.status(500).json({ error: err })

        if (req.user._id.toString() !== req.params.id) {
            const fieldsToDelete = {
                emailConfirmation: 'emailConfirmation',
                roles: 'roles',
                confirmEmailToken: 'confirmEmailToken'
            }

            const filtered = user.filter(undefined, fieldsToDelete)
            return res.json(filtered)
        }

        const filteredUser = user.filter()
        return res.json(filteredUser)
    })
}

/**
 * Route to create a new user.
 * @param {*} req 
 * @param {*} res 
 */
async function createUser(req, res) {
    const user = new User(req.body)
    user.roles = ['editor']

    try {
        // hashes the password
        user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR)

        await user.save()
        res.sendStatus(200)
    } catch (error) {
        res.status(400).json(error.errors)
    }
}

/**
 * Route to update the data of a specific user.
 * @param {*} req 
 * @param {*} res 
 */
async function updateUser(req, res) {
    const user = req.body
    User.updateOne({ _id: req.params.id }, user, { runValidators: false }, function(err) {
        if (err) return res.status(400).json({ error: err.message })

        User.findById({ _id: req.params.id }, function(err, updatedUser) {
            if (err) return res.sendStatus(500)
            res.json(updatedUser)
        })
    })
}


/**
 * Route to delete a specific user.
 * @param {*} req 
 * @param {*} res 
 */
function deleteUser(req, res) {
    User.deleteOne({ _id: req.params.id }, function(err) {
        if (err) return res.status(500).json(err)
        res.sendStatus(200)
    })
}

/*====================================================================================*/
/*==================               CRUD TOPICS                 =========================*/
/*====================================================================================*/

/**
 * Route to get all the simple topics. 
 * @param {*} req 
 * @param {*} res 
 */
function getAllTopics(req, res) {
    Topic.find({}, function(err, topics) {
        res.send(topics);
    });
}

/**
 * Route to get all the topics with cards.
 * @param {*} req 
 * @param {*} res 
 */
function getAllTopicsWithCards(req, res) {
    TopicWithCards.find({}, function(err, topics) {
        res.send(topics);
    });
}

/**
 * Route to get a specific simple topic.
 * @param {*} req 
 * @param {*} res 
 */
function getTopic(req, res) {
    Topic.findOne({ _id: req.params.id }, (err, topic) => {
        if (err) return res.status(500).json({ error: err })
        return res.json(topic)
    })
}

/**
 * Route to update a specific simple topic.
 * @param {*} req 
 * @param {*} res 
 */
async function updateTopic(req, res) {
    const topic = req.body
    Topic.updateOne({ _id: req.params.id }, topic, { runValidators: true }, function(err) {
        if (err) return res.status(400).json({ error: err.message })

        Topic.findById({ _id: req.params.id }, function(err, topic) {
            if (err) return res.sendStatus(500)
            res.json(topic)
        })
    })
}

/**
 * Route to update a specific topic with cards.
 * @param {*} req 
 * @param {*} res 
 */
async function updateTopicWithCards(req, res) {
    const topic = req.body
    TopicWithCards.updateOne({ _id: req.params.id }, topic, { runValidators: true }, function(err) {
        if (err) return res.status(400).json({ error: err.message })

        TopicWithCards.findById({ _id: req.params.id }, function(err, topic) {
            if (err) return res.sendStatus(500)
            res.json(topic)
        })
    })
}

/**
 * Route to create a simple topic.
 * @param {*} req 
 * @param {*} res 
 */
async function createTopic(req, res) {
    const topic = new Topic(req.body)

    try {
        await topic.save()
        res.sendStatus(200)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

/**
 * Route to create a topic with cards.
 * @param {*} req 
 * @param {*} res 
 */
async function createTopicWithCards(req, res) {
    const topic = new TopicWithCards(req.body)

    try {
        await topic.save()
        res.sendStatus(200)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

/**
 * Route to delete a specific simple Topic.
 * @param {*} req 
 * @param {*} res 
 */
function deleteTopic(req, res) {
    Topic.deleteOne({ _id: req.params.id }, function(err) {
        if (err) return res.status(500).json(err)
        res.sendStatus(200)
    })
}

/**
 * Route to delete a specific topic with cards.
 * @param {*} req 
 * @param {*} res 
 */
function deleteTopicWithCards(req, res) {
    TopicWithCards.deleteOne({ _id: req.params.id }, function(err) {
        if (err) return res.status(500).json(err)
        res.sendStatus(200)
    })
}

/**
 * Route to send a feedback email.
 */
function sendEmail(req, res) {
    try {
        const email = new Email(req.params);
        email.send();

        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

/* ==============  AUTENTICATION  ================ */
module.exports.login = login;
module.exports.changePassword = changePassword;

/* ============== CRUD USERS  ================ */
module.exports.getAllUsers = getAllUsers;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.createUser = createUser;

/* ============== CRUD TOPICS  ================ */
module.exports.getAllTopics = getAllTopics;
module.exports.getAllTopicsWithCards = getAllTopicsWithCards;
module.exports.getTopic = getTopic;
module.exports.updateTopic = updateTopic;
module.exports.updateTopicWithCards = updateTopicWithCards;
module.exports.deleteTopic = deleteTopic;
module.exports.deleteTopicWithCards = deleteTopicWithCards;
module.exports.createTopic = createTopic;
module.exports.createTopicWithCards = createTopicWithCards;

/* ============== SEND EMAIL  ================ */
module.exports.sendEmail = sendEmail;