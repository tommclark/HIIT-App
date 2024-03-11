let startBtn = document.querySelector("#start");
let saveBtn = document.querySelector("#save");
let resetBtn = document.querySelector("#reset");
let clearBtn = document.querySelector("#clear");
let addBtn = document.querySelector("#add");

let exerciseInput = document.querySelector(".exercisepopup");

let exerciseList = document.querySelector('#exerciselist');
let exercises = [];

let timerStatus = false;

let hour = 0o0;
let minute = 0o0;
let second = 0o0;
let ms = 0o0;

startBtn.addEventListener('click', function () {
    if (timerStatus) {
        timerStatus = false;
    }
    else {
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

    document.querySelector('#hr').textContent = "00";
    document.querySelector('#min').textContent = "00";
    document.querySelector('#sec').textContent = "00";
    document.querySelector('#ms').textContent = "00";
});




clearBtn.addEventListener('click', async function clearExercises() {
    const response = await fetch('exercises', {
        method: 'DELETE',
    });

    if (response.ok) {
        exercises = await response.json();
        while (exerciseList.hasChildNodes()) {
            exerciseList.removeChild(exerciseList.firstChild);
        }
    } else {
        console.log('failed to clear exercises', response);
    }
});




saveBtn.addEventListener('click', saveTime);

addBtn.addEventListener('click', function () {
    exerciseInput.style.display = "block";
});


async function saveTime() {
    console.log(exerciseList);

    let currentTime = {
        hour: hour,
        minute: minute,
        second: second,
        ms: ms
    };
    let currentTimeString = JSON.stringify(currentTime);

    let exerciseName = document.querySelector('#exercise').value;

    const payload = { name: exerciseName, msg: currentTimeString };
    console.log('Payload', currentTimeString, exerciseName);

    const response = await fetch('exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (response.ok) {

        const updatedExercises = await response.json();
        console.log(updatedExercises);
        console.log(exerciseList);
        while (exerciseList.hasChildNodes()) {
            exerciseList.removeChild(exerciseList.firstChild);
        }

        showExercises(updatedExercises, exerciseList);
    } else {
        console.log('failed to send message', response);
    }
}



function showExercises(exercises, where) {
    for (const exercise of exercises) {
        const li = document.createElement('li');
        li.textContent = `${exercise.name}: ${exercise.msg}`;
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
        ms++;

        if (ms == 100) {
            second++;
            ms = 0;
        }

        if (second == 60) {
            minute++;
            second = 0;
        }

        if (minute == 60) {
            hour++;
            minute = 0;
            second = 0;
        }

        let hrString = hour;
        let minString = minute;
        let secString = second;
        let msString = ms;

        // pads the first 0 if hour, min, second or ms is less than 10
        if (hour < 10) {
            hrString = "0" + hrString;
        }

        if (minute < 10) {
            minString = "0" + minString;
        }

        if (second < 10) {
            secString = "0" + secString;
        }

        if (ms < 10) {
            msString = "0" + msString;
        }

        document.querySelector('#hr').textContent = hrString;
        document.querySelector('#min').textContent = minString;
        document.querySelector('#sec').textContent = secString;
        document.querySelector('#ms').textContent = msString;


        setTimeout(function () { timer(); }, 1);
    }
}


function pageLoaded() {
    loadExercises();
}

pageLoaded();