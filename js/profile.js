import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { carsBrands } from "./cars.js";

import { v4 as uuidv4 } from "https://cdn.skypack.dev/uuid";

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
const db = getFirestore(app);

onAuthStateChanged(auth, async function (user) {
  if (user != null) {
    const docRef = doc(db, "USERS", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      document.getElementById("name").value = docSnap.data().bioData.name;
      document.getElementById("email").value = user.email;
      document.getElementById("phone").value = docSnap.data().bioData.phone;
      document.getElementById("status").innerHTML = docSnap.data().status;
      document.getElementById("verification").innerHTML = docSnap.data().kycData
        .emailStatus
        ? "VERIFIED"
        : "UNVERIFIED";

      fetchVehicles(user.uid);
      hideLoader();
    } else {
    }
  } else {
    hideLoader();
    location.href = "login.html";
  }
});

const signoutForm = document.getElementById("signout-form");
signoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showLoader();
  signOut(auth)
    .then(() => {
      location.href = "login.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.code);
    });
  hideLoader();
});

const manufacturer = document.getElementById("manufacturer");
const model = document.getElementById("model");
carsBrands.forEach((brand, index) => {
  const optionElement = document.createElement("option");
  optionElement.value = brand.brand;
  optionElement.text = brand.brand;
  manufacturer.appendChild(optionElement);
  if (index == 0) {
    brand.models.forEach((mdl) => {
      const optionElement2 = document.createElement("option");
      optionElement2.value = mdl;
      optionElement2.text = mdl;
      model.appendChild(optionElement2);
    });
  }
});

manufacturer.addEventListener("change", function () {
  carsBrands.forEach((brand, index) => {
    if (brand.brand == manufacturer.value) {
      while (model.options.length > 0) {
        model.remove(0);
      }
      brand.models.forEach((mdl) => {
        const optionElement2 = document.createElement("option");
        optionElement2.value = mdl;
        optionElement2.text = mdl;
        model.appendChild(optionElement2);
      });
    }
  });
});

let user = null;
auth
  .authStateReady()
  .then(() => {
    user = auth.currentUser;
    if (user) {
      console.log("User is signed in!");
    } else {
      console.log("User is signed out!");
    }
  })
  .catch((error) => {
    console.error("Error waiting for auth state:", error);
  });

const vehicleForm = document.getElementById("vehicle-form");
vehicleForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  showLoader();

  const year = document.getElementById("year").value;
  const model = document.getElementById("model").value;
  const drive = document.getElementById("drive").value;

  const uuid = uuidv4();

  const vehicleModel = {
    title: model,
    year: year,
    gear: "4 WD Gear",
    status: "ACTIVE",
    config: drive,
    manufacturer: manufacturer.value,
    createdBy: user.uid,
    vehicleId: uuid,
    createdAt: new Date().toUTCString(),
  };

  try {
    const ref = doc(db, "VEHICLES", uuid);
    const docRef = await setDoc(ref, vehicleModel);

    $("#formModalClose").trigger("click");

    fetchVehicles(user.uid);

    console.log("Vehicle added: ", ref, docRef);
    hideLoader();
  } catch (e) {
    console.error("Error adding vehicle: ", e);
    hideLoader();
  }
});

async function fetchVehicles(userId) {
  const vehq = query(
    collection(db, "VEHICLES"),
    where("createdBy", "==", userId)
  );

  const vehSnap = await getDocs(vehq);

  var vehDiv = document.getElementById("vehicle");
  while (vehDiv.firstChild) {
    vehDiv.removeChild(vehDiv.firstChild);
  }

  vehSnap.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    var vehc =
      '<div class="border rounded p-2 mb-2">' +
      '<div class="row">' +
      '<div class="col-10">' +
      '<span class="text-dark">Vehicle </span>' +
      "</div>" +
      '<div class="col-2"><i class="fa fa-trash text-danger"></i></div>' +
      "</div>" +
      '<div class="row">' +
      '<div class="col-lg-3 col-6">' +
      doc.data().manufacturer +
      "</div>" +
      '<div class="col-lg-3 col-6">' +
      doc.data().title +
      "</div>" +
      '<div class="col-lg-3 col-6">' +
      doc.data().year +
      "</div>" +
      '<div class="col-lg-3 col-6">' +
      doc.data().config +
      "</div>" +
      '<div class="col-lg-3 col-6"><button class="btn btn-outline btn-primary w-100">Add History</button></div>' +
      '<div class="col-lg-3 col-6"><button class="btn btn-outline btn-primary w-100">Maintenance History</button></div>' +
      "</div>" +
      "</div>";
    vehDiv.innerHTML = vehDiv.innerHTML + vehc;
  });
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
