checkAndAddUserSimulated();


var modal = document.getElementById( & quot; myModal & quot;);
var btn = document.getElementById( & quot; myBtn & quot;);
var span = document.getElementsByClassName( & quot; close & quot;)[0];

// btn.onclick = function() { modal.style.display = &quot;block&quot;; document.getElementById(&quot;formContainer&quot;).style.display = &quot;block&quot;; }
// span.onclick = function() { modal.style.display = &quot;none&quot;; }
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = & quot;
        none & quot;;
    }
}

let sentCode = & quot; & quot;; // Store the generated code
let countdownInterval;

async function sendCode() {
        var emailInput = document.getElementById( & quot; email & quot;);
        var firstNameInput = document.getElementById( & quot; firstName & quot;);
        var lastNameInput = document.getElementById( & quot; lastName & quot;);

        var email = emailInput.value.trim();
        var firstName = firstNameInput.value.trim();
        var lastName = lastNameInput.value.trim();

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var namePattern = /^[A-Za-z]{3,}$/;

        var emailValid = emailPattern.test(email);
        var firstNameValid = namePattern.test(firstName);
        var lastNameValid = namePattern.test(lastName);

document.getElementById( & quot; emailError & quot;).style.display = emailValid ? & quot;
none & quot;: & quot;
block & quot;;
document.getElementById( & quot; firstNameError & quot;).style.display = firstNameValid ? & quot;
none & quot;: & quot;
block & quot;;
document.getElementById( & quot; lastNameError & quot;).style.display = lastNameValid ? & quot;
none & quot;: & quot;
block & quot;;

if (!emailValid || !firstNameValid || !lastNameValid) {
    return; // Stop execution if inputs are invalid
}

// &#9989; Check if email already exists 
const emailExists = await checkEmailExists(email);
if (emailExists) {
    alert( & quot; Email already exists, please enter a new email. & quot;);
    return; // Stop execution if email exists
}

// &#9989; Disable the button to prevent multiple clicks
var sendCodeButton = document.getElementById( & quot; sendCodeButton & quot;);
sendCodeButton.disabled = true;
sendCodeButton.innerHTML = `<span class='loaderr'/>`; // Show loading icon

let sentCode = Math.floor(100000 + Math.random() * 900000).toString();
sessionStorage.setItem( & quot; sentCode & quot;, sentCode);

fetch( & quot; https: //script.google.com/macros/s/AKfycbxnD7q-yUxMIAWA9DV1mSh2qlYpBZZoZZyCTL8WkFfUCCIlBjbjUOd38Yj5VKHZLo40/exec&quot;, {
method: & quot; POST & quot;,
mode: & quot; no - cors & quot;,
headers: {
    &
    quot;Content - Type & quot;: & quot;application / json & quot;
},
body: JSON.stringify({
    action: & quot;sendCode & quot;,
    email: email,
    firstName: firstName,
    code: sentCode
})
})
.then(() = & gt;
    {
        // &#9989; Disable input fields after sending code
        emailInput.disabled = true;
        firstNameInput.disabled = true;
        lastNameInput.disabled = true;

        startCountdown(30); // Start countdown timer
    })
    .catch(error = & gt;
    {
        console.error( & quot; Request failed: & quot;, error);
        sendCodeButton.disabled = false; // Re-enable button on failure
        sendCodeButton.innerHTML = & quot;
        Send Code & quot;; // Restore button text
    });
}



function startCountdown(seconds) {
    const sendCodeButton = document.getElementById( & quot; sendCodeButton & quot;);
    sendCodeButton.disabled = true;
    sendCodeButton.textContent = `Resend in ${seconds}s`;

    let countdownInterval = setInterval(() = & gt;
    {
        seconds--;
        if (seconds & gt; 0) {
            sendCodeButton.textContent = `Resend in ${seconds}s`;
        } else {
            clearInterval(countdownInterval);
            sendCodeButton.disabled = false;
            sendCodeButton.textContent = & quot;
            Send Code & quot;;
        }
    }, 1000);
}

async function validateForm() {
    var submitButton = document.getElementById( & quot; SubmitButton & quot;);
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class='loaderr'/>`; // Show loading icon

    var verificationCodeInput = document.getElementById( & quot; verificationCode & quot;).value.trim();
    document.getElementById( & quot; codeRequiredError & quot;).style.display = & quot;
    none & quot;;
    document.getElementById( & quot; codeError & quot;).style.display = & quot;
    none & quot;;
    let storedCode = sessionStorage.getItem( & quot; sentCode & quot;);

    var modal = document.getElementById( & quot; myModal & quot;);
    // var btn = document.getElementById(&quot;myBtn&quot;);
    // var span = document.getElementsByClassName(&quot;close&quot;)[0];

    if (!verificationCodeInput) {
        document.getElementById( & quot; codeRequiredError & quot;).style.display = & quot;
        block & quot;;
        resetButton(); // Reset button if validation fails
    } else if (verificationCodeInput !== storedCode) {
        document.getElementById( & quot; codeError & quot;).style.display = & quot;
        block & quot;;
        resetButton(); // Reset button if validation fails
    } else {
        // alert(&quot;Code verified successfully!&quot;);
        try {
            const userId = await getTelegramUserId();
            const messageSent = await sendTelegramMessage(userId, & quot; You have been registered & quot;);
            modal.style.display = & quot;
            none & quot;;
            if (messageSent) {
                await addUserToGoogleSheet(userId, document.getElementById( & quot; email & quot;).value.trim(), document.getElementById( & quot; firstName & quot;).value.trim(), document.getElementById( & quot; lastName & quot;).value.trim());
                resetForm();
                alert( & quot; Thanks
                    for joining BigTech NG! & quot;);
            }
        } catch (error) {
            alert( & quot; Registration failed: & quot; + error);
        }
    }
    resetButton(); // Reset button if validation fails
}

function resetButton() {
    var submitButton = document.getElementById( & quot; SubmitButton & quot;);
    submitButton.disabled = false;
    submitButton.innerHTML = & quot;
    Submit & quot;;
}

function resetForm() {
    document.getElementById( & quot; registrationForm & quot;).reset(); // Resets the form fields
    document.getElementById( & quot; emailError & quot;).style.display = & quot;
    none & quot;;
    document.getElementById( & quot; firstNameError & quot;).style.display = & quot;
    none & quot;;
    document.getElementById( & quot; lastNameError & quot;).style.display = & quot;
    none & quot;;
    document.getElementById( & quot; codeError & quot;).style.display = & quot;
    none & quot;;
    document.getElementById( & quot; codeRequiredError & quot;).style.display = & quot;
    none & quot;;
}
  

