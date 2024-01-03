import {validate_password, compare_passwords, validate_email, auth} from "./login.js"
import { createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

function register_user() {
    let email_input = document.getElementById("Email").value;
    let username_input = document.getElementById("Username").value;
    let password_input = document.getElementById("Password").value;
    let confirm_password_input = document.getElementById("ConfirmPassword").value;

    if (!validate_email(email_input) && !validate_password(password_input)) {
        alert("invalid email and password");
        return;
    } else if (!validate_email(email_input)) {
        alert("invalid email");
        return;
    } else if (!validate_password(password_input)) {
        alert("invalid password");
        return;
    }

    if (!compare_passwords(password_input, confirm_password_input)) {
        alert("password and confirm password don't match");
        return;
    }

    createUserWithEmailAndPassword(auth, email_input, password_input)
    .then(function(userCredential) {

        var user = userCredential.user;

        console.log(user.uid);

        set(ref(database, 'users/' + user.uid), {
            email : email_input,
            username : username_input,
            score : 0,
            objectives : 1,
            last_login : Date.now()
        }).then(() => {
            alert("user created!");

            window.open("cookie_site.html",'_self');
        });
    })
    .catch(function(error) {
        var error_code = error.code;
        var error_message = error.message;

        alert(error_message);
    });
}

let register = event => {
    register_user();
}

try {
    document.getElementById('register').addEventListener("click", register);
} catch (error) {}