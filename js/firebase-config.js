import { initializeApp } from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDTNRoWjxrZx96A3_UKtwLwQnIGbhHJik0",
    authDomain: "fbla-nicole-2027.firebaseapp.com",
    projectId: "fbla-nicole-2027",
    storageBucket: "fbla-nicole-2027.firebasestorage.app",
    messagingSenderId: "314054097848",
    appId: "1:314054097848:web:c229db42094851bbf5ad4d",
    measurementId: "G-P1J2QDVS33"
  };


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);