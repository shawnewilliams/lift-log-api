const mongoose = require('mongoose');

let ExerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 1
    },
    completed: [{
        workout: {
            type: String
            // type: mongoose.Schema.Types.ObjectId
        },
        sets: [{
            setNum: String,
            weight: String,
            reps: String
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
    
    // _creator: {
    //     type: mongoose.Types.ObjectId,
    // }

});

let Exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = {Exercise}; 