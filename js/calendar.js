const apiUrl = "https://api.aladhan.com/v1/gToHCalendar";
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

// Function to load the calendar
function loadCalendar() {
    const year = document.getElementById('year-select').value;
    const month = document.getElementById('month-select').value;

    fetchCalendarData(month, year);
}

// Function to fetch and display the calendar
function fetchCalendarData(month, year) {
    fetch(`${apiUrl}/${month}/${year}`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                displayCalendar(data.data);
                displayTodayDate(data.data);
            } else {
                console.error('Error fetching calendar data');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to display the calendar
function displayCalendar(data) {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = "";

    // Display the header (starting from Saturday)
    const weekdays = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র'];
    weekdays.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.innerHTML = day;
        dayDiv.style.fontWeight = 'bold';
        dayDiv.style.color = '#2c3e50';
        calendarContainer.appendChild(dayDiv);
    });

    // Get current time and Maghrib adjustment logic
    const now = new Date();
    const currentHour = now.getHours();
    const afterMaghrib = currentHour >= 18; // Assume Maghrib is after 6:00 PM

    data.forEach((day, index) => {
        const dayDiv = document.createElement('div');
        let hijriDay = day.hijri.day;
        let englishDay = day.gregorian.day;
        let englishMonth = day.gregorian.month.number;

        // Adjust Hijri Date to start from previous day's sunset
        if (!afterMaghrib && index > 0) {
            hijriDay = data[index - 1].hijri.day;
        }

        // Highlight today's date correctly
        const today = now.getDate();
        if (englishDay == today && englishMonth == currentMonth && day.gregorian.year == currentYear) {
            dayDiv.classList.add('current-day');
        }

        dayDiv.innerHTML = `
            <div class="hijri-date">${hijriDay}</div>
            <div class="english-date">${englishDay}</div>
        `;
        calendarContainer.appendChild(dayDiv);
    });
}

// Function to display today's Islamic date correctly
function displayTodayDate(data) {
    const now = new Date();
    const currentHour = now.getHours();
    const dayIndex = now.getDate() - 1;

    let hijriDate;
    if (currentHour >= 18) {
        // After Maghrib: Show today's Hijri date
        hijriDate = data[dayIndex].hijri;
    } else {
        // Before Maghrib: Show yesterday's Hijri date
        hijriDate = dayIndex > 0 ? data[dayIndex - 1].hijri : data[dayIndex].hijri;
    }

    const currentDateElement = document.getElementById('today-date');
    currentDateElement.innerHTML = `আজকের ইসলামিক তারিখ: ${hijriDate.day} ${convertHijriMonthToBangla(hijriDate.month.en)} ${hijriDate.year}`;
}

// Convert Hijri month names from English to Bangla
function convertHijriMonthToBangla(month) {
    const monthsInBangla = {
        "Muharram": "মুহাররম",
        "Safar": "সফর",
        "Rabi' al-Awwal": "রাবি' আল-আউয়াল",
        "Rabi' al-Thani": "রাবি' আল-থানি",
        "Jumada al-Awwal": "জুমাদা আল-আউয়াল",
        "Jumada al-Thani": "জুমাদা আল-থানি",
        "Rajab": "রজব",
        "Sha'ban": "শাবান",
        "Ramadan": "রমজান",
        "Shawwal": "শাওয়াল",
        "Dhul-Qi'dah": "জিলক্বদ",
        "Dhul-Hijjah": "জিলহজ"
    };
    return monthsInBangla[month] || month;
}

// Initialize selectors
function initializeSelectors() {
    const currentYear = new Date().getFullYear();
    const yearSelect = document.getElementById('year-select');
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} সাল`;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;

    const monthSelect = document.getElementById('month-select');
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'অগাস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    monthSelect.value = currentMonth;
}

window.onload = function() {
    initializeSelectors();
    loadCalendar();
};
