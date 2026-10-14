// Event Cards

const exampleEvent = {
    "title": "Club Meeting",
    "month": 10,
    "day": 13,
    "time": '12:00 AM',
    "location": 'Middletown Park',
    "description": `Hey, its me! 
    I am a cool description. 
    About this super cool event that doesnt actually exist but we will pretend it does for the sake of the website.`,
  };

function addEventCard(eventInfo) {
    // Get the event card to modify and list to add to
    const template = document.getElementById("event_template");
    const eventList = document.getElementById("event_list");
    const card = template.content.cloneNode(true);


    let monthNumber = new Date(0, eventInfo.month - 1); 
    let monthName = Intl.DateTimeFormat('en-US', { month: 'short' }).format(monthNumber);
    
    card.querySelector(".event_title").textContent = eventInfo.title;
    card.querySelector(".month").textContent = monthName;
    card.querySelector(".day").textContent = eventInfo.day;
    card.querySelector(".event_details").textContent = eventInfo.time + " • " + eventInfo.location;
    card.querySelector(".event_desc").textContent = eventInfo.description;


    eventList.appendChild(card);
}

addEventCard(exampleEvent);
addEventCard(exampleEvent);
addEventCard(exampleEvent);
addEventCard(exampleEvent);












// Navbar
const nav_bar = document.getElementById('nav_bar');
const menuButton = document.getElementById('menu_button');
const navButtons = document.getElementById('nav_buttons')
let isMenuOpen = false;

function menuButtonToggled() {
    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    isMenuOpen = true;
    nav_bar.classList.add('menuOpen');
}

function closeMenu() {
    isMenuOpen = false;
    nav_bar.classList.remove('menuOpen');
}

menuButton.addEventListener('click', menuButtonToggled);

// Search bar

const searchButton = document.getElementById('search_button');
const searchInput = document.getElementById('search_input');
const searchContainer = document.getElementById('search_cont');
let isSearchOpen = false;

function searchButtonToggled() {
    if (isSearchOpen) {
        closeSearch();
    } else {
        openSearch();
    }
}

function openSearch() {
    isSearchOpen = true;
    searchInput.classList.add('active');
    searchInput.placeholder = "Search..."
    searchInput.focus();
}
function closeSearch() {
    isSearchOpen = false;
    searchInput.placeholder = ""
    searchInput.classList.remove('active');
}
searchButton.addEventListener('click', searchButtonToggled);

// Scrolling
let lastScrollY = window.scrollY;
let lastScrollDir = 0;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY) { // When scrolling down
    if (lastScrollDir != -1) {
        lastScrollDir = -1;
        nav_bar.classList.add('scrollingDown');
    }
  } else if (currentScrollY < lastScrollY) { // When scrolling up

    if (lastScrollDir != 1) {
        lastScrollDir = 1;
        nav_bar.classList.remove('scrollingDown');
    }
  }
  lastScrollY = currentScrollY;
});
