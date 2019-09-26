const mongoose = require('mongoose');

const Student_Schema = mongoose.Schema({
    id: String,
    name: String,
    rollnumber:String
}
, {
    timestamps: true 
}
);

module.exports = mongoose.model('Student', Student_Schema);