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
    
    card.querySelector(".event-title").textContent = eventInfo.title;
    card.querySelector(".month").textContent = monthName;
    card.querySelector(".day").textContent = eventInfo.day;
    card.querySelector(".event-details").textContent = eventInfo.time + " • " + eventInfo.location;
    card.querySelector(".event-desc").textContent = eventInfo.description;


    eventList.appendChild(card);
}

addEventCard(exampleEvent);
addEventCard(exampleEvent);
addEventCard(exampleEvent);
addEventCard(exampleEvent);