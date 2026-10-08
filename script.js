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