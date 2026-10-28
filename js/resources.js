// Grid cards
document.querySelectorAll(".card").forEach(card => {
    const front = card.querySelector(".card-front");
    const back = card.querySelector(".card-back");

    function flipCard() {
        // Keep focus off the face that is about to become inert.
        card.focus({ preventScroll: true });

        const flipped = card.classList.toggle("flipped");

        front.inert = flipped;
        back.inert = !flipped;
    }

    card.addEventListener("click", event => {
        // Let links work without flipping the card.
        if (event.target.closest("a, button, input, textarea, select")) {
            return;
        }

        flipCard();
    });

    card.addEventListener("keydown", event => {
        // Only handle keys when the card itself is focused.
        if (event.target !== card) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            flipCard();
        }
    });
});

// AI
const chatBotButton = document.getElementById('ai_chat_button');
let chatBotActive = false;
function chatBotButtonClicked() {
    chatBotActive = !chatBotActive;
    chatBotButton.classList.toggle('active', chatBotActive);
}

chatBotButton.addEventListener('click', chatBotButtonClicked);