const sgMail = require('@sendgrid/mail')
const options = require('../config/options.json')

sgMail.setApiKey(options.email.SENDGRID_API_KEY)

/** 
 * @class Structure to store the state of an email. 
 * @constructs Email
 * @param {*} to 
 * @param {*} type 
 * @param {*} data 
 */
function Email(from, type, data) {
    this.to = options.email.email_to;
    this.from = from;
    this.type = type;
    this.data = data;
};

Email.prototype.send = function() {
    const msg = {
        to: this.to,
        from: this.from,
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    sgMail.send(msg);
};

module.exports = Email