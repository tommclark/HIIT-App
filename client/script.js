// let currentlySelectedExercise = document.querySelector("#currentlySelected");

const startBtn = document.querySelector('#start');
const saveBtn = document.querySelector('#save');
const resetBtn = document.querySelector('#reset');
const clearBtn = document.querySelector('#clear');
const addBtn = document.querySelector('#add');

const exerciseInput = document.querySelector('.exercisepopup');

const exerciseList = document.querySelector('#exerciselist');

let totalExerciseSecs;
let totalRestSecs;

// When the exercise starts
document.querySelector('#progressBar').style.width = '100%';
document.querySelector('#progressBar').style.transitionDuration = totalExerciseSecs + 's';

// When the rest period starts
document.querySelector('#progressBar').style.width = '0%';
document.querySelector('#progressBar').style.transitionDuration = totalRestSecs + 's';

let exercises = [];
let currentlySelectedExercise;
let timerStatus = false;

let repsDone = 0;

// let hour = 0o0;
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
  // hour = 0;
  minute = 0;
  second = 0;
  ms = 0;

  // document.querySelector('#hr').textContent = '00';
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


async function saveExercise() {
  try {
    const exercise = currentlySelectedExercise;
    const timeRemaining = minute * 60 + second;

    const response = await fetch('/pastExercises', {
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
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Exercise saved:', data);
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
  }
}


function showExercises(exercises, where) {
  for (const exercise of exercises) {
    const li = document.createElement('li');

    const mins = Math.floor(exercise.durationSecs / 60);
    const secs = exercise.durationSecs % 60;

    const totalDurationSecs = exercise.durationSecs;
    const totalMins = Math.floor(totalDurationSecs / 60);
    const totalSecs = totalDurationSecs % 60;

    // Calculate minutes and seconds for rest period
    const restMins = Math.floor(exercise.restPeriodSecs / 60);
    const restSecs = exercise.restPeriodSecs % 60;

    li.textContent = exercise.name + ': ' + mins + ' minute(s) ' + secs + ' seconds, ' + restMins + ' minute(s) ' + restSecs + ' seconds rest, ' + exercise.reps + ' reps. ' + exercise.description;

    // Add event listener to list item
    li.addEventListener('click', function () {
      // Set timer to exercise duration
      repsDone = 0;
      minute = totalMins;
      second = totalSecs;

      // Update timer display
      document.querySelector('#min').textContent = minute < 10 ? '0' + minute : minute;
      document.querySelector('#sec').textContent = second < 10 ? '0' + second : second;
      document.querySelector('#ms').textContent = '00';

      // Update currentlySelectedExercise
      currentlySelectedExercise = exercise;

      totalExerciseSecs = currentlySelectedExercise.durationSecs;
      totalRestSecs = currentlySelectedExercise.restPeriodSecs;

      document.querySelector('#currentlySelected').textContent = `Currently Selected Exercise: ${exercise.name} (${repsDone}/${exercise.reps} reps)`;
      startBtn.disabled = false;
    });

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
      minute = 59;
      second = 59;
    }

    // Update timer display
    const minString = minute < 10 ? '0' + minute : minute;
    const secString = second < 10 ? '0' + second : second;
    const msString = ms < 10 ? '0' + ms : ms;

    document.querySelector('#min').textContent = minString;
    document.querySelector('#sec').textContent = secString;
    document.querySelector('#ms').textContent = msString;

    // Calculate progress bar width based on total exercise duration
    const exerciseProgress = (totalExerciseSecs - (minute * 60 + second)) / totalExerciseSecs * 100;
    document.querySelector('#progressBar').style.width = exerciseProgress + '%';

    // Stop the timer when it reaches 0
    if (minute === 0 && second === 0 && ms === 0) {
      repsDone += 1;
      console.log(repsDone);

      document.querySelector('#currentlySelected').textContent = `Currently Selected Exercise: ${currentlySelectedExercise.name} (${repsDone}/${currentlySelectedExercise.reps} reps)`;

      timerStatus = false;
      startBtn.disabled = true;
      if (repsDone === currentlySelectedExercise.reps) {
        // Stop the timer when repsDone equals the selected exercise's reps
        timerStatus = false;
        startBtn.disabled = true;
        console.log('exercise completed');
        repsDone = 0;
        return; // Exit the function to prevent further actions
      }
      // Load rest time
      const restMins = Math.floor(currentlySelectedExercise.restPeriodSecs / 60);
      const restSecs = currentlySelectedExercise.restPeriodSecs % 60;

      minute = restMins;
      second = restSecs;
      ms = 0;

      // Update timer display with rest time
      document.querySelector('#min').textContent = restMins < 10 ? '0' + restMins : restMins;
      document.querySelector('#sec').textContent = restSecs < 10 ? '0' + restSecs : restSecs;
      document.querySelector('#ms').textContent = '00';

      // Start rest timer immediately
      restTimer();
    } else {
      setTimeout(function () { timer(); }, 10);
    }
  }
}

function restTimer() {
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
    minute = 59;
    second = 59;
  }

  // Update timer display
  document.querySelector('#min').textContent = minute < 10 ? '0' + minute : minute;
  document.querySelector('#sec').textContent = second < 10 ? '0' + second : second;

  // Calculate progress bar width based on total rest duration
  const restProgress = (totalRestSecs - (minute * 60 + second)) / totalRestSecs * 100;
  document.querySelector('#progressBar').style.width = (100 - restProgress) + '%';

  // Stop rest timer when it reaches 0
  if (minute === 0 && second === 0 && ms === 0) {
    // Reset timer to exercise duration
    minute = Math.floor(currentlySelectedExercise.durationSecs / 60);
    second = currentlySelectedExercise.durationSecs % 60;
    ms = 0;

    // Update timer display with exercise duration
    document.querySelector('#min').textContent = minute < 10 ? '0' + minute : minute;
    document.querySelector('#sec').textContent = second < 10 ? '0' + second : second;
    document.querySelector('#ms').textContent = '00';

    // Start timer immediately
    timerStatus = true;
    timer();
  } else {
    setTimeout(function () { restTimer(); }, 10);
  }
}


function pageLoaded() {
  loadExercises();
}

pageLoaded();
