const mongoose = require("mongoose");
const Exercise = require("./exercise");

// Schema Setup
const WorkoutSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
        },
    createdAt: {
        type: Date,
        default: Date.now
        },
    // date: new Date,
    exercises: [{
        exercise: String,
        sets: String,
    }],
    completed: [{
        completedAt: {
            type: Date,
            default: Date.now
        },
        exercises: [{
            exercise: String,
            // type: mongoose.Schema.Types.ObjectId
            
            sets: [{
                setNum: String,
                weight: String,
                reps: String
            }]
        }]
    }]
});

// let CompletedWorkoutSchema = new mongoose.Schema({
//     completedWorkout: [{
//         workoutName: {
//             type: String
//             // type: mongoose.Schema.Types.ObjectId
//         },
//         completedAt: {
//             type: Date,
//             default: Date.now
//         },
//         exercises: [{
//             exercise: String,
//             // type: mongoose.Schema.Types.ObjectId
//             sets: [{
//                 setNum: String,
//                 weight: String,
//                 reps: String
//             }]
//         }]
//     }]
// });
// let CompletedWorkout = mongoose.model("CompletedWorkout", CompletedWorkoutSchema);
let Workout = mongoose.model("Workout", WorkoutSchema);
module.exports = {Workout}