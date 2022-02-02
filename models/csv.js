const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const csvSchema = new Schema({
    filePath: {
        type: String
    },
    fileName: {
        type: String
    },
    headers: [{
        type: String
    }]
})

module.exports = mongoose.model('CSV', csvSchema);