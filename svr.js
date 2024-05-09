import express from 'express';
import path from 'path';
import sqlite3 from 'sqlite3';

const app = express();
app.use(express.static('client'));
app.use(express.static('server'));
app.use(express.json());

// connect to database
const db = new sqlite3.Database('exercise.db');

// ensure that the exercises table exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY,
        name TEXT,
        durationSecs INTEGER,
        restPeriodSecs INTEGER,
        reps INTEGER,
        description TEXT
    )`);
  db.run(`CREATE TABLE IF NOT EXISTS pastExercises (
    id INTEGER PRIMARY KEY,
    name TEXT,
    durationSecs INTEGER,
    timeRemaining INTEGER,
    restPeriodSecs INTEGER,
    reps INTEGER
  )`);
});

function getExercises(req, res) {
  // Retrieve exercises from the database
  db.all('SELECT name, durationSecs, restPeriodSecs, reps, description FROM exercises', (err, rows) => {
    if (err) {
      console.error('Error getting exercises:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
}

function postExercise(req, res) {
  const exercise = req.body;

  // Insert exercise into the database
  db.run('INSERT INTO exercises (name, durationSecs, restPeriodSecs, reps, description) VALUES (?, ?, ?, ?, ?)',
    [exercise.name, exercise.durationSecs, exercise.restPeriodSecs, exercise.reps, exercise.description],
    function (err) {
      if (err) {
        console.error('Error inserting exercise:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(201).json({ id: this.lastID, ...exercise });
      }
    },
  );
}

function postPastExercise(req, res) {
  const exercise = req.body;
  db.run('INSERT INTO pastExercises (name, durationSecs, timeRemaining, restPeriodSecs, reps) VALUES (?, ?, ?, ?, ?)',
    [exercise.name, exercise.durationSecs, exercise.timeRemaining, exercise.restPeriodSecs, exercise.reps],
    function (err) {
      if (err) {
        console.error('Error inserting past exercise:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(201).json({ id: this.lastID, ...exercise });
      }
    },
  );
}

function getPastExercises(req, res) {
  db.all('SELECT name, durationSecs, timeRemaining, restPeriodSecs, reps FROM pastExercises', (err, rows) => {
    if (err) {
      console.error('Error getting past exercises:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
}

function clearExercises(req, res) {
  // Clear exercises from the database
  db.run('DELETE FROM exercises', (err) => {
    if (err) {
      console.error('Error clearing exercises:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.sendStatus(204);
    }
  });
}

app.get('/exercises', getExercises);
app.get('/pastExercises', getPastExercises);
app.post('/exercises', postExercise);
app.post('/pastExercises', postPastExercise);
app.delete('/exercises', clearExercises);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'create.html'));
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
