let currentDate = new Date();
let selectedDate = new Date();

function initializeCalendar() {
   // Calendar Shortcut
   // 1. Set up previous and next button
   const prevBtn = document.getElementById('prev_month_btn');
   prevBtn.addEventListener('click', () => {
       currentDate.setMonth(currentDate.getMonth() - 1, 1);
       updateCalendarShortcut(currentDate);
   });
   const nextBtn = document.getElementById('next_month_btn');
   nextBtn.addEventListener('click', () => {
       currentDate.setMonth(currentDate.getMonth() + 1, 1);
       updateCalendarShortcut(currentDate);
   }); 
}


// Calendar Shortcut
function updateCalendarShortcut(date) {
   const year = currentDate.getFullYear();
   const month = currentDate.getMonth() + 1;


   // Calendar Header
   // 1. Set the month/year title
   const monthYearHeader = document.getElementById('month_year');
   const headerText = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
   monthYearHeader.textContent = headerText;
  
   // Calendar Buttons
   const calendarButtons = document.getElementById('shortcut_buttons');
   calendarButtons.innerHTML = ''; // Clear calendar


   const daysInMonth = new Date(year, month, 0).getDate(); // Get total days in the current month
   const firstDayIndex = new Date(year, month - 1, 1).getDay(); // Find what day of the week the first of the month
   const lastDayIndex = new Date(year, month, 0).getDay();  // Find what day of the week the last of the month
  
   // 1. Add padding days from the PREVIOUS month
   const prevMonthDays = new Date(year, month - 1, 0).getDate(); // Last month's total days
   for (let i = firstDayIndex - 1; i >= 0; i--) {
       let prevDayNum = prevMonthDays - i;
       let newDate = new Date(year, month - 2, prevDayNum);
       let button = createDayButton(newDate); //(prevDayNum, month - 1, year);
       button.disabled = true;
       calendarButtons.appendChild(button);
   }
   // 2. Add the days from the CURRENT month
   for (let i = 1; i <= daysInMonth; i++) {
       let newDate = new Date(year, month - 1, i);
       let button = createDayButton(newDate)//(i, month, year);
       calendarButtons.appendChild(button);
   }
   // 3. Add padding days for NEXT month
   const nextMonthDays = new Date(year, month + 1, 0).getDate(); // Next month's total days
   for (let i = lastDayIndex + 1; i < 7; i++) {
       let nextDayNum = nextMonthDays - i;
       let newDate = new Date(year, month, i - lastDayIndex);
       let button = createDayButton(newDate); //(i - lastDayIndex, month + 1, year);
       button.disabled = true;
       calendarButtons.appendChild(button);
   }
}

function createDayButton(date) {
   // 1. Create a clone of the button template
   const buttonTemplate = document.getElementById('day_button_template');
   const clone = buttonTemplate.content.cloneNode(true);
   const button = clone.querySelector('button');
   // 2. Set the properties of the clone
   button.textContent = `${date.getDate()}`;
   if (isWeekend(date)) { button.classList.add('weekend') } // Check if day is on the weekend
   // 3. Trigger handleDayClick when button is clicked
   button.addEventListener('click', () => {
       handleDayClick(date, button);
   });
   // 4. Set if active
   if (
       selectedDate.getFullYear() === date.getFullYear() &&
       selectedDate.getMonth() === date.getMonth() &&
       selectedDate.getDate() === date.getDate()
     ) {
       button.classList.add('active');
   }
   return button; // Return the button to be added to the shortcut
}

function handleDayClick(date, clickedButton) {
   // De-select current button
   const currentActiveButton = document.querySelector('.day_button.active');
   if (currentActiveButton != clickedButton) {
       if (currentActiveButton) {
           currentActiveButton.classList.remove('active');
       }
       // Select the new button
       clickedButton.classList.add('active');
       selectedDate = new Date(date);
       renderEvents();
   }
}

// Helper Functions
function isWeekend(date) {
   const dayOfWeek = date.getDay();
   return (dayOfWeek === 0 || dayOfWeek === 6)
}


// Main Calendar
function addEvent (eventInfo) {
   const eventTemplate = document.getElementById('event_template');
   const clone = eventTemplate.content.cloneNode(true);
   const event = clone.getElementById('event');

   let title = eventInfo.title;
   // 1. Set title
   event.querySelector('.event_title_text').textContent = eventInfo.title;
   event.classList.add(`event_${eventInfo.type}`);
   const icon = clone.getElementById('icon');
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
   // 2. Set details
    const date = new Date(eventInfo.date.seconds * 1000)
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`; // Get the military time

    const event_details = clone.getElementById('event_details');
    const formattedTime = `${parseInt(time.split(':')[0], 10) % 12 || 12}:${time.split(':')[1]} ${(hours < '11') ? 'AM' : 'PM'}`; // Military -> Standard
    if (eventInfo.type != 'announcement') {
        event_details.textContent = `${formattedTime} • ${eventInfo.location}`;
    } else {
        event_details.textContent = `${eventInfo.location}`;
    }
    // 3. Set description
    const event_desc = clone.getElementById('event_desc');
    event_desc.textContent = eventInfo.description;
    // 4. Connect button
    const button = clone.getElementById('event_button');
    button.addEventListener('click', () => {
        handleEventClick(button);
    });
   // 4. Add element
   const bounds = ['09:59', '13:59', '17:59', '99:99'];
   const isBetween = (time, start, end) => time >= start && time <= end;
  
   let event_list_id = time === '' ? 0 : bounds.findIndex(b => time <= b) + 1;
   const event_list = document.getElementById(`event_list${event_list_id}`);
   event_list.appendChild(clone);
}

function handleEventClick(button) {
   // Toggle button
   if (button.classList.contains('active')) {
       button.classList.remove('active');
   } else {
       button.classList.add('active');
   }
}

// Render events
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

let savedEvents = await loadEvents();
async function loadEvents() { // Loads all events from the database
    const snapshot = await getDocs(collection(db, "events"));
    return snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id
    }));
}

const event_amount = document.getElementById("event_amount");
const event_amount_text = document.getElementById("event_amount_text");
async function renderEvents() {
    // Clear all events
    let eventsDisplayed = 0;
    const eventLists = document.getElementsByClassName("event_list");
    for (const eventList of eventLists) { eventList.innerHTML = ''; }
    // Load each event
    for (const eventInfo of savedEvents) {
        const eventDate = new Date(eventInfo.date.seconds * 1000);
        const sameDay = (
            selectedDate.getFullYear() === eventDate.getFullYear() &&
            selectedDate.getMonth() === eventDate.getMonth() &&
            selectedDate.getDate() === eventDate.getDate()
        );
        
        if (sameDay) {
            addEvent(eventInfo);
            eventsDisplayed += 1;
        }
    }
    // Change event amount text
    event_amount.textContent = eventsDisplayed;
    event_amount_text.textContent = (eventsDisplayed === 1) ? "event scheduled" : "events scheduled";
}

updateCalendarShortcut(currentDate);
initializeCalendar();
renderEvents();