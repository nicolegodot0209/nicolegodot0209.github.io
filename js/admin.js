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

let savedEvents = '';
let sortedEvents = '';
await loadEvents();
renderEvents();

async function loadEvents() { // Load all events from database by ID
    const snapshot = await getDocs(collection(db, 'events'));
    savedEvents = Object.fromEntries(
        snapshot.docs.map(document => [
            document.id, {
                ...document.data(),
                id: document.id,
            },
        ])
    );

    sortedEvents = Object.values(savedEvents).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ); 
}

function renderEvents() {
    // Loop through all savedEvents, add events that are in current date
    const selectedDate = new Date(`${dateInput.value}T00:00:00`);
    const isSameDay = (eventDate) => {
        eventDate = new Date(eventDate);
        return (
            eventDate.getFullYear() === selectedDate.getFullYear() &&
            eventDate.getMonth() === selectedDate.getMonth() &&
            eventDate.getDate() === selectedDate.getDate()
        )
    };
    
    // Add dates to list
    sortedEvents.forEach(eventInfo => {
        const eventDate = new Date(eventInfo.date);
        const selectedDate = new Date(`${dateInput.value}T00:00:00`);

        if (isSameDay(eventInfo.date) && eventInfo.type != 'announcement') {
            addEvent(eventInfo.id);
        }
    });
}

function addEvent(id) {
    // 1. Get children
    const eventInfo = savedEvents[id];
    const eventList = document.getElementById('events')
    const eventTemplate = document.getElementById('event_template')

    const clone = eventTemplate.content.cloneNode(true);
    const eventCont = clone.querySelector('.event-cont');
    updateEvent(eventCont, id);

    const eventElements = getEventElements(eventCont);

    // 3. Buttons
    const deleteButton = clone.querySelector('.delete-button');
    const editButton = eventCont.querySelector('.edit-button');
    const confirmButton = clone.querySelector('.confirm-button');
    const exitButton = clone.querySelector('.exit-button');

    const clearAllActive = () => {
        document.querySelectorAll('.event-cont').forEach(event => event.classList.remove('active'));
    };
    const toggleAllInputs = (disabled) => {
        eventCont.querySelectorAll('.edit').forEach(input => input.disabled = disabled);
    };

    // Delete 
    deleteButton.addEventListener("click", async () => {
        clearAllActive();
        await deleteDoc(doc(db, "events", eventInfo.id));
        eventCont.remove();
    });
    // Edit
    editButton.addEventListener("click", () => {
        clearAllActive();
        eventCont.classList.add('active');
        toggleAllInputs(false);
    });
    // Confirm
    confirmButton.addEventListener("click", async () => {
        clearAllActive();
        eventCont.classList.remove('active');
        toggleAllInputs(true);

        await updateDoc(doc(db, "events", eventInfo.id), {
            date: `${dateInput.value}T${eventElements.time.value}`,
            description: eventElements.description.value,
            location: eventElements.location.value,
            title: eventElements.title.value,
            type: eventElements.type.value,
        });

        // Update the container
        await loadEvents();
        updateEvent(eventCont, id);
    });
    // Exit
    exitButton.addEventListener("click", async () => {
        clearAllActive();
        eventCont.classList.remove('active');
        toggleAllInputs(true);

        // Update the container
        await loadEvents();
        updateEvent(eventCont, id);
    });

    // 4. Add event
    eventList.appendChild(clone);
}

function getEventElements(eventCont) {
    return {
        title: eventCont.querySelector('.event-title-text'),
        type: eventCont.querySelector('.event-type'),
        time: eventCont.querySelector('.event-time'),
        location: eventCont.querySelector('.event-location'),
        description: eventCont.querySelector('.event-desc'),
        icon: eventCont.querySelector('.icon-cont').firstElementChild,
    };
}

function updateEvent(eventCont, id) { // FIXME
    const eventElements = getEventElements(eventCont);
    const eventInfo = savedEvents[id];
    const iconClasses = {
        academic: 'fa-book',
        club: 'fa-people-group',
        sport: 'fa-football',
        social: 'fa-children',
        announcement: 'fa-bullhorn',
    };

    const icon = eventElements.icon;
    icon.classList.remove(...Object.values(iconClasses));
    const iconClass = iconClasses[eventInfo.type];

    if (iconClass) {
        icon.classList.add('fa-solid', iconClass);
    }

    // 2. Set data
    const date = new Date(eventInfo.date)
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    eventElements.time.value = `${hours}:${minutes}`;
    eventElements.location.value = eventInfo.location;
    eventElements.title.value = eventInfo.title;
    eventElements.type.value = eventInfo.type;
    eventElements.description.value = eventInfo.description;
}

async function cloneTestEvent() {
    try {
        const original = await getDoc(doc(db, "events", "4lAjvWMZw3klqHEqsfjU"));

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