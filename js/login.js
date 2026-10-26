// Imports
import { auth } from './firebase-config.js';
import {
 signInWithEmailAndPassword,
 GoogleAuthProvider,
 signInWithPopup,
 linkWithPopup,
 signOut,
 onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';


// List of approved emails
const allowedEmails = [
 'nicolek0209@gmail.com'
];


// Regular Sign-In
let email = '';
let password = '';
const status = document.getElementById('status');
const loginForm = document.getElementById('login_form');
const emailInput = document.getElementById('login_email');
const passwordInput = document.getElementById('login_password');
const signInButton = document.getElementById('sign_in');


function checkInputs() {
 email = emailInput.value.trim();
 password = passwordInput.value.trim();


 // Check if BOTH have text
 if (email !== '' && password !== '') {
   signInButton.classList.add('active');
 } else {
   signInButton.classList.remove('active');
 }
}
emailInput.addEventListener('input', checkInputs);
passwordInput.addEventListener('input', checkInputs);


// When submitting
loginForm.addEventListener('submit', async (event) => {
 event.preventDefault();
 signInButton.disabled = true;
 googleButton.disabled = true;


 try {
   await signInWithEmailAndPassword(auth, email, password);
   passwordInput.value = '';
   loginSuccess();
 } catch (error) {
   if (error.code === 'auth/too-many-requests') {
     status.textContent = 'Too many attempts. Please wait and try again.';
   } else if (error.code === 'auth/network-request-failed') {
     status.textContent = 'Could not connect. Check your internet connection.';
   } else {
     status.textContent = "Couldn't not sign in. Check your email and password.";
   }
 } finally {
   signInButton.disabled = false;
   googleButton.disabled = false;
 }
});


// Google Sign-in
const googleButton = document.getElementById('google_sign_in');
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
 prompt: 'select_account'
});


googleButton.addEventListener('click', async () => {
 googleButton.disabled = true;
 signInButton.disabled = true;


 try {
   const currentUser = auth.currentUser;
   const hasPassword = currentUser?.providerData.some(
     (provider) => provider.providerId === 'password'
   );
   const hasGoogle = currentUser?.providerData.some(
     (provider) => provider.providerId === 'google.com'
   );


   let result;
   let linkedGoogle = false;


   if (currentUser && hasPassword && !hasGoogle) {
     // Add Google to the existing signed-in password account.
     result = await linkWithPopup(currentUser, provider);
     linkedGoogle = true;
   } else {
     // No existing signed-in password account to link.
     result = await signInWithPopup(auth, provider);
   }

   const user = result.user;
   const userEmail = (user.email ?? '').toLowerCase();

   const isAllowed =
     user.emailVerified &&
     allowedEmails.some(
       (allowedEmail) =>
         allowedEmail.toLowerCase() === userEmail
     );


   if (!isAllowed) {
     await signOut(auth);
     status.textContent = 'This account is not approved for admin access.';
     return;
   }


   loginSuccess();
 } catch (error) {
   console.error(error.code, error.message);
  status.textContent = 'Could not complete Google sign-in.';
 } finally {
   googleButton.disabled = false;
   signInButton.disabled = false;
 }
});

function loginSuccess() {
  // Hide the old page and display the new one
  const login_page = document.getElementById('sign_in_cont');
  const event_page = document.getElementById('event_submit_cont');

  login_page.style.display = 'none';
  event_page.style.display = 'flex';
}