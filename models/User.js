"use strict";
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

/** 
 * @class Estrutura com capacidade de armazenar o estado de uma entidade pessoa 
 * @constructs User
 * @param {string} _id - id da pessoa
 * @param {string} name - nome da pessoa
 * @param {Date} birthDate - data de nascimento da pessoa
 * @param {int} idCountry - id do pais da pessoa
 */
function User(_id, name, email, password) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
};

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailConfirmation: { type: Boolean, default: false },
    password: { type: String, required: true },
    userRole: { type: Array },
    changePasswordToken: {
        token: { type: String },
        expirationDate: { type: Date }
    },
    confirmEmailToken: {
        token: { type: String },
        expirationDate: { type: Date }
    }
})

// Defining the user roles
const roles = ['admin', 'editor']

UserSchema.pre('save', function() {
    // save only strings presented in the array of roles to assure consistency
    this.roles = this.roles.filter(role => roles.find(value => value === role))
})

UserSchema.methods.hasRoles = function() {
    for (let i = 0; i < arguments.length; i++) {
        if (!this.userRole.find(userRole => userRole === arguments[i])) {
            return false
        }
    }
    return true
}

UserSchema.methods.filter = function(additionalData, removeFields) {
    let filteredUser = this.toObject()

    if (additionalData !== undefined && additionalData instanceof Object) {
        filteredUser = {
            ...filteredUser,
            ...additionalData
        }
    }

    if (removeFields) {
        for (const key of Object.keys(removeFields)) {
            if (key) {
                delete filteredUser[key]
            }
        }
    }

    delete filteredUser.password
    delete filteredUser.changePasswordToken
    return filteredUser
}

UserSchema.methods.comparePassword = function(insertedPassword) {
    return bcrypt.compare(insertedPassword, this.password)
}

/**
 * Function to validate if the inserted email already exists in the database
 */
UserSchema.path('email').validate(async function(value) {
    const emailCount = await mongoose.models.User.countDocuments({ email: value })
    return !emailCount
}, 'Email already exists.')

module.exports = mongoose.model('User', UserSchema)
module.exports.userRoles = userRoles