let currentDate = new Date();
let selectedDate = new Date();
updateCalendar();
initializeCalendar();


function initializeCalendar() {
   // Calendar Shortcut
   // 1. Set up previous and next button
   const prevBtn = document.getElementById('prev_month_btn');
   prevBtn.addEventListener('click', () => {
       currentDate.setMonth(currentDate.getMonth() - 1, 1);
       updateCalendar();
   });
   const nextBtn = document.getElementById('next_month_btn');
   nextBtn.addEventListener('click', () => {
       currentDate.setMonth(currentDate.getMonth() + 1, 1);
       updateCalendar();
   }); 
}


function updateCalendar() {
   updateCalendarShortcut(currentDate);
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
   }
}


// Helper Functions
function isWeekend(date) {
   const dayOfWeek = date.getDay();
   return (dayOfWeek === 0 || dayOfWeek === 6)
}


// Main Calendar
const exampleEvent = {
   'title': 'FBLA Club Meeting',
   'month': 10,
   'day': 13,
   'time' : '09:48',
   'location': 'Cafeteria',
   'type' : 'club',
   'description': `Hey, its me!
   I am a cool description.
   Wow wow this is such a description haha pretend I'm saying something very useful right now.`,
};


function addEvent (eventInfo) {
   const eventTemplate = document.getElementById('event_template');
   const clone = eventTemplate.content.cloneNode(true);
   const event = clone.getElementById('event');


   let title = eventInfo.title;
   // 1. Set title
   event.querySelector('.event_title_text').textContent = eventInfo.title;
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
   const event_details = clone.getElementById('event_details');
   const time = `${parseInt(eventInfo.time.split(':')[0], 10) % 12 || 12}:${eventInfo.time.split(':')[1]}`;
   if (eventInfo.time != '') {
       event_details.textContent = `${time} • ${eventInfo.location}`;
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
  
   let event_list_id = eventInfo.time === '' ? 0 : bounds.findIndex(b => eventInfo.time <= b) + 1;
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
   console.log('clicked');
}


addEvent(exampleEvent);
exampleEvent.title = 'PSAT';
exampleEvent.type = 'academic'
exampleEvent.location = 'Room 507'
addEvent(exampleEvent);
exampleEvent.title = 'No School Tomorrow!';
exampleEvent.time = '';
exampleEvent.location = ''
exampleEvent.type = 'announcement'
addEvent(exampleEvent);
exampleEvent.time = '16:30';
exampleEvent.type = 'sport'
exampleEvent.title = 'Football Game';
exampleEvent.location = 'Stadium';
addEvent(exampleEvent);