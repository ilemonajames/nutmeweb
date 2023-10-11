import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
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
  })
  .catch((error) => {});

const signinForm = document.getElementById("frmSignIn");
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showLoader();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      hideLoader();
      location.href = "profile.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      hideLoader();
      if (errorCode === "auth/wrong-password") {
        alert("wrong password");
      } else if (errorCode === "auth/user-not-found") {
        alert("user not found");
      } else if (errorCode === "auth/user-disabled") {
        alert("user disabled");
      } else {
        alert("invalid email");
      }
    });
});

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
