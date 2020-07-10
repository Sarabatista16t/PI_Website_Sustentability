/** 
 * @class Structure to store the state of an user. 
 * @constructs User
 * @param {*} _id 
 * @param {*} name 
 * @param {*} email 
 * @param {*} password 
 * @param {*} userRole 
 */
function User(_id, name, email, password, userRole) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.userRole = userRole;
};