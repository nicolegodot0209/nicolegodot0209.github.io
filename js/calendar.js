let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
let datesIDs = []

function setCalendar(month, year) {
    const calendarContent = document.getElementById("calendar_content");
    const monthYear = document.getElementById("month_year");
    monthYear.textContent = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const daysInMonth = new Date(year, month, 0).getDate();
    console.log(daysInMonth)
    if (datesIDs.length == 0) {
        for (let i = 0; i < daysInMonth; i++) {
            let dateID = "date_" + (i + 1);
            addDate(dateID);
        }
    }

    // card.querySelector(".event_title").textContent = eventInfo.title;
}

function addDate(id) {
    datesIDs.push(id);
    const template = document.getElementById("cell_template");
    const calendarContent = document.getElementById("calendar_content");
    const date = template.content.cloneNode(true);

    // 2. Target the top-level element wrapper inside the template
    const cellWrapper = date.querySelector(".cell-wrapper") || date.firstElementChild;

    // 3. Set the text content
    const dayNumber = id.split("_")[1];
    date.getElementById("date_number").textContent = dayNumber;  

    // 4. Correctly check for the weekend using a real Date object
    // Assuming your id provides enough context, or use current year/month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11
    const evaluationDate = new Date(currentYear, currentMonth, parseInt(dayNumber));

    const isWeekend = evaluationDate.getDay() === 0 || evaluationDate.getDay() === 6;
    
    if (isWeekend) {
        cellWrapper.style.backgroundColor = "#f0f0f0";
    }

    // 5. Append the fragment to the DOM
    calendarContent.appendChild(date);
}


setCalendar(currentMonth, currentYear);