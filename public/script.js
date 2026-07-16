const body = document.querySelector("body");

const addExerciseBtn = document.getElementById("add-exercise");
const exerciseInputForm = document.getElementById("exercise-adder-form");
const closeForm = document.getElementById("close-form");
const titleInput = document.getElementById("title");
const exerciseSelector = document.getElementById("select-exercise");
const durationSelector = document.getElementById("select-duration");
const addExerciseConfirmation = document.getElementById("add-exercise-confirmation");
const updateExerciseConfirmation = document.getElementById("update-exercise-confirmation");

const errParagraph = document.getElementById("err-paragraph");
const exercisesContainer = document.getElementById("guitar-exercises");

const logoutBtn = document.getElementById("logout");
const notLoggedInModal = document.getElementById("not-logged-in");
const loginButton = document.querySelector("#not-logged-in button");

const completedExercisesFilter = document.getElementById("complete");
const incompletedExercisesFilter = document.getElementById("incomplete");
const allExercisesFilter = document.getElementById("all");

let token = localStorage.getItem("token");
let editExerciseId;
let userId = 1;
let selectedFilterBtn = incompletedExercisesFilter;
const exerciseNames = {
    "chord_perfect": "Chord Perfect",
    "chord_changes": "Chord Changes",
    "riff_practice": "Riff Practice",
    "rithm_practice": "Rithm Practice",
    "song_practice": "Song Practice",
    "other": "Other"
};

completedExercisesFilter.addEventListener("click", () => {
    if(selectedFilterBtn === completedExercisesFilter) return ;
    selectedFilterBtn.classList.remove("selected");
    completedExercisesFilter.classList.add("selected");
    selectedFilterBtn = completedExercisesFilter;
    const allExercises = document.querySelectorAll("#guitar-exercises > div");
    allExercises.forEach(exercise => {
        if(exercise.classList.contains("completed")) exercise.style.display = "grid";
        else exercise.style.display = "none";
    });
});

incompletedExercisesFilter.addEventListener("click", () => {
    if(selectedFilterBtn === incompletedExercisesFilter) return ;
    selectedFilterBtn.classList.remove("selected");
    incompletedExercisesFilter.classList.add("selected");
    selectedFilterBtn = incompletedExercisesFilter;
    const allExercises = document.querySelectorAll("#guitar-exercises > div");
    allExercises.forEach(exercise => {
        if(exercise.classList.contains("completed")) exercise.style.display = "none";
        else exercise.style.display = "grid";
    });
});

allExercisesFilter.addEventListener("click", () => {
    if(selectedFilterBtn === allExercisesFilter) return ;
    selectedFilterBtn.classList.remove("selected");
    allExercisesFilter.classList.add("selected");
    selectedFilterBtn = allExercisesFilter;
    const allExercises = document.querySelectorAll("#guitar-exercises > div");
    allExercises.forEach(exercise => {
        exercise.style.display = "grid";
    });
});


logoutBtn.addEventListener("click", () => {
    token = "";
    localStorage.removeItem("token");
    window.location.href = '/auth';
});

addExerciseBtn.addEventListener("click", () => {
    titleInput.value = "";
    exerciseSelector.value = "chord_perfect";
    durationSelector.value = "1";

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        body.style.overflowY = "hidden";
    }, 500);

    exerciseInputForm.style.display = "flex";
    addExerciseConfirmation.style.display = "block";
    updateExerciseConfirmation.style.display = "none";
});


async function completeExercise(id, completeValue) {
    try {
        let completeEx = await fetch('/exercises/update_exercise/' + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                "completed": completeValue
            })
        });
        getExercises();
    } catch(err) {
        errParagraph.innerText = `Error: ${err.message}`;
    }
    
}

async function deleteExercise(id) {
    try {
        await fetch('/exercises/delete_exercise/' + id, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });
        getExercises();
    } catch(err) {
        errParagraph.innerText = `Error: ${err.message}`;
    }
    
}

async function editExercise(id, title, type, duration) {
    titleInput.value = title;
    exerciseSelector.value = type;
    durationSelector.value = duration;
    exerciseInputForm.style.display = "flex";

    addExerciseConfirmation.style.display = "none";
    updateExerciseConfirmation.style.display = "block";
    // need to send the id somehow
    editExerciseId = id;

    window.scrollTo({top: 0, behavior: "smooth"});
    setTimeout(() => {
        body.style.overflowY = "hidden";
    }, 500);
}

async function getExercises() {
    exercisesContainer.innerHTML = "";
    let exercises = [];
    await fetch("/exercises/", {
        headers: {
            "Authorization": token
        }
    }).then(res => res.json()).then(data => exercises = data.exercises).catch(err => errParagraph.innerText = `Error: ${err.message}`);
    if(!exercises.length) errParagraph.innerText = "Add an exercise to your routine.";
    else exercises.forEach(exercise => {
            exercisesContainer.innerHTML += `
            <div id="${exercise.id}" class="exercise ${exercise.completed === 1 ? "completed" : ""}">
                <div class="options">
                    <button class="delete-exercise-btn" onclick="deleteExercise(${exercise.id})"><img src="./Icons/trash.png"></button>
                    <button class="edit-exercise-btn" onclick="editExercise('${exercise.id}', '${exercise.title}', '${exercise.type}', '${exercise.duration}')"><img src="./Icons/options.svg"></button>
                </div>
                <p class="exercise-title">${exercise.title}</p>
                <p class="exercise-type">Type: ${exerciseNames[exercise.type]}</p>
                <p class="exercise-duration">Duration: ${exercise.duration} min</p>
                <button class="complete-exercise-btn" onclick="completeExercise(${exercise.id}, ${exercise.completed === 1 ? "0" : "1"})">${exercise.completed === 1 ?"🔁" : "☑️"}</button>
            </div>
            `;
    });
    if(selectedFilterBtn === incompletedExercisesFilter)
    {
        const allExercises = document.querySelectorAll("#guitar-exercises > div");
        allExercises.forEach(exercise => {
            if(exercise.classList.contains("completed")) exercise.style.display = "none";
            else exercise.style.display = "grid";
        });
    }
    else if(selectedFilterBtn === completedExercisesFilter) {
        const allExercises = document.querySelectorAll("#guitar-exercises > div");
        allExercises.forEach(exercise => {
            if(exercise.classList.contains("completed")) exercise.style.display = "grid";
            else exercise.style.display = "none";
        });
    }
    else {
        const allExercises = document.querySelectorAll("#guitar-exercises > div");
        allExercises.forEach(exercise => {
            exercise.style.display = "grid";
        });
    }
}

addExerciseConfirmation.addEventListener("click", async () => {
    try {
        exerciseInputForm.style.display = "none";
        body.style.overflowY = "scroll";
        const sendExercise = await fetch("/exercises/create_exercise/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                title: titleInput.value,
                type: exerciseSelector.value,
                duration: durationSelector.value
            })
        });
        const status = await sendExercise.json();
        getExercises();
        errParagraph.innerText = "";
    }   catch(err) {
        errParagraph.innerText = `Error: ${err.message}`;
    }
});

updateExerciseConfirmation.addEventListener("click", async () => {
    // editExerciseId is the variable
    try {
        exerciseInputForm.style.display = "none";
        body.style.overflowY = "scroll";
        const editExercise = await fetch('/exercises/edit/' + editExerciseId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                title: titleInput.value,
                type: exerciseSelector.value,
                duration: durationSelector.value
            })
        });
        const response = editExercise.json();
        getExercises();
        console.log(response);
        errParagraph.innerText = "";
    }   catch(err) {
        errParagraph.innerText = `Error: ${err.message}`;
    }
});

closeForm.addEventListener("click", () => {
    body.style.overflowY = "scroll";
    exerciseInputForm.style.display = "none";
});

if(!token) {
    addExerciseBtn.style.display = "none";
    notLoggedInModal.showModal();
    loginButton.addEventListener("click", () => {
        window.location.href = '/auth';
    });
} else {
    notLoggedInModal.close();
    getExercises();
}