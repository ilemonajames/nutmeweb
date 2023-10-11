import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA86GO4MoUenwXbcWFou6cBSy_Oln65dbM",
  authDomain: "nutmeup-57502.firebaseapp.com",
  projectId: "nutmeup-57502",
  storageBucket: "nutmeup-57502.appspot.com",
  messagingSenderId: "399314612807",
  appId: "1:399314612807:web:174e01991feb8671dab762",
  measurementId: "G-C904RLMDYH",
};

window.onload = function () {
  showLoader();
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

auth.authStateReady().then(() => {
  const user = auth.currentUser;
  if (user) {
    document.getElementById("auth").setAttribute("href", "profile.html");
    document.getElementById("auth").innerHTML = "Profile";
  } else {
    document.getElementById("auth").setAttribute("href", "login.html");
    document.getElementById("auth").innerHTML = "Login";
  }
  hideLoader();
});

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
