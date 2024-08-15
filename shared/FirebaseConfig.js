// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCr-q1LfjK1Yjm4jBZDZk0ReuqcEVGXa7Y",
  authDomain: "ninja-player-c9f8e.firebaseapp.com",
  projectId: "ninja-player-c9f8e",
  storageBucket: "ninja-player-c9f8e.appspot.com",
  messagingSenderId: "77682706442",
  appId: "1:77682706442:web:882891841cac4a0c3ab7f3",
  measurementId: "G-DTDH1GWYF1"
};

const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { app, analytics };