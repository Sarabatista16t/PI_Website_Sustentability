/** 
 * @class Structure to store the state of a campus. 
 * @constructs Project
 * @param {*} _id 
 * @param {*} text 
 * @param {*} projectCards 
 */
function Project(_id, text, projectCards) {
    this._id = _id;
    this.text = text;
    this.projectCards = [];
    if (!projectCards) {
        this.projectCards.push(projectCards);
    }
};