import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../.env') });

// const apiKey = process.env.FIREBASE_API_KEY;

// const apiKey = env.FIREBASE_API_KEY

const firebaseConfig = {
  apiKey: "AIzaSyC3LTxzLQE9mWlljZsHZSnG0e8FuS1BtIQ",
  authDomain: "fullstack-project-travel.firebaseapp.com",
  projectId: "fullstack-project-travel",
  storageBucket: "fullstack-project-travel.appspot.com",
  messagingSenderId: "838492743759",
  appId: "1:838492743759:web:881b2fedb090346440623a",
  measurementId: "G-GRCXD5F9DS",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const userEmail = document.getElementById("user-email");
const loginBtn = document.getElementById("login-button");
const registerBtn = document.getElementById("register-button");
const googleLoginBtn = document.getElementById("google-login-button");
const logoutBtn = document.getElementById("logout-button");

let user = {};

auth.onAuthStateChanged((currentUser) => {
  user = currentUser;
  if (user) {
    userEmail.innerHTML = "<b> User Logged In: </b> " + user.email;
    window.location.href = "/blog.html";
  } else {
    userEmail.innerHTML = "";
  }
});

const register = async () => {
  try {
    const newUser = await createUserWithEmailAndPassword(
      auth,
      registerEmail.value,
      registerPassword.value
    );
  } catch (error) {
    const errorMessage = error.message.split("Firebase: ")[1];
    console.log(errorMessage);
    const errorElement = document.querySelector(".errorRegister");
    errorElement.textContent = errorMessage;
  }
};

const login = async () => {
  try {
    const newUser = await signInWithEmailAndPassword(
      auth,
      loginEmail.value,
      loginPassword.value
    );
    console.log(newUser);
  } catch (error) {
    const errorMessage = error.message.split("Firebase: ")[1];
    console.log(errorMessage);
    const errorElement = document.querySelector(".errorLogin");
    errorElement.textContent = errorMessage;
  }
};

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
  } catch (error) {
    console.log(error.message);
  }
};
const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error.message);
  }
};

registerBtn.addEventListener("click", register);
loginBtn.addEventListener("click", login);
googleLoginBtn.addEventListener("click", loginWithGoogle);
logoutBtn.addEventListener("click", logout);

//dark mode
const toggleModeButton = document.getElementById("toggle-mode");
const bodyElement = document.body;

toggleModeButton.addEventListener("click", () => {
  bodyElement.classList.toggle("dark-mode");
});

//password reset
const resetButton = document.getElementById("reset-button");
const resetEmail = document.getElementById("reset-email");
const errorElement = document.querySelector(".error");

resetButton.addEventListener("click", async () => {
  sendPasswordResetEmail(auth, resetEmail.value)
  .then(() => {
    errorElement.textContent = "Password reset email sent.";
  })
  .catch((error) => {
    errorElement.textContent = error.message;
  });
});


