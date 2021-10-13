// Import mongoose
const mongoose = require('mongoose');
// Create a definition object using mapping notation
const schemaDefinition = {
    name: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date
    },
    course: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'TO DO'
    }
}
// Create a schema using the definition object
let schemaObj = new mongoose.Schema(schemaDefinition);
// Create a model using the schema object and export model
module.exports = mongoose.model('Project', schemaObj);