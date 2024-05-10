const startBtn = document.querySelector('#start');
const saveBtn = document.querySelector('#save');
const resetBtn = document.querySelector('#reset');
const clearBtn = document.querySelector('#clear');

saveBtn.disabled = true;

const exerciseList = document.querySelector('#exerciselist');

let totalExerciseSecs;
let totalRestSecs;

let previousSelectedExercise;

// Progress bar before exercise started
document.querySelector('#progressBar').style.width = '100%';
document.querySelector('#progressBar').style.transitionDuration = totalExerciseSecs + 's';

// Progress bar when rest period starts
document.querySelector('#progressBar').style.width = '0%';
document.querySelector('#progressBar').style.transitionDuration = totalRestSecs + 's';

let exercises = [];
let currentlySelectedExercise;
let timerStatus = false;


let repsDone = 0;

let minute = 0o0;
let second = 0o0;
let ms = 0o0;

startBtn.disabled = true;


startBtn.addEventListener('click', function () {
  if (timerStatus) {
    timerStatus = false;
  } else {
    timerStatus = true;
    startBtn.disabled = false;
    timer();
  }
});

resetBtn.addEventListener('click', function () {
  timerStatus = false;
  minute = 0;
  second = 0;
  ms = 0;

  document.querySelector('#min').textContent = '00';
  document.querySelector('#sec').textContent = '00';
  document.querySelector('#ms').textContent = '00';

  startBtn.disabled = true;
  document.querySelector('#currentlySelected').textContent = 'Currently Selected Exercise: ';
  // When the reset button is clicked, the selected event is no longer highlighted
  if (previousSelectedExercise) {
    previousSelectedExercise.style.backgroundColor = '#f9f9f9';
  }
  currentlySelectedExercise = null;
  saveBtn.disabled = true;
  document.querySelector('#progressBar').style.width = '0%';
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
  saveBtn.disabled = true;
});


saveBtn.addEventListener('click', saveExercise);


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


    const restMins = Math.floor(exercise.restPeriodSecs / 60);
    const restSecs = exercise.restPeriodSecs % 60;

    li.textContent = exercise.name + ': ' + mins + ' minute(s) ' + secs + ' seconds, ' + restMins + ' minute(s) ' + restSecs + ' seconds rest, ' + exercise.reps + ' reps. ' + exercise.description;


    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function (event) {
      event.stopPropagation();
      deleteExercise(exercise.name, li);
    });
    li.appendChild(deleteButton);

    li.addEventListener('click', function () {
      // Set timer to exercise duration
      repsDone = 0;
      minute = totalMins;
      second = totalSecs;
      // Update timer
      document.querySelector('#min').textContent = minute < 10 ? '0' + minute : minute;
      document.querySelector('#sec').textContent = second < 10 ? '0' + second : second;
      document.querySelector('#ms').textContent = '00';

      // Selected exercise changes colour

      if (previousSelectedExercise) {
        previousSelectedExercise.style.backgroundColor = ''; // Reset previous background color
      }
      previousSelectedExercise = li;
      currentlySelectedExercise = exercise;

      totalExerciseSecs = currentlySelectedExercise.durationSecs;
      totalRestSecs = currentlySelectedExercise.restPeriodSecs;

      document.querySelector('#currentlySelected').textContent = `Currently Selected Exercise: ${exercise.name} (${repsDone}/${exercise.reps} reps)`;
      startBtn.disabled = false;
      saveBtn.disabled = false;

      li.style.backgroundColor = '#A5E3A4'; // Set new background color
    });

    where.append(li);
  }
}

async function deleteExercise(exerciseName, liElement) {
  try {
    const response = await fetch(`/exercises/${exerciseName}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    console.log('Exercise deleted successfully');

    liElement.remove();
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
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

    // Update timer
    const minString = minute < 10 ? '0' + minute : minute;
    const secString = second < 10 ? '0' + second : second;
    const msString = ms < 10 ? '0' + ms : ms;

    document.querySelector('#min').textContent = minString;
    document.querySelector('#sec').textContent = secString;
    document.querySelector('#ms').textContent = msString;

    document.querySelector('#restMessage').textContent = 'Go!';

    const exerciseProgress = (totalExerciseSecs - (minute * 60 + second)) / totalExerciseSecs * 100;
    document.querySelector('#progressBar').style.width = exerciseProgress + '%';

    // Stop timer when it reaches 0
    if (minute === 0 && second === 0 && ms === 0) {
      repsDone += 1;
      console.log(repsDone);

      document.querySelector('#currentlySelected').textContent = `Currently Selected Exercise: ${currentlySelectedExercise.name} (${repsDone}/${currentlySelectedExercise.reps} reps)`;

      timerStatus = false;
      startBtn.disabled = true;

      // Stop the timer when all reps have been completed
      if (repsDone === currentlySelectedExercise.reps) {
        timerStatus = false;
        startBtn.disabled = true;
        console.log('exercise completed');
        repsDone = 0;
        document.querySelector('#currentlySelected').textContent = 'Exercise completed. Select another exercise.';
        document.querySelector('#restMessage').textContent = 'Good job!';
        previousSelectedExercise.style.backgroundColor = '#5FAD3D';
        return;
      }
      const restMins = Math.floor(currentlySelectedExercise.restPeriodSecs / 60);
      const restSecs = currentlySelectedExercise.restPeriodSecs % 60;

      minute = restMins;
      second = restSecs;
      ms = 0;

      // Update timer display with rest time
      document.querySelector('#min').textContent = restMins < 10 ? '0' + restMins : restMins;
      document.querySelector('#sec').textContent = restSecs < 10 ? '0' + restSecs : restSecs;
      document.querySelector('#ms').textContent = '00';

      document.querySelector('#restMessage').textContent = 'Resting...';

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

  // Update timer
  document.querySelector('#min').textContent = minute < 10 ? '0' + minute : minute;
  document.querySelector('#sec').textContent = second < 10 ? '0' + second : second;

  const restProgress = (totalRestSecs - (minute * 60 + second)) / totalRestSecs * 100;
  document.querySelector('#progressBar').style.width = (100 - restProgress) + '%';

  // Stop rest timer when it reaches 0
  if (minute === 0 && second === 0 && ms === 0) {
    // Reset timer to exercise duration instead of rest
    minute = Math.floor(currentlySelectedExercise.durationSecs / 60);
    second = currentlySelectedExercise.durationSecs % 60;
    ms = 0;
    document.querySelector('#min').textContent = minute < 10 ? '0' + minute : minute;
    document.querySelector('#sec').textContent = second < 10 ? '0' + second : second;
    document.querySelector('#ms').textContent = '00';

    document.querySelector('#restMessage').textContent = 'Go!';
    timerStatus = true;
    startBtn.disabled = false; // Disable the start button during rest
    timer();
  } else {
    setTimeout(function () { restTimer(); }, 10);
  }
}


function pageLoaded() {
  loadExercises();
}

pageLoaded();
