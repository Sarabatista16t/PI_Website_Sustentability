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
    this.from = options.email.email_from;
    this.type = type;
    this.data = data;
};

Email.prototype.send = function(msg) {
    const message = {
        to: this.to,
        from: this.from,
        subject: 'Sending with SendGrid is Fun',
        text: msg
    }

    sgMail.send(message);
};

module.exports = Email