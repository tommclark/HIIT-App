class Exercise {
  constructor(name, durationSecs, restPeriodSecs, reps, description) {
    this.name = name;
    this.durationSecs = durationSecs;
    this.restPeriodSecs = restPeriodSecs;
    this.reps = reps;
    this.description = description;
  }
}


// Create Exercise objects
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

  // Create a new Exercise object
  const newExercise = new Exercise(
    exerciseName,
    exerciseDurationMinutes * 60 + exerciseDurationSeconds,
    exerciseRestPeriodMinutes * 60 + exerciseRestPeriodSeconds,
    exerciseReps,
    exerciseDescription,
  );

  // Add the new exercise to the exercises array
  exercises.push(newExercise);

  // Save the new exercise
  saveExercise(exerciseName);
});

// Function to populate the dropdown with Exercise options
// function populateExerciseDropdown() {
//   const exerciseDropdown = document.querySelector('#exercises');

//   // Clear existing options
//   exerciseDropdown.innerHTML = '';

//   // Create and append options
//   exercises.forEach((exercise) => {
//     const option = document.createElement('option');
//     option.value = exercise.name;
//     option.textContent = exercise.name;
//     exerciseDropdown.appendChild(option);
//   });
// }

// Add event listener to the dropdown
document.querySelector('#exercisesDropdown').addEventListener('change', function () {
  const selectedExercise = this.value;
  saveExercise(selectedExercise);
});

// Function to save the selected exercise
function saveExercise(selectedExercise) {
  // Find the selected exercise object from the array
  const exercise = exercises.find(exercise => exercise.name === selectedExercise);

  fetch('/exercises', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: exercise.name,
      durationSecs: exercise.durationSecs, // Corrected property name
      restPeriodSecs: exercise.restPeriodSecs, // Corrected property name
      reps: exercise.reps,
      description: exercise.description,
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
      populateExerciseList(); // Update the list of exercises after saving
    })
    .catch(error => {
      // Handle error
      console.error('There was a problem with your fetch operation:', error);
    });
}


// Function to populate the dropdown with Exercise options
function populateExerciseDropdown() {
  const exerciseDropdown = document.querySelector('#exercisesDropdown');

  // Clear existing options
  exerciseDropdown.innerHTML = '';

  // Create and append options
  exercises.forEach((exercise) => {
    const option = document.createElement('option');
    option.value = exercise.name;
    option.textContent = exercise.name;
    exerciseDropdown.appendChild(option);
  });
}


// Function to populate the exercise list
function populateExerciseList() {
  fetch('/exercises')
    .then(response => response.json())
    .then(data => {
      const exerciseList = document.querySelector('#exerciseList');
      exerciseList.innerHTML = ''; // Clear previous list items
      data.forEach(exercise => {
        console.log(exercise);
        const listItem = document.createElement('li');

        console.log(exercise.durationSecs);
        // Calculate minutes and seconds for duration
        const mins = Math.floor(exercise.durationSecs / 60);
        const secs = exercise.durationSecs % 60;


        // // Calculate minutes and seconds for rest period
        const restMins = Math.floor(exercise.restPeriodSecs / 60);
        const restSecs = exercise.restPeriodSecs % 60;

        // Display the exercise details in the list item
        listItem.textContent = exercise.name + ': ' + mins + ' minute(s) ' + secs + ' seconds, ' + restMins + ' minute(s) ' + restSecs + ' seconds rest, ' + exercise.reps + ' reps. ' + exercise.description;
        exerciseList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching exercises:', error));
}

// Call the function to populate the dropdown on page load
window.addEventListener('load', () => {
  populateExerciseDropdown();
  populateExerciseList(); // Call this function to populate the exercise list as well
});
