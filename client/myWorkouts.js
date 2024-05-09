window.onload = function () {
  fetch('/pastExercises')
    .then(response => response.json())
    .then(data => {
      const exerciseList = document.getElementById('pastExerciseList');
      data.forEach(exercise => {
        const li = document.createElement('li');
        li.textContent = `${exercise.name}, Duration: ${exercise.durationSecs} seconds, Time Remaining: ${exercise.timeRemaining} seconds, Rest Period: ${exercise.restPeriodSecs} seconds, Reps: ${exercise.reps}`;
        exerciseList.appendChild(li);
      });
    })
    .catch(error => console.error('Error:', error));
};
