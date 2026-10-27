const chatBotButton = document.getElementById('ai_chat_button');
let chatBotActive = false;
function chatBotButtonClicked() {
    chatBotActive = !chatBotActive;
    chatBotButton.classList.toggle('active', chatBotActive);
}

chatBotButton.addEventListener('click', chatBotButtonClicked);