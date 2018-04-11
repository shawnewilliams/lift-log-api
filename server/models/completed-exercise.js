var mongoose = require("mongoose");
var Exercise = require("./exercise");

var completedExerciseSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    },
    set: [
        {
            number: Number,
            weight: Number,
            reps: Number
        }
    ]
});

let CompletedExercise = mongoose.model("CompletedExercise", completedExerciseSchema);
module.exports = {CompletedExercise};