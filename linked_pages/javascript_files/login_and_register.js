import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

var firebaseConfig = {
    apiKey: "AIzaSyBEdjIqnp-pYXlam8-xqb2HoUSsZC38oR8",
    authDomain: "cookiesite-e1b9c.firebaseapp.com",
    databaseURL: "https://cookiesite-e1b9c-default-rtdb.firebaseio.com",
    projectId: "cookiesite-e1b9c",
    storageBucket: "cookiesite-e1b9c.appspot.com",
    messagingSenderId: "1074669571083",
    appId: "1:1074669571083:web:eea2691ebb494c993e8b0e",
    measurementId: "G-JLNH44FY5J"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const database = getDatabase(app);

window.singup = login_user(e);

function register_user() {
    let email_input = document.getElementById("Email").value;
    let username_input = document.getElementById("Username").value;
    let password_input = document.getElementById("Password").value;

    if (!validate_email(email_input) && !validate_password(password_input)) {
        alert("invalid email and password");
        return;
    } else if (!validate_email(email_input)) {
        alert("invalid email");
        return;
    } else if (!validate_password(password)) {
        alert("invalid password");
        return;
    }

    createUserWithEmailAndPassword(email_input, password_input)
    .then(function() {

        var user = auth.currentUser;
        var databaseRef = database.ref();

        var user_data = {
            email : email,
            username : username_input,
            score : 0,
            objectives : 0,
            last_login : Date.now()
        }

        databaseRef.child('users/' + user.uid).set(user_data);

        alert("user created!");
    })
    .catch(function(error) {
        var error_code = error.code;
        var error_message = error.message;

        alert(error_message);
    });
}

function validate_email(email) {
    let expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email)) {
        return true;
    } else {
        return false;
    }
}

function validate_password(password) {
    if (password < 6) {
        return false;
    } 

    if (password.length <= 0) {
        return false;
    } else {
        return true;
    }
}

function validate_field(field) {
    if (field == null) {
        return false;
    } else {
        return true;
    }
}

function login_user(e) {
    let email_input = document.getElementById("Username").value;
    let password_input = document.getElementById("Password").value;

    if (!validate_email(email_input) && !validate_password(password_input)) {
        alert("invalid email and password");
        return;
    } else if (!validate_email(email_input)) {
        alert("invalid email");
        return;
    } else if (!validate_password(password)) {
        alert("invalid password");
        return;
    }

    signInWithEmailAndPassword(email_input, password_input)
    .then(function() {

        var user = auth.currentUser;
        var databaseRef = database.ref();

        var user_data = {
            last_login : Date.now()
        }

        databaseRef.child('users/' + user.uid).update(user_data);

        alert("successfuly loged in!");

    })
    .catch(function(error) {
        var error_code = error.code;
        var error_message = error.message;

        alert(error_message);
    });
}
