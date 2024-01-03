import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, child, update, remove, push } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

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

export const auth = getAuth();
const database = getDatabase(app);

function redirect_to_register() {
    window.open("cookie_register.html",'_self');
}

export function validate_email(email) {
    let expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email)) {
        return true;
    } else {
        return false;
    }
}

export function validate_password(password) {
    if (password < 6) {
        return false;
    } 

    if (password.length <= 0) {
        return false;
    } else {
        return true;
    }
}

export function compare_passwords(password, confirm_password) {
    if (password == confirm_password) {
        return true;
    } else {
        return false;
    }
}

export function validate_field(field) {
    if (field == null) {
        return false;
    } else {
        return true;
    }
}

function forgot_password() {
    window.open("cookie_forgot_password.html",'_self');
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

        // A post entry.
        const postData = {
            last_login : Date.now()
        };

        // Write the new post's data simultaneously in the posts list and the user's post list.
        update(ref(database, 'users/'+user.uid), postData)
        .then(() => {
            alert("successfuly loged in!");
            console.log(user.uid);

            window.open("cookie_site.html",'_self');
        }).catch(function(error) {
            var error_code = error.code;
            var error_message = error.message;
    
            alert(error_message);
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

try {
    document.getElementById('login').addEventListener("click", login);
    document.getElementById('register_redirect').addEventListener("click", redirect_to_register);
    document.getElementById('redirect_forgot').addEventListener("click", forgot_password);
}catch(error) {
    console.log(error)
}
