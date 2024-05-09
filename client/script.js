// let currentlySelectedExercise = document.querySelector("#currentlySelected");

const startBtn = document.querySelector('#start');
const saveBtn = document.querySelector('#save');
const resetBtn = document.querySelector('#reset');
const clearBtn = document.querySelector('#clear');
const addBtn = document.querySelector('#add');

const exerciseInput = document.querySelector('.exercisepopup');

const exerciseList = document.querySelector('#exerciselist');
let exercises = [];
let currentlySelectedExercise = exercises[0];
let timerStatus = false;

let hour = 0o0;
let minute = 0o0;
let second = 0o0;
let ms = 0o0;

startBtn.disabled = true;


startBtn.addEventListener('click', function () {
  if (timerStatus) {
    timerStatus = false;
  } else {
    timerStatus = true;
    timer();
  }
});

resetBtn.addEventListener('click', function () {
  timerStatus = false;
  hour = 0;
  minute = 0;
  second = 0;
  ms = 0;

  document.querySelector('#hr').textContent = '00';
  document.querySelector('#min').textContent = '00';
  document.querySelector('#sec').textContent = '00';
  document.querySelector('#ms').textContent = '00';

  startBtn.disabled = true;
  document.querySelector('#currentlySelected').textContent = 'Currently Selected Exercise: ';
});


clearBtn.addEventListener('click', async function clearExercises() {
  const response = await fetch('exercises', {
    method: 'DELETE',
  });

  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      exercises = await response.json();
    }
    while (exerciseList.hasChildNodes()) {
      exerciseList.removeChild(exerciseList.firstChild);
    }
  } else {
    console.log('failed to clear exercises', response);
  }
  document.querySelector('#currentlySelected').textContent = 'Currently Selected Exercise: ';
});


saveBtn.addEventListener('click', saveExercise);

addBtn.addEventListener('click', function () {
  exerciseInput.style.display = 'block';
});

// TODO: create new database called past workouts, and make this save button save the currently loaded workout to the database. Add a new page that displays past workouts.
function saveExercise() {
  // Find the selected exercise object from the array
  // const exercise = exercises.find(exercise => exercise.name === selectedExercise);
  const exercise = currentlySelectedExercise;

  const timeRemaining = hour * 3600 + minute * 60 + second;

  fetch('/pastExercises', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: exercise.name,
      durationSecs: exercise.durationSecs,
      timeRemaining: timeRemaining,
      restPeriodSecs: exercise.restPeriodSecs,
      reps: exercise.reps,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle successful response if needed
      console.log('Exercise saved:', data);
    })
    .catch(error => {
      // Handle error
      console.error('There was a problem with your fetch operation:', error);
    });
}


function showExercises(exercises, where) {
  for (const exercise of exercises) {
    const li = document.createElement('li');


    const mins = Math.floor(exercise.durationSecs / 60);
    const secs = exercise.durationSecs % 60;

    const totalDurationSecs = exercise.durationSecs * exercise.reps;
    const totalMins = Math.floor(totalDurationSecs / 60);
    const totalSecs = totalDurationSecs % 60;

    // Calculate minutes and seconds for rest period
    const restMins = Math.floor(exercise.restPeriodSecs / 60);
    const restSecs = exercise.restPeriodSecs % 60;

    li.textContent = exercise.name + ': ' + mins + ' minute(s) ' + secs + ' seconds, ' + restMins + ' minute(s) ' + restSecs + ' seconds rest, ' + exercise.reps + ' reps. ' + exercise.description;

    // Add event listener to list item
    li.addEventListener('click', function () {
      // Set timer to exercise duration
      minute = totalMins;
      second = totalSecs;
      // Update timer display
      document.querySelector('#min').textContent = minute < 10 ? '0' + minute : minute;
      document.querySelector('#sec').textContent = second < 10 ? '0' + second : second;
      document.querySelector('#ms').textContent = '00';

      document.querySelector('#currentlySelected').textContent = `Currently Selected Exercise: ${exercise.name} (${exercise.reps} reps)`;
      startBtn.disabled = false;
    });

    currentlySelectedExercise = exercise;

    where.append(li);
  }
}


async function loadExercises() {
  const response = await fetch('exercises');

  if (response.ok) {
    exercises = await response.json();
  } else {
    exercises = ['failed to load exercises'];
  }

  showExercises(exercises, exerciseList);
}


function timer() {
  if (timerStatus) {
    ms--;

    if (ms === -1) {
      second--;
      ms = 99;
    }

    if (second === -1) {
      minute--;
      second = 59;
    }

    if (minute === -1) {
      hour--;
      minute = 59;
      second = 59;
    }

    let hrString = hour;
    let minString = minute;
    let secString = second;
    let msString = ms;

    // pads the first 0 if hour, min, second or ms is less than 10
    if (hour < 10) {
      hrString = '0' + hrString;
    }

    if (minute < 10) {
      minString = '0' + minString;
    }

    if (second < 10) {
      secString = '0' + secString;
    }

    if (ms < 10) {
      msString = '0' + msString;
    }

    document.querySelector('#hr').textContent = hrString;
    document.querySelector('#min').textContent = minString;
    document.querySelector('#sec').textContent = secString;
    document.querySelector('#ms').textContent = msString;

    // Stop the timer when it reaches 0
    if (hour === 0 && minute === 0 && second === 0 && ms === 0) {
      timerStatus = false;
      startBtn.disabled = true;
    } else {
      setTimeout(function () { timer(); }, 10);
    }
  }
}


function pageLoaded() {
  loadExercises();
}

pageLoaded();
