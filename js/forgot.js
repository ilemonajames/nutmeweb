import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getAuth,
  sendPasswordResetEmail,
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

const forgotForm = document.getElementById("frmLostPassword");
forgotForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  showLoader();
  const email = document.getElementById("email").value;

  var actionCodeSettings = {
    url: "https://nutmeup.ng/login.html",
  };

  sendPasswordResetEmail(auth, email, actionCodeSettings)
    .then(() => {
      hideLoader();
      alert("Password reset email sent!");
      location.href = "login.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      hideLoader();
      if (errorCode === "auth/invalid-email") {
        alert("invalid email");
      } else if (errorCode === "auth/missing-android-pkg-name") {
        alert("missing android pkg name");
      } else if (errorCode === "auth/missing-continue-uri") {
        alert("missing continue uri");
      } else if (errorCode === "auth/missing-ios-bundle-id") {
        alert("missing ios bundle id");
      } else if (errorCode === "auth/invalid-continue-uri") {
        alert("invalid continue uri");
      } else if (errorCode === "auth/unauthorized-continue-uri") {
        alert("unauthorized continue uri");
      } else {
        alert("auth/user-not-found");
      }
    });
});

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
