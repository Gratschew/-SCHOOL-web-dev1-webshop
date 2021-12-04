/** 
 * TODO: 8.4 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 **/

const constErrorMsg = 'Registeration unsuccessful';

/**
 * User form for registering as a new user
 * 
 * @param {event} event listens to event
 */
const userForm = (event) => {
    if(correctPassword()){
        var userInfo = {};
        userInfo['name'] = document.getElementById('name').value;
        userInfo['email'] = document.getElementById('email').value;
        userInfo['password'] = document.getElementById('password').value;
        const result = postOrPutJSON('/api/register', 'POST', userInfo);
        
        result.
        then( result => registerationSuccess())
        .catch(error => registerationFailure(error))
        
    }
    else {
        createNotification('Passwords do not match! Try again.', 'notifications-container', false)
    }
    event.preventDefault();
}
/**
 * returns true if the passwords match between the input fields
 * 
 */
const correctPassword = () => {
return document.getElementById('password').value === document.getElementById('passwordConfirmation').value;
}

/**
 * Successful registeration notification
 */
const registerationSuccess = () => {
    createNotification('Registeration successful', 'notifications-container', true);
    document.getElementById("register-form").reset();
}

const registerationFailure = (errorMessage) => {
    msg = errorMessage.message;
    msgLength = errorMessage.message.length

    if(msgLength > 1){
    createNotification(constErrorMsg + ' ' + msg, 'notifications-container', false)
    }
    
    else{
    createNotification(constErrorMsg, 'notifications-container', false)
    }
}

const submitForm = document.getElementById("register-form");
submitForm.addEventListener('submit', userForm);