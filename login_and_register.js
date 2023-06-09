import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

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

function compare_passwords(password, confirm_password) {
    if (password == confirm_password) {
        return true;
    } else {
        return false;
    }
}

function validate_field(field) {
    if (field == null) {
        return false;
    } else {
        return true;
    }
}

function login_user() {
    let email_input = document.getElementById("Username").value;
    let password_input = document.getElementById("Password").value;

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

    signInWithEmailAndPassword(auth, email_input, password_input)
    .then(function(userCredential) {

        var user = userCredential.user;

        set(ref(database, 'users/' + user.uid), {
            last_login : Date.now()
        }).then(() => {
            alert("successfuly loged in!");

            window.open("cookie_site.html",'_self');
        });

    })
    .catch(function(error) {
        var error_code = error.code;
        var error_message = error.message;

        alert(error_message);
    });
}

let login = event => { 
    login_user();
}

let register = event => { 
    register_user();
}

try {
    document.getElementById('log').addEventListener("click", login);
}catch {

}

try {
    document.getElementById('register').addEventListener("click", register);
}catch {
    
}
