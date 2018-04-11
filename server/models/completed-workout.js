var mongoose = require("mongoose");
var Exercise = require("./exercise");

var completedWorkoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    },
    exercises: [
        {
            name: {
                type: String,
                required: true
            },
            set: [{
                number: Number,
                weight: Number,
                reps: Number
            }]
        }
    ]
});

let CompletedWorkout = mongoose.model("CompletedWorkout", completedWorkoutSchema);
module.exports = {CompletedWorkout};