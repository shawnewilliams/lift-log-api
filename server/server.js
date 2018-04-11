const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const app = express();

const {Exercise} = require('./models/exercise');
const {Workout} = require('./models/workout');
const {CompletedWorkout} = require('./models/completed-workout');
const {CompletedExercise} = require('./models/completed-exercise');


const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/LiftLog');

app.get('/exercises', (req, res) => {
    Exercise.find().then((exercises) => {
        res.send({exercises});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.post('/exercises', (req, res) => {
    console.log('POST exercises')
    let exercise = new Exercise({
        name: req.body.name,
    });
    exercise.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/exercises/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid');
    }
    Exercise.findById(id).then((exercise) => {
        if (!exercise) {
            return res.status(404).send('No exercise found');
        }
        res.send(exercise)
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.put('/exercises/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid');
    }
    let exerciseToAdd = {
        sets: req.body.sets
        
    }
    console.log(exerciseToAdd)
    Exercise.findByIdAndUpdate(id, {$push: {completed: exerciseToAdd}}, { new: true }).then((exercise) => {
        res.send(exercise);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.delete('/exercises/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid');
    }
    Exercise.findByIdAndRemove(id).then((exercise) => {
        if (!exercise) {
            return res.status(404).send('No exercise found');
        }
        res.send(exercise);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/workouts', (req, res) => {
    Workout.find().then((workouts) => {
        if (!workouts) {
            res.status(404).send('No workouts found')
        }
        res.send({workouts});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/workouts', (req, res) => {
    let workout = new Workout(req.body);
    workout.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/workouts/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid');
    }
    Workout.findById(id).then((workout) => {
        if (!workout) {
            return res.status(404).send('No workout found');
        }
        res.send({workout});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.put('/workouts/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid');
    }
    let exercisesArray = req.body.exercises.map((exercise) => {
        return exercise;
    });
    // console.log(exercisesArray);
    let completedWorkout = req.body;
    console.log(completedWorkout)
    Workout.findByIdAndUpdate(id, {$push: {completed: completedWorkout}}, {new: true}).then((updatedWorkout) => {
        for (ex of completedWorkout.exercises) {
            Exercise.findOneAndUpdate({name: ex.exercise}, {$push: {completed: ex}}, {new: true}).then((foundEx) => {
                console.log(foundEx);
            }).catch((e) => {
                res.status(400).send(e);
            });
        }
        
        res.send(updatedWorkout);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.delete('/workouts/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid');
    }
    Workout.findByIdAndRemove(id).then((doc) => {
        if (!doc) {
            res.status(404).send('No workout found');
        }
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/completed-workouts', (req, res) => {
    CompletedWorkout.find().then((workouts) => {
        if (!workouts) {
            return res.status(404).send('No workouts found');
        }
        res.send({workouts});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/completed-workouts', (req, res) => {
    let workout = new CompletedWorkout({
        name: req.body.name,
        exercises: req.body.exercises
    });
    workout.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/completed-workouts/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Id not valid');
    }
    CompletedWorkout.findById(id).then((workout) => {
        if (!workout) {
            return res.status(404).send('No workout found');
        }
        res.send(workout);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/completed-exercise', (req, res) => {    
    CompletedExercise.find().then((exercises) => {
        if (!exercises) {
            return res.status(404).send('No workout found');
        }
        res.send({exercises});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/completed-exercise', (req, res) => {
    exercise = new CompletedExercise({
        name: req.body.name,
        set: req.body.sets
    }) ;   
    exercise.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});




app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

