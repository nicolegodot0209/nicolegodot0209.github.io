//// Nav bar
const navbar = document.getElementById('navbar');
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
    navbar.classList.add('menuOpen');
}

function closeMenu() {
    isMenuOpen = false;
    navbar.classList.remove('menuOpen');
}

menuButton.addEventListener('click', menuButtonToggled);

//// Search bar

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

//// Scrolling

let lastScrollY = window.scrollY;
let lastScrollDir = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY) { // When scrolling down
    if (lastScrollDir != -1) {
        lastScrollDir = -1;
        navbar.classList.add('scrollingDown');
    }
  } else if (currentScrollY < lastScrollY) { // When scrolling up

    if (lastScrollDir != 1) {
        lastScrollDir = 1;
        navbar.classList.remove('scrollingDown');
    }
  }

  lastScrollY = currentScrollY;
});

//// Animation
const elements = document.querySelectorAll(".scroll-reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Stop watching this element so it only animates once.
      observer.unobserve(entry.target);
    }
  });
}, {
    threshold: 0.2
});

// Start watching each element separately.
elements.forEach((element) => {
  observer.observe(element);
});