let mongoose = require('mongoose');
// Setup schema
let contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 12
    },
    gender: { type: String }, //optional
    phone: {type: String }, //optional
    created_date: {
        type: Date,
        default: Date.now
    }
});
// else when the collection is created , mongodb adds an extra s to make it plural :(
// https://stackoverflow.com/questions/10547118/why-does-mongoose-always-add-an-s-to-the-end-of-my-collection-name
mongoose.pluralize(null);
const employeeModel = mongoose.model("myemployee_"+process.env.NODE_ENV, contactSchema);
module.exports = employeeModel;
