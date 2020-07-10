/** 
 * @class Structure to store the state of a campus. 
 * @constructs Campus
 * @param {*} _id 
 * @param {*} text 
 * @param {*} campusCards 
 */
function Campus(_id, text, campusCards) {
    this._id = _id;
    this.text = text;
    this.campusCards = [];
    if (!campusCards) {
        this.campusCards.push(campusCards);
    }
};