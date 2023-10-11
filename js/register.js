import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

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

const db = getFirestore(app);

auth
  .authStateReady()
  .then(() => {
    const user = auth.currentUser;
    if (user) {
      console.log("User is signed in!");
      location.href = "profile.html";
    } else {
      console.log("User is signed out!");
    }
  })
  .catch((error) => {
    console.error("Error waiting for auth state:", error);
  });

const signupForm = document.getElementById("frmSignUp");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showLoader();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  console.log(email + " " + password + " " + confirm);

  console.log("signing up...");

  if (name == "" || phone == "" || email == "" || password == "") {
    alert("some fields are empty");
    hideLoader();
    return;
  }

  if (password != confirm) {
    alert("password mismatch");
    hideLoader();
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(async function (userCredential) {
      const user = userCredential.user;

      const userModel = {
        password: null,
        createdAt: new Date().toUTCString(),
        updatedAt: null,
        status: "ACTIVE",
        userId: user.uid,
        bioData: {
          name: name,
          email: user.email,
          phone: phone,
          profilePhoto: null,
          dateOfBirth: null,
        },
        kycData: {
          emailStatus: false,
          phoneStatus: null,
          documentStatus: null,
          documentLink: null,
          uploadedAt: null,
          verifiedAt: null,
          documentType: null,
          message: null,
        },
      };

      try {
        const ref = doc(db, "USERS", user.uid);
        const docRef = await setDoc(ref, userModel);

        console.log("Document written with ID: ", ref);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      hideLoader();
      location.href = "profile.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.code);
      hideLoader();
      if (errorCode === "auth/email-already-in-use") {
        alert("email already in use");
      } else if (errorCode === "auth/invalid-email") {
        alert("invalid email");
      } else if (errorCode === "auth/operation-not-allowed") {
        alert("operation not allowed");
      } else {
        alert("weak password");
      }
    });
});

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
