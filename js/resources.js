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

// -- AI --
// Chatbot Button Toggle
const chatBotButton = document.getElementById('ai_chat_button');
let chatBotActive = false;
function chatBotButtonClicked() {
    chatBotActive = !chatBotActive;
    chatBotButton.classList.toggle('active', chatBotActive);
}
chatBotButton.addEventListener('click', chatBotButtonClicked);

// Sending Messages
let isBusy = false; // Flag to indicate if a message is being sent
const sendButton = document.getElementById('send_button');
const chatInput = document.getElementById('chat_input');
const chatCont = document.getElementById('chat_cont');

function addMessage(message, messageType) {
  const messageTemplate = document.getElementById('message_template');
  const clone = messageTemplate.content.cloneNode(true);
  const messageElement = clone.firstElementChild;
  const userMessage = message.trim();

  messageElement.textContent = message;
  messageElement.classList.add(messageType);
  chatCont.appendChild(clone);
}

function sendButtonClicked() {
  const userMessage = chatInput.value.trim();
  if (userMessage === '') return; // Don't send a message if empty
  // Reset the input field and stop sending further messages
  chatInput.value = '';
  sendButton.disabled = true;
  isBusy = true;
   // Add the user and AI's message to the chat
  addMessage(userMessage, 'user-message');
  sendToAI(userMessage)
    .then((reply) => {
      addMessage(reply, 'ai-message');
    })
    .catch((error) => {
      console.error("AI error:", error.message);
    })
    .finally(() => {
      sendButton.disabled = false;
      isBusy = false;
    });
}

// Event listeners for sending messages
sendButton.addEventListener('click', sendButtonClicked);
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey && !isBusy) {
    event.preventDefault(); 
    sendButtonClicked();
  }
  sendButton.disabled = (chatInput.value.trim() === '');
});

async function sendToAI(message) {
  const response = await fetch(
    "https://chatbot-c481.onrender.com/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error || `Request failed: ${response.status}`
    );
  }

  return data.reply;
}