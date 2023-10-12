import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA86GO4MoUenwXbcWFou6cBSy_Oln65dbM",
  authDomain: "nutmeup-57502.firebaseapp.com",
  projectId: "nutmeup-57502",
  storageBucket: "nutmeup-57502.appspot.com",
  messagingSenderId: "399314612807",
  appId: "1:399314612807:web:174e01991feb8671dab762",
  measurementId: "G-C904RLMDYH",
};

showLoader();

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

auth
  .authStateReady()
  .then(() => {
    const user = auth.currentUser;
    if (user) {
      location.href = "profile.html";
    } else {
    }

    const oobCode = querystring("oobCode")[0];

    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        const accountEmail = email;
        document.getElementById("email").innerHTML = accountEmail;

        hideLoader();

        const resetForm = document.getElementById("frmResetPassword");
        resetForm.addEventListener("submit", async function (e) {
          e.preventDefault();

          showLoader();

          const password = document.getElementById("password").value;
          const confirm = document.getElementById("confirm").value;

          if (password == "" || confirm == "") {
            alert("Some fields are empty!");
            hideLoader();
            return;
          }

          if (password != confirm) {
            alert("Password mismatch");
            hideLoader();
            return;
          }

          confirmPasswordReset(auth, oobCode, password)
            .then((resp) => {
              hideLoader();
              alert("Password reset successful.");
              //auth.signInWithEmailAndPassword(accountEmail, newPassword);
              location.href = decodeURIComponent(querystring("continueUrl")[0]);
            })
            .catch((error) => {
              hideLoader();
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorCode);
            });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(
          "Invalid or expired action code. Please reset the password again. [" +
            errorCode +
            "]"
        );
        console.log(error);
        location.href = "forgot.html";
      });
  })
  .catch((error) => {});

function querystring(key) {
  var re = new RegExp("(?:\\?|&)" + key + "=(.*?)(?=&|$)", "gi");
  var r = [],
    m;
  while ((m = re.exec(document.location.search)) != null) r[r.length] = m[1];
  return r;
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
