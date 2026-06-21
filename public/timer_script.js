//body is already declared in the other script
const openTimerBtn = document.getElementById("open-timer");
const closeTimerBtn = document.getElementById("close-timer");
const selectMinutes = document.getElementById("select-minutes");
const startTimer = document.getElementById("start-timer");
const timer = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const clockText = document.getElementById("clock-text");

const r = progressBar.r.baseVal.value;
const circumference = 2 * Math.PI * r;
progressBar.style.strokeDasharray = circumference;
let interval;

openTimerBtn.addEventListener("click", () => {
    timer.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        body.style.overflowY = "hidden";
    }, 200);
});

closeTimerBtn.addEventListener("click", () => {
    timer.style.display = 'none';
    body.style.overflowY = 'scroll';
});

function runTimer(value) {
    clearInterval(interval);
    const totalValue = value;
    let percent = 100;
    clockText.style.fill = 'white';

    percent = (value / totalValue) * 100;
    progressBar.style.strokeDashoffset = circumference * (1 - percent/100);
    clockText.textContent = `${parseInt(value/60)}:${value%60 < 10 ? '0' + value%60 : value%60}`;
    value--;
    interval = setInterval(() => {
        percent = (value / totalValue) * 100;
        progressBar.style.strokeDashoffset = circumference * (1 - percent/100);
        clockText.textContent = `${parseInt(value/60)}:${value%60 < 10 ? '0' + value%60 : value%60}`;
        if(!value) {
            clockText.style.fill = '#C7EBBC';
            clearInterval(interval);    
            setTimeout(() => {
                startTimer.innerText = 'Start';
            }, 1000);
        }
        value--;
    }, 1000);
}

startTimer.addEventListener("click", () => {
    if(startTimer.innerText === 'Start') {
        runTimer(selectMinutes.value * 60);
        startTimer.innerText = 'Pause';
    } else {
        startTimer.innerText = 'Start'; // 'Play'
        clearInterval(interval); 
    } 
});