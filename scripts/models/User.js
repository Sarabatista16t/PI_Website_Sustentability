const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailConfirmation: { type: Boolean, default: false },
    password: { type: String, required: true },
    roles: { type: Array },
    changePasswordToken: {
        token: { type: String },
        expirationDate: { type: Date }
    },
    confirmEmailToken: {
        token: { type: String },
        expirationDate: { type: Date }
    }
})

const roles = ['admin', 'editor']

UserSchema.pre('save', function() {
    // save only strings present in the array of roles to assure consistency
    this.roles = this.roles.filter(role => roles.find(value => value === role))
})

UserSchema.methods.hasRoles = function() {
    for (let i = 0; i < arguments.length; i++) {
        if (!this.roles.find(role => role === arguments[i])) {
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

UserSchema.path('email').validate(async function(value) {
    const emailCount = await mongoose.models.User.countDocuments({ email: value })
    return !emailCount
}, 'Email already exists.')

module.exports = mongoose.model('User', UserSchema)
module.exports.roles = roles