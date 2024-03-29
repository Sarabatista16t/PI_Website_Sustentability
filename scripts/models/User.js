const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

/**
 * Model to represent a user schema.
 */
var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: { type: Array }
});

const roles = ['admin', 'editor'];

UserSchema.pre('save', function() {
    // save only strings present in the array of roles to assure consistency
    this.roles = this.roles.filter(role => roles.find(value => value === role));
})

/**
 * Method to verify if a user has roles.
 */
UserSchema.methods.hasRoles = function() {
    for (let i = 0; i < arguments.length; i++) {
        if (!this.roles.find(role => role === arguments[i])) {
            return false;
        }
    }
    return true;
}

/**
 * Method to compare if an inserted password is equal to the user password.
 * @param {*} insertedPassword 
 */
UserSchema.methods.comparePassword = function(insertedPassword) {
    return bcrypt.compare(insertedPassword, this.password);
}

/**
 * Validation to verify if an email already exists.
 */
UserSchema.path('email').validate(async function(value) {
    const emailCount = await mongoose.models.User.countDocuments({ email: value });
    return !emailCount;
}, 'Email already exists.')

module.exports = mongoose.model('User', UserSchema)
module.exports.roles = roles