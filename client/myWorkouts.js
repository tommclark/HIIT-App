let exercises = [];

window.onload = async function () {
  try {
    await loadExercises();
  } catch (error) {
    console.error('Error:', error);
  }
};

async function loadExercises() {
  try {
    const response = await fetch('/pastExercises');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    exercises = data;
    displayExercises(exercises);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayExercises(exercises) {
  const exerciseList = document.getElementById('pastExerciseList');
  exerciseList.innerHTML = '';
  exercises.forEach(exercise => {
    const li = document.createElement('li');
    li.textContent = `${exercise.name}, Duration: ${exercise.durationSecs} seconds, Time Remaining: ${exercise.timeRemaining} seconds, Rest Period: ${exercise.restPeriodSecs} seconds, Reps: ${exercise.reps}`;
    exerciseList.appendChild(li);
  });
}

document.getElementById('clearWorkouts').addEventListener('click', async function () {
  try {
    const response = await fetch('/pastExercises', { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Clear the exercises from the page without fetching them again
    const exerciseList = document.getElementById('pastExerciseList');
    exerciseList.innerHTML = '';
  } catch (error) {
    console.error('Error:', error);
  }
});
