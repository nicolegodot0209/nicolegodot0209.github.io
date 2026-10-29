// FIXME ADD TOGGLED FOR ACTIVE

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
    threshold: 0.35
});

// Start watching each element separately.
elements.forEach((element) => {
  observer.observe(element);
});

// Nav Bar
const nav_bar = document.getElementById('nav_bar');
const menuButton = document.getElementById('menu_button');
const navButtons = document.getElementById('nav_buttons')

menuButton.addEventListener('click', () => {
  nav_bar.classList.toggle('menuOpen');
});

// Search Bar
const searchButton = document.getElementById('search_button');
const searchInput = document.getElementById('search_input');
const searchContainer = document.getElementById('search_cont');

searchButton.addEventListener('click', () => {
  searchInput.classList.toggle('active');
});

// Scrolling
let lastScrollY = window.scrollY;
let lastScrollDir = 0;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY) { // When scrolling down
    if (lastScrollDir != -1) {
        lastScrollDir = -1;
        nav_bar.classList.add('shrink');
    }
  } else if (currentScrollY < lastScrollY) { // When scrolling up
    if (lastScrollDir != 1) {
        lastScrollDir = 1;
        nav_bar.classList.remove('shrink');
    }
  }
  lastScrollY = currentScrollY;
});
