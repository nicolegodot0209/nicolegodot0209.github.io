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
    searchInput.focus();
}
function closeSearch() {
    isSearchOpen = false;
    searchInput.classList.remove('active');
}
searchButton.addEventListener('click', searchButtonToggled);

//// Scrolling

const navbar = document.getElementById('navbar');
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
      console.log('yoohoo!')

      // Stop watching this element so it only animates once.
      observer.unobserve(entry.target);
    }
  });
}, {
    threshold: 0.3
});

// Start watching each element separately.
elements.forEach((element) => {
  observer.observe(element);
});