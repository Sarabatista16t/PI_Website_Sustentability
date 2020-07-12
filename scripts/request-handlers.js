"use strict";
const options = require("../config/options.json");

const mongoose = require('mongoose');
mongoose.connect(options.mongoDB.connectionString, { useNewUrlParser: true });
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth.js')
const crypto = require('crypto')
const express = require('express')
const User = require('../www/scripts/models/User.js')
const Topic = require('../www/scripts/models/Topic.js')

const SALT_WORK_FACTOR = 10
const router = express.Router()
const authRouter = express.Router({ mergeParams: true })

/*====================================================================================*/
/*==================             AUTENTICATION               =========================*/
/*====================================================================================*/

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

        const isMatch = await user.comparePassword(req.body.password)
        if (!isMatch) {
            return res.status(403).json({
                error: 'Invalid credentials'
            })
        }

        const token = jwt.sign({ user }, options.secrectKey.SECRET_KEY, { expiresIn: '24h' })
        return res.json({ msg: "smth", user: user.filter({ token }) })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

/**
 * The Register function creates the user and places him in the database
 * @param {*} req 
 * @param {*} res 
 */
async function createUser(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const user = new User(req.body)
    user.roles = ['editor']

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

        await user.save()
        res.sendStatus(200)
    } catch (error) {
        res.status(400).json(error.errors)
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

/*====================================================================================*/
/*==================               CRUD USER                 =========================*/
/*====================================================================================*/

/**
 * Function to get all the users 
 * @param {*} req 
 * @param {*} res 
 */
function getAllUsers(req, res) {
    User.find({}, function(err, users) {
        res.send(users);
    });
}

/**
 * Function to get the user (Profile)
 * @param {*} req 
 * @param {*} res 
 */
function getUser(req, res) {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) return res.status(500).json({ error: err })

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
 * Function to update the user
 * @param {*} req 
 * @param {*} res 
 */
async function updateUser(req, res) {

    // ROLES: verify if req.params.id matches token.user.id
    if (req.user._id !== req.params.id) {
        return res.status(403).json({ error: 'only the profile owner can modify it' })
    }

    const user = req.body
    User.updateOne({ _id: req.params.id }, user, { runValidators: true }, function(err) {
        if (err) return res.status(400).json({ error: err.message })

        User.findById({ _id: req.params.id }, function(err, updatedUser) {
            if (err) return res.sendStatus(500)
            res.json(updatedUser)
        })
    })
}

/**
 * Function to delete the user
 * @param {*} req 
 * @param {*} res 
 */
function deleteUser(req, res) {
    // ROLES: verify if is admin or req.params.id matches token.user.id
    const reqUser = new User(req.user)
    if (reqUser._id !== req.params.id && !reqUser.hasRoles('admin')) {
        return res.status(403).json({ error: 'only the profile owner can modify it' })
    }
    let userImage
    User.findById(req.params.id, (err, user) => {
        if (err) return res.status(500).json(err)
        userImage = user.imageUrl
    })
    User.deleteOne({ _id: req.params.id }, function(err) {
        if (err) return res.status(500).json(err)
        fs.unlink(userImage, (err) => {
            if (err) {
                // console.error(err)
            }
        })
        res.sendStatus(200)
    })
}

/*====================================================================================*/
/*==================               CRUD TOPICS                 =========================*/
/*====================================================================================*/

/**
 * Function to get all the topics 
 * @param {*} req 
 * @param {*} res 
 */
function getAllTopics(req, res) {
    Topic.find({}, function(err, topics) {
        res.send(topics);
    });
}


/**
 * Function to get the topic
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
 * Function to update the topic
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
 * Function to delete the Topic
 * @param {*} req 
 * @param {*} res 
 */
function deleteTopic(req, res) {
    Topic.deleteOne({ _id: req.params.id }, function(err) {
        if (err) return res.status(500).json(err)
        res.sendStatus(200)
    })
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
module.exports.getTopic = getTopic;
module.exports.updateTopic = updateTopic;
module.exports.deleteTopic = deleteTopic;