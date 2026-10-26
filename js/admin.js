let eventTitle = '';
let eventLocation = '';
let eventDescription = '';
let eventDate = '';
let eventType = '';

const eventForm = document.getElementById('event_form');
const titleInput = document.getElementById('event_title');
const locationInput = document.getElementById('location');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const eventSubmitButton = document.getElementById('event_submit');

function checkInputs() {
    eventTitle = titleInput.value.trim();
    eventLocation = locationInput.value.trim();
    eventDate = dateInput.value.trim();
   
    // Check if fields are completed
    if (eventTitle !== '' && eventLocation !== '' && eventDate !== '') {
        eventSubmitButton.disabled = false;
    } else {
        eventSubmitButton.disabled = true;
    }
}

titleInput.addEventListener('input', checkInputs);
locationInput.addEventListener('input', checkInputs);
dateInput.addEventListener('input', checkInputs);

// Submitting events
import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  Timestamp,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

async function postEvent(eventInfo) {
    const eventDocument = await addDoc(collection(db, "events"), eventInfo);
  
    return eventDocument.id;
  }


eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const selectedEvent = document.querySelector('input[name="event_type"]:checked');
    const eventInfo = { // Get info and organize
        title: eventTitle,
        date: new Date(dateInput.value),
        location: eventLocation,
        type : selectedEvent.value,
        description: descriptionInput.value,
     };
  
     try {
        const eventId = await postEvent(eventInfo); // Submit event
        console.log("Event posted:", eventId);
    
        eventForm.reset();
      } catch (error) {
        console.error("Could not post event:", error);
      }
  });