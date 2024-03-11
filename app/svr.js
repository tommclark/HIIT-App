import express from 'express';

const app = express();
app.use(express.static('client'));

let exercises = [];

function getExercises(req, res) {
    res.json(exercises);
}

function postMessages(req, res) {
    exercises.push(req.body);
    res.json(exercises);

}

function clearMessages(req, res) {
    exercises = [];
    res.json(exercises);
}

app.get('/exercises', getExercises);
app.post('/exercises', express.json(), postMessages);
app.delete('/exercises', clearMessages);

app.listen(8080);


