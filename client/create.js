class Exercise {
  constructor(name, durationSecs, restPeriodSecs, reps, description) {
    this.name = name;
    this.durationSecs = durationSecs;
    this.restPeriodSecs = restPeriodSecs;
    this.reps = reps;
    this.description = description;
  }
}


const exercises = [
  new Exercise('Burpees', 90, 20, 5, 'A squat thrust with an additional stand between repetitions'),
  new Exercise('Push-ups', 90, 20, 5, 'A common calisthenics exercise performed in a prone position by raising and lowering the body using the arms'),
  new Exercise('Plank', 90, 20, 5, 'An isometric core strength exercise that involves maintaining a position similar to a push-up for the maximum possible time'),

];


const customExerciseForm = document.querySelector('#customExerciseForm');
const exerciseNameInput = document.querySelector('#exerciseName');
const exerciseDurationMinutesInput = document.querySelector('#exerciseDurationMinutes');
const exerciseDurationSecondsInput = document.querySelector('#exerciseDurationSeconds');
const exerciseRestPeriodMinutesInput = document.querySelector('#exerciseRestPeriodMinutes');
const exerciseRestPeriodSecondsInput = document.querySelector('#exerciseRestPeriodSeconds');
const exerciseRepsInput = document.querySelector('#exerciseReps');
const exerciseDescriptionInput = document.querySelector('#exerciseDescription');


customExerciseForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const exerciseName = exerciseNameInput.value;
  const exerciseDurationMinutes = parseInt(exerciseDurationMinutesInput.value);
  const exerciseDurationSeconds = parseInt(exerciseDurationSecondsInput.value);
  const exerciseRestPeriodMinutes = parseInt(exerciseRestPeriodMinutesInput.value);
  const exerciseRestPeriodSeconds = parseInt(exerciseRestPeriodSecondsInput.value);
  const exerciseReps = parseInt(exerciseRepsInput.value);
  const exerciseDescription = exerciseDescriptionInput.value;

  const newExercise = new Exercise(
    exerciseName,
    exerciseDurationMinutes * 60 + exerciseDurationSeconds,
    exerciseRestPeriodMinutes * 60 + exerciseRestPeriodSeconds,
    exerciseReps,
    exerciseDescription,
  );

  exercises.push(newExercise);

  saveExercise(exerciseName);
});


document.querySelector('#exercisesDropdown').addEventListener('change', function () {
  const selectedExercise = this.value;
  saveExercise(selectedExercise);
});


async function saveExercise(selectedExercise) {
  const exercise = exercises.find(exercise => exercise.name === selectedExercise);

  try {
    const response = await fetch('/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: exercise.name,
        durationSecs: exercise.durationSecs,
        restPeriodSecs: exercise.restPeriodSecs,
        reps: exercise.reps,
        description: exercise.description,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Exercise saved:', data);
    populateExerciseList();
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
  }
}


function populateExerciseDropdown() {
  const exerciseDropdown = document.querySelector('#exercisesDropdown');

  exerciseDropdown.innerHTML = '';

  exercises.forEach((exercise) => {
    const option = document.createElement('option');
    option.value = exercise.name;
    option.textContent = exercise.name;
    exerciseDropdown.appendChild(option);
  });
}


async function populateExerciseList() {
  try {
    const response = await fetch('/exercises');
    const data = await response.json();

    const exerciseList = document.querySelector('#exerciseList');
    exerciseList.innerHTML = '';
    data.forEach(exercise => {
      const listItem = document.createElement('li');

      const mins = Math.floor(exercise.durationSecs / 60);
      const secs = exercise.durationSecs % 60;

      const restMins = Math.floor(exercise.restPeriodSecs / 60);
      const restSecs = exercise.restPeriodSecs % 60;

      listItem.textContent = exercise.name + ': ' + mins + ' minute(s) ' + secs + ' seconds, ' + restMins + ' minute(s) ' + restSecs + ' seconds rest, ' + exercise.reps + ' reps. ' + exercise.description;
      exerciseList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching exercises:', error);
  }
}

window.addEventListener('load', () => {
  populateExerciseDropdown();
  populateExerciseList();
});
