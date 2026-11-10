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