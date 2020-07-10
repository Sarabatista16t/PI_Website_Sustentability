/** 
 * @class Structure to store the state of a topic. 
 * @constructs Topic
 * @param {*} _id 
 * @param {*} title 
 * @param {*} text 
 * @param {*} imageURL 
 * @param {*} idUser 
 */
function Topic(_id, title, text, imageURL, idUser) {
    this._id = _id;
    this.title = title;
    this.text = text;
    this.imageURL = imageURL;
    this.idUser = idUser;
};