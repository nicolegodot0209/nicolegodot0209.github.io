const tabButtons = document.querySelectorAll('.tab-button');
const sections = document.querySelectorAll('.section');

const calendarButton = document.getElementById('calendar_button');
const announcementsButton = document.getElementById('announcements_button');
const calendarSection = document.getElementById('calendar_section');
const announcementsSection = document.getElementById('announcements_section');

function toggleButtons(buttonType) {
    for (const button of tabButtons) {
        if (button.id === buttonType) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }

    for (const section of sections) {
        const sectionId = buttonType.replace('_button', '_section');
        section.style.display = section.id === sectionId ? 'block' : 'none';
    }
}

calendarButton.addEventListener('click', toggleButtons.bind(null, 'calendar_button'));
announcementsButton.addEventListener('click', toggleButtons.bind(null, 'announcements_button'));
toggleButtons('calendar_button'); // Set default active button and section

// Event List

import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

let selectedDate = new Date();
const dateInput = document.getElementById('date_input');
const year = selectedDate.getFullYear();
const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
const day = String(selectedDate.getDate()).padStart(2, "0");
dateInput.value = `${year}-${month}-${day}`;

let savedEvents = await loadEvents();
async function loadEvents() { // Loads all events from the database
    const snapshot = await getDocs(collection(db, 'events'));
    return snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id
    }));
}

function renderEvents(date) {
    // Sort by time
    savedEvents.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    // Loop through all savedEvents, add events that are in current date
    for (const eventInfo of savedEvents) {
        const eventDate = new Date(eventInfo.date);
        const selectedDate = new Date(`${dateInput.value}T00:00:00`);
        const sameDay = (
            selectedDate.getFullYear() === eventDate.getFullYear() &&
            selectedDate.getMonth() === eventDate.getMonth() &&
            selectedDate.getDate() === eventDate.getDate()
        );
        
        if (sameDay && eventInfo.type != 'announcement') { addEvent(eventInfo) }
    }
}
renderEvents(dateInput.value);

function updateEvent(eventCont) { // FIXME

}

function addEvent(eventInfo) {
    // 1. Get children
    const eventList = document.getElementById('events')
    const eventTemplate = document.getElementById('event_template')

    const clone = eventTemplate.content.cloneNode(true);
    const eventCont = clone.querySelector('.event-cont');
    const eventTitle = clone.querySelector('.event-title-text');
    const eventTypeDropdown = clone.querySelector('.event-type');
    const eventTime = clone.querySelector('.event-time');
    const eventLocation = clone.querySelector('.event-location');
    const eventDesc = clone.querySelector('.event-desc');

    const icon = clone.querySelector('.icon');
    switch (eventInfo.type) {
        case 'academic':
            icon.className = 'fa-solid fa-book';
            break;
        case 'club':
            icon.className = 'fa-solid fa-people-group';
            break;
        case 'sport':
            icon.className = 'fa-solid fa-football';
            break;
        case 'social':
            icon.className = 'fa-solid fa-children';
            break;
        case 'announcement':
            icon.className = 'fa-solid fa-bullhorn';
            break;
        default:
            icon.className = '';
    }

    // 2. Set data
    const date = new Date(eventInfo.date)
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    eventTime.value = `${hours}:${minutes}`;
    eventLocation.value = eventInfo.location;
    eventTitle.value = eventInfo.title;
    eventTypeDropdown.value = eventInfo.type;
    eventDesc.value = eventInfo.description;

    // 3. Buttons
    const deleteButton = clone.querySelector('.delete');
    const editButton = clone.querySelector('.edit');
    const confirmButton = clone.querySelector('.confirm');
    const exitButton = clone.querySelector('.exit');
    const editableElements = [eventTitle, eventTypeDropdown, eventTime, eventLocation, eventDesc]

    // Delete 
    deleteButton.addEventListener("click", async () => {
        const events = document.querySelectorAll('.event-cont')
        for (const event of events) {
            event.classList.remove('active')
        }
        await deleteDoc(doc(db, "events", eventInfo.id));
        eventCont.remove();
    });
    // Edit
    editButton.addEventListener("click", () => {
        const events = document.querySelectorAll('.event-cont')
        for (const event of events) {
            event.classList.remove('active')
        }
        eventCont.classList.add('active');
        for (const element of editableElements) {
            element.disabled = false;
        }
    });
    // Confirm
    confirmButton.addEventListener("click", async () => {
        const events = document.querySelectorAll('.event-cont')
        for (const event of events) {
            event.classList.remove('active')
        }
        eventCont.classList.remove('active');
        for (const element of editableElements) {
            element.disabled = true;
        }

        await updateDoc(doc(db, "events", eventInfo.id), {
            date: `${dateInput.value}T${eventTime.value}`,
            description: eventDesc.value,
            location: eventLocation.value,
            title: eventTitle.value,
            type: eventTypeDropdown.value,
        });
    });
    // Exit
    exitButton.addEventListener("click", () => {
        const events = document.querySelectorAll('.event-cont')
        for (const event of events) {
            event.classList.remove('active')
        }
        eventCont.classList.remove('active');
        for (const element of editableElements) {
            element.disabled = true;
        }
    });

    // 4. Add event
    eventList.appendChild(clone);
}

async function cloneTestEvent() {
    try {
        const original = await getDoc(doc(db, "events", "abc123"));

        if (!original.exists()) {
            console.error("Event abc123 does not exist.");
            return;
        }

        const copy = await addDoc(
            collection(db, "events"),
            original.data()
        );

        console.log("Cloned event! New ID:", copy.id);
    } catch (error) {
        console.error("Could not clone event:", error);
    }
}