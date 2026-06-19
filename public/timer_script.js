const timer = document.getElementById("timer");
const closeTimerBtn = document.getElementById("close-timer");
const progressBar = document.getElementById("progress-bar");
const clockText = document.getElementById("clock-text");

const r = 24/100 * window.innerWidth;
const circumference = 2 * Math.PI * r;
let interval;

closeTimerBtn.addEventListener("click", () => {
    timer.style.display = 'none';
});

export default function runTimer(value) {
    clearInterval(interval);
    value = value * 60;
    const totalValue = value;
    let percent = 100;
    progressBar.style.strokeDasharray = circumference;
    progressBar.style.strokeDashoffset = circumference * (1 - percent/100);
    interval = setInterval(() => {
        percent = (value / totalValue) * 100;
        progressBar.style.strokeDashoffset = circumference * (1 - percent/100);
        clockText.innerText = value < 60 ? `0:${value}` : `${parseInt(value/60)}:${value%60 < 10 ? '0' + value%60 : value%60}`;
        if(!value) clearInterval(interval);
        value--;
    }, 1000);
}