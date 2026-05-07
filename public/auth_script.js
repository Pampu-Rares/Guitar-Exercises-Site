let token = localStorage.getItem("token");
if(token) window.location.href = "/homepage";

let isLogin = true;
const title = document.querySelector("h1");
const changeForm = document.getElementById("change-form");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const errParagraph = document.getElementById("err-paragraph");

changeForm.addEventListener("click", () => {
    isLogin = !isLogin;
    title.innerText = isLogin ? "Login" : "Register";
    loginForm.style.display = isLogin ? 'flex' : 'none';
    registerForm.style.display = !isLogin ? 'flex' : 'none';
    changeForm.innerText = isLogin ? "Don't have an account?" : "Click here to log into your account";
});

async function loginCredentials() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const data = {username, password};

    fetch('/auth/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(async res => {
        const response = await res.json();
        if(response.message == "success")   {
            localStorage.setItem("token", response.token);
            window.location.href = "/homepage";
        } 
        else errParagraph.innerText = `Login unsuccessful. Check your username and password and try again. (${res.message})`
    }).catch(err => errParagraph.innerText = err.message);
}

async function registerCredentials() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const data = {username, password};

    fetch('/auth/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(async res => {
        const response = await res.json();
        if(response.message == "success") {
            localStorage.setItem("token", response.token);
            window.location.href = "/homepage";
        }
        else errParagraph.innerText = `Registration unsuccessful. (${res.message})`;
    }).catch(err => errParagraph.innerText = err.message);
}

const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");

loginBtn.addEventListener("click", loginCredentials);
registerBtn.addEventListener("click", registerCredentials);