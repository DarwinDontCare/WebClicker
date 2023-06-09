// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js";
import { getDatabase, ref, set, child, update, remove, onValue, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEdjIqnp-pYXlam8-xqb2HoUSsZC38oR8",
  authDomain: "cookiesite-e1b9c.firebaseapp.com",
  projectId: "cookiesite-e1b9c",
  storageBucket: "cookiesite-e1b9c.appspot.com",
  messagingSenderId: "1074669571083",
  appId: "1:1074669571083:web:eea2691ebb494c993e8b0e",
  measurementId: "G-JLNH44FY5J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

const database = getDatabase(app);

let login = event => { 
    login_user();
}

let register = event => { 
    register_user();
}

let score = 0;
let multiplier = 1;
let USERNAME = "Anonimus";
let canSendData = false;

let cookie = document.getElementById('cookie');
let score_text = document.getElementById('score');
let sidebar = document.getElementById("sidebar");
let close_menu = document.getElementById("close_menu");
let menu_icon = document.getElementById("menu_icon");
let main_text = document.getElementById("main_text");
let user_icon = document.getElementById("user_icon");
let user_info = document.getElementById("user_info");

let username_span = document.getElementById("username_span");
let goals_span = document.getElementById("goals_span");

async function update_current_user_leaderboard() {
    let elements = document.getElementsByClassName("player")

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element.getElementsByClassName("player_name")[0].textContent == USERNAME) {
            element.getElementsByClassName("player_data_scores")[0].textContent = "Score: "+score;
            element.getElementsByClassName("player_data_goals")[0].textContent = "Goals: "+multiplier;
            return;
        }
    }
}

async function organize_leaderboard() {

    const usersRef = ref(database, 'users');

    get(usersRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    const item = data[key];

                    let elements = document.getElementsByClassName("player");

                    for (let i = 0; i < elements.length; i++) {
                        let element = elements[i];
                        if (element.getElementsByClassName("player_name")[0].textContent == item.username) {
                            element.getElementsByClassName("player_data_scores")[0].textContent = "Score: "+item.score;
                            element.getElementsByClassName("player_data_goals")[0].textContent = "Goals: "+item.objectives;
                            return;
                        }
                    }
                    
                    add_player_to_leaderboard(item.username, item.score, item.objectives);
                }
            }
        } else {
            console.log("Nenhum dado encontrado no nó 'score'");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

async function add_player_to_leaderboard(player_name, player_scores, player_goals) {

    let newObjective = document.createElement('li');
    newObjective.className = "player";

    let player_name_span = document.createElement('span');
    player_name_span.textContent = player_name;
    player_name_span.className = "player_name";

    let br1 = document.createElement('br');

    let player_scores_span = document.createElement('span');
    player_scores_span.textContent = "Score: "+player_scores;
    player_scores_span.className = "player_data_scores";

    let br2 = document.createElement('br');

    let player_goals_span = document.createElement('span');
    player_goals_span.textContent = "Goals: "+player_goals;
    player_goals_span.className = "player_data_goals";

    newObjective.appendChild(player_name_span);
    newObjective.appendChild(br1);
    newObjective.appendChild(player_scores_span);
    newObjective.appendChild(br2);
    newObjective.appendChild(player_goals_span);
    document.getElementById("leaderbord").appendChild(newObjective);
}

auth.onAuthStateChanged(function(user) {
    get(child(ref(database), "users/" + user.uid))
    .then(function(snapshot) {
        if (snapshot.exists()) {
            score = snapshot.val().score;
            multiplier = snapshot.val().objectives;
            USERNAME = snapshot.val().username;

            username_span.textContent = USERNAME;
            goals_span.textContent = multiplier;

            score_text.textContent = score;

            if (score > 50) {
                load_objcetives();
            }
            
            canSendData = true;

            console.log(USERNAME, multiplier, score);
        } else {
            alert("you don't have a accont");
        }
    }).catch(function(error) {
        var error_code = error.code;
        var error_message = error.message;

        alert(error_message);
        console.log(error_message);
    });
});

async function load_objcetives() {
    let value_m = 2;
    let value_score = 50;
                
    while (true) {
        if (score > value_score) {

            value_score += 50;
            
            let elements = document.getElementsByClassName("objective");

            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                if (score >= Number.parseInt(element.getAttribute("value")) && !element.classList.contains("completed")) {
                    element.classList.add("completed");
                }
            }

            generateObjectives(value_m);

            value_m++;

        } else {
            multiplier = value_m;
            goals_span.textContent = multiplier;
            update_current_user_leaderboard();
            update_objective();
            console.log("finished loading objectives!");
            return;
        }
    }
}

async function update_score() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // A post entry.
            const postData = {
                score : score
            };

            update(ref(database, 'users/'+user.uid), postData)
        } else {
            // User not logged in or has just logged out.
        }
    });
}

async function update_objective() {   
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // A post entry.
            const postData = {
                objectives : multiplier
            };

            update(ref(database, 'users/'+user.uid), postData)
        } else {
            console.log("no user");
        }
    });
}

document.onmousemove = getMousePos;

let click_audio = new Audio('assets/audio/Menu Selection Sound Effec.mp4')

let mousePos = null;

let timeoutID = null;

let can_rotate = false;

let rotation_angle = 0;

function remove_cookie_class() {
    cookie.classList.remove("cookie_clicked");
}

function open_sidebar() {
    sidebar.classList.toggle("open");
}

function clickCookie() {
    score++;
    score_text.textContent = score.toString();

    if (!cookie.classList.contains("cookie_clicked")) cookie.classList.add("cookie_clicked");
    if (cookie.classList.contains("cookie")) cookie.classList.remove("cookie");

    if (!can_rotate) can_rotate = true;

    timeoutID = setTimeout(remove_cookie_class, 400);

    click_audio.currentTime = 0.4;
    click_audio.play();
    pop()
    if (canSendData) update_score();
    update_current_user_leaderboard();

    check_objects();
}

async function check_objects() {
    let elements = document.getElementsByClassName("objective");

    for (var element in elements.length) {
        if (score >= Number.parseInt(element.getAttribute("value")) && !element.classList.contains("completed")) {
            element.classList.add("completed");
            multiplier++;
            if (canSendData) update_objective();
            goals_span.textContent = multiplier;
            generateObjectives();
        }
    }
}

function open_user_info() {
    if (user_info.style.visibility == "hidden") {
        user_info.style.visibility = "visible";
    } else {
        user_info.style.visibility = "hidden";
    }
}

let clickC = event => { 
    clickCookie();
}

let openS = event => { 
    open_sidebar();
}

let openU = event => { 
    open_user_info();
}

user_icon.addEventListener("click", openU);
cookie.addEventListener("click", clickC);
close_menu.addEventListener("click", openS);
menu_icon.addEventListener("click", openS);

function getMousePos (event) {
    mousePos = event;
}

function pop() { 
    for (let i = 0; i < 30; i++) {
        createParticle(mousePos.clientX, mousePos.clientY);
    }
}

async function generateObjectives(value_m) {
    let objectiveValue = (50 * value_m);

    let newObjective = document.createElement('li');
    newObjective.className = "objective";
    newObjective.value = objectiveValue;

    let objectiveText = document.createElement('span');
    objectiveText.textContent = "Click " + objectiveValue + " times on the cookie";
    objectiveText.className = "objective_text";

    newObjective.appendChild(objectiveText);
    document.getElementById("objectives_list").appendChild(newObjective);

    multiplier++;
}

function createParticle(x, y) {
    const particle = document.createElement('img');

    const destinationX = x + (Math.random() - 0.5) * 2 * 75;
    const destinationY = y + (Math.random() - 0.5) * 2 * 75;

    const size = Math.floor(Math.random() * 20 + 5);

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.classList.add("cookie_particle");

    particle.src = "assets/images/cookie.png";

    const animation = particle.animate([
        {
            transform: `translate(${x - (size / 2)}px, ${y - (size / 2)}px)`,
            opacity: 2
        },
        {
            transform: `translate(${destinationX}px, ${destinationY}px)`,
            opacity: 0
        }
    ], {
            duration: 500 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            delay: Math.random() * 200
    });

    document.body.appendChild(particle);

    animation.onfinish = () => {
        particle.remove();
    };
}

function rotateCookie() {
    if (can_rotate) {
        cookie.style.transform = 'rotate(' + rotation_angle + 'deg)';

        cookie.style.setProperty("--current-rotation", rotation_angle+"deg");
        
        rotation_angle += 0.01;
        if (rotation_angle > 360) rotation_angle = 0;
    }
}

var intervalId = window.setInterval(function(){
    rotateCookie();
}, 10); 

organize_leaderboard();

var refreshScoreboardId = window.setInterval(function() {
    organize_leaderboard();
}, 10000);