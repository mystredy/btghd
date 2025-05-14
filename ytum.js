checkAndAddUserSimulated();


async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600;

    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };
    const payload = {
        iss: mtns, // Replace with your service account client_email
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        aud: 'https://oauth2.googleapis.com/token',
        exp: expiry,
        iat: now
    };
    const jwt = KJUR.jws.JWS.sign('RS256', JSON.stringify(header), JSON.stringify(payload), mgtr); // Replace mgtr with your private key
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        })
    });
    const data = await response.json();
    return data.access_token;
}

// Function to get Telegram user ID from Telegram Web App
function getTelegramUserId() {
    return new Promise((resolve, reject) => {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        var isTelegram = /Telegram/i.test(userAgent) || window.Telegram?.WebApp;
        if (isTelegram && window.Telegram.WebApp.initDataUnsafe?.user) {
            var user = window.Telegram.WebApp.initDataUnsafe.user;
            resolve(user.id);
        } else {
            // Add a delay before showing the prompt
            setTimeout(() => {
                if (confirm("Kindly visit our Telegram Web App for more features. Click OK to proceed.")) {
                    window.location.href = "https://t.me/bigtechngbot/web?startapp";
                }
            }, 30000);
            reject("Not in Telegram Web App");
        }
    });
}

// modal finctions
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() { 
    modal.style.display = "block"; 
    document.getElementById("formContainer").style.display = "block"; 
}
span.onclick = function() { 
    modal.style.display = "none"; 
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
let sentCode = "";
let countdownInterval;
async function sendCode() {
    var emailInput = document.getElementById("email");
    var firstNameInput = document.getElementById("firstName");
    var lastNameInput = document.getElementById("lastName");
    var email = emailInput.value.trim();
    var firstName = firstNameInput.value.trim();
    var lastName = lastNameInput.value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var namePattern = /^[A-Za-z]{3,}$/;
    var emailValid = emailPattern.test(email);
    var firstNameValid = namePattern.test(firstName);
    var lastNameValid = namePattern.test(lastName);
    document.getElementById("emailError").style.display = emailValid ? "none" : "block";
    document.getElementById("firstNameError").style.display = firstNameValid ? "none" : "block";
    document.getElementById("lastNameError").style.display = lastNameValid ? "none" : "block";
    if (!emailValid || !firstNameValid || !lastNameValid) {
        return;
    }
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
        alert("Email already exists, please enter a new email.");
        return;
    }
    var sendCodeButton = document.getElementById("sendCodeButton");
    sendCodeButton.disabled = true;
    sendCodeButton.innerHTML = `<span class='loaderr'></span>`;
    sentCode = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem("sentCode", sentCode);
    fetch("https://script.google.com/macros/s/AKfycbxnD7q-yUxMIAWA9DV1mSh2qlYpBZZoZZyCTL8WkFfUCCIlBjbjUOd38Yj5VKHZLo40/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "sendCode",
            email: email,
            firstName: firstName,
            code: sentCode
        })
    })
        .then(() => {
            emailInput.disabled = true;
            firstNameInput.disabled = true;
            lastNameInput.disabled = true;
            startCountdown(30);
        })
        .catch(error => {
            console.error("Request failed:", error);
            sendCodeButton.disabled = false;
            sendCodeButton.innerHTML = "Send Code";
        });
}
function startCountdown(seconds) {
    const sendCodeButton = document.getElementById("sendCodeButton");
    sendCodeButton.disabled = true;
    sendCodeButton.textContent = `Resend in ${seconds}s`;
    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            sendCodeButton.textContent = `Resend in ${seconds}s`;
        } else {
            clearInterval(countdownInterval);
            sendCodeButton.disabled = false;
            sendCodeButton.textContent = "Send Code";
        }
    }, 1000);
}
async function validateForm() {
    var submitButton = document.getElementById("SubmitButton");
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class='loaderr'></span>`;
    var verificationCodeInput = document.getElementById("verificationCode").value.trim();
    document.getElementById("codeRequiredError").style.display = "none";
    document.getElementById("codeError").style.display = "none";
    let storedCode = sessionStorage.getItem("sentCode");
    var modal = document.getElementById("myModal");
    if (!verificationCodeInput) {
        document.getElementById("codeRequiredError").style.display = "block";
        resetButton();
    } else if (verificationCodeInput !== storedCode) {
        document.getElementById("codeError").style.display = "block";
        resetButton();
    } else {
        try {
            const userId = await getTelegramUserId();
            const messageSent = await sendTelegramMessage(userId, "You have been registered");
            modal.style.display = "none";
            if (messageSent) {
                await addUserToGoogleSheet(
                    userId,
                    document.getElementById("email").value.trim(),
                    document.getElementById("firstName").value.trim(),
                    document.getElementById("lastName").value.trim()
                );
                resetForm();
                alert("Thanks for joining BigTech NG!");
            }
        } catch (error) {
            alert("Registration failed: " + error);
        }
    }

    resetButton();
}
function resetButton() {
    var submitButton = document.getElementById("SubmitButton");
    submitButton.disabled = false;
    submitButton.innerHTML = "Submit";
}
function resetForm() {
    document.getElementById("registrationForm").reset();
    document.getElementById("emailError").style.display = "none";
    document.getElementById("firstNameError").style.display = "none";
    document.getElementById("lastNameError").style.display = "none";
    document.getElementById("codeError").style.display = "none";
    document.getElementById("codeRequiredError").style.display = "none";
}
