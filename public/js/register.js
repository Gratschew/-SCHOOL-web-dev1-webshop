/** 
 * TODO: 8.4 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 **/




const userForm = (event) => {
    if(correctPassword()){
        var userInfo = {};
        userInfo['name'] = document.getElementById('name').value;
        userInfo['email'] = document.getElementById('email').value;
        userInfo['password'] = document.getElementById('password').value;
        const result = postOrPutJSON('/api/register', 'POST', userInfo);
        result.then(
            result => registerationSuccess(),
            error => registeratrionFfailure()
        )
    }
    else {
        createNotification('Passwords do not match! Try again.', 'notifications-container', false)
    }
    event.preventDefault();
}

// returns true if the passwords match between the input fields
const correctPassword = () => {
return document.getElementById('password').value === document.getElementById('passwordConfirmation').value;
}

const registerationSuccess = () => {
    createNotification('Registeration successful', 'notifications-container', true);
    document.getElementById("register-form").reset();
}

const registeratrionFfailure = () => {
createNotification('Registeration unsuccessful, email could be already registered', 'notifications-container', false)
}

const submitForm = document.getElementById("register-form");
submitForm.addEventListener('submit', userForm);