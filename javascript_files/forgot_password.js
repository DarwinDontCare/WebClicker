import {validate_email} from "./login.js"
import {sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

function reset_password() {
    let email = document.getElementById("Email").value;
    if (email && validate_email(email)) {
        sendPasswordResetEmail(email)
          .then(function () {
            alert("Um e-mail de redefinição de senha foi enviado para " + email);
          })
          .catch(function (error) {
            alert("Erro ao enviar e-mail de redefinição de senha: " + error.message);
          });
      }
}

try {
    document.getElementById('send_reset_email').addEventListener("click", reset_password);
}catch(error) {
    console.log(error)
}