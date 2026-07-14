//body is already declared in the other script
const openTimerBtn = document.getElementById("open-timer");
const closeTimerBtn = document.getElementById("close-timer");
const selectMinutes = document.getElementById("select-minutes");
const startTimer = document.getElementById("start-timer");
const timer = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const clockText = document.getElementById("clock-text");
const volumeSelector = document.getElementById("volume-changer")

const main = document.querySelector("main")

const r = progressBar.r.baseVal.value;
const circumference = 2 * Math.PI * r;
progressBar.style.strokeDasharray = circumference;
let interval, totalValue, value;
const timerEndSound = new Audio("./AudioFiles/timerEnd.wav")
timerEndSound.volume = localStorage.getItem("timerVolume") || 1;
if(timerEndSound.volume != 1) volumeSelector.value = timerEndSound.volume * 100

function toggleMainBlur() {
    main.classList.toggle("blurred")
    main.style.userSelect = main.style.userSelect == 'none' ? 'auto' : 'none'
}

openTimerBtn.addEventListener("click", () => {
    timer.style.display = 'flex';
    toggleMainBlur()
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        body.style.overflowY = "hidden";
    }, 200);
});

closeTimerBtn.addEventListener("click", () => {
    toggleMainBlur()
    timer.style.display = 'none';
    body.style.overflowY = 'scroll';
});

function runTimer() {
    value--
    percent = (value / totalValue) * 100;
    progressBar.style.strokeDashoffset = circumference * (1 - percent/100);
    clockText.textContent = `${parseInt(value/60)}:${value%60 < 10 ? '0' + value%60 : value%60}`;
    interval = setInterval(() => {
        value--
        percent = (value / totalValue) * 100;
        progressBar.style.strokeDashoffset = circumference * (1 - percent/100);
        clockText.textContent = `${parseInt(value/60)}:${value%60 < 10 ? '0' + value%60 : value%60}`;
        if(!value) {
            clockText.style.fill = '#C7EBBC';
            clearInterval(interval);    
            setTimeout(() => {
                timerEndSound.play()
                resetTimer()
            }, 1000);
        }
    }, 1000);
}

function resetTimer() {
    startTimer.innerText = 'Play'
    value = selectMinutes.value * 60
    progressBar.style.strokeDashoffset = 0;
    clockText.textContent = `${parseInt(value/60)}:${value%60 < 10 ? '0' + value%60 : value%60}`;
    totalValue = value
    let percent = 100
    clockText.style.fill = 'white'
    clearInterval(interval)
}

startTimer.addEventListener("click", () => {
    if(startTimer.innerText === 'Play' || startTimer.innerText === 'Resume') {
        if(startTimer.innerText === 'Play')
            resetTimer()
        startTimer.innerText = 'Pause'
        runTimer()
    } else {
        startTimer.innerText = 'Resume'
        clearInterval(interval); 
    } 
});

selectMinutes.addEventListener("change", () => {
    resetTimer()
})

volumeSelector.addEventListener("change", () => {
    localStorage.setItem("timerVolume", volumeSelector.value / 100)
    timerEndSound.volume = volumeSelector.value / 100
})