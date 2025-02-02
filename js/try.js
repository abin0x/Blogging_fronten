// District List
const districts = [
  "বরগুনা", "বরিশাল", "ভোলা", "ঝালকাঠী", "পটুয়াখালী", "পিরোজপুর", "বান্দরবান", "ব্রাহ্মনবাড়ীয়া", "চাঁদপুর", 
  "চট্টগ্রাম", "কুমিল্লা", "কক্সবাজার", "ফেনী", "খাগড়াছড়ি", "লক্ষীপুর", "নোয়াখালী", "রাঙ্গামাটি", "ঢাকা", "ফরিদপুর", 
  "গাজীপুর", "গোপালগঞ্জ", "কিশোরগঞ্জ", "মাদারীপুর", "মানিকগঞ্জ", "মুন্সীগঞ্জ", "নারায়ণগঞ্জ", "নরসিংদী", "রাজবাড়ী", 
  "শরীয়তপুর", "টাঙ্গাইল", "জামালপুর", "ময়মনসিংহ", "নেত্রকোনা", "শেরপুর", "বাগেরহাট", "চুয়াডাঙা", "যশোর", "ঝিনাইদহ", 
  "খুলনা", "কুষ্টিয়া", "মাগুরা", "মেহেরপুর", "নড়াইল", "সাতক্ষীরা", "রাজশাহী", "বগুরা", "জয়পুরহাট", "নওগাঁ", "নাটোর", 
  "চাঁপাই নওয়াবগঞ্জ", "পাবনা", "রাজশাহী", "সিরাজগঞ্জ", "রংপুর", "গাইবান্ধা", "কুড়িগ্রাম", "নীলফামারী", "লালমনিরহাট", 
  "দিনাজপুর", "ঠাকুরগাঁও", "পঞ্চগড়", "হবিগঞ্জ", "মৌলভীবাজার", "সুনামগঞ্জ", "সিলেট"
];

// Initialize District Select
const districtSelect = document.getElementById("district");
districts.forEach(district => {
  const option = new Option(district, district);
  districtSelect.add(option);
});

// Prayer Names in Bengali
const prayerNamesBn = {
  "Fajr": "ফজর",
  "Sunrise": "সূর্যোদয়",
  "Dhuhr": "যোহর",
  "Asr": "আসর",
  "Sunset": "সূর্যাস্ত",
  "Maghrib": "মাগরিব",
  "Isha": "ইশা",
  "Imsak": "সেহরি শেষ",
  "Midnight": "মধ্যরাত",
  "Firstthird": "প্রথম তৃতীয়াংশ",
  "Lastthird": "শেষ তৃতীয়াংশ"
};

// Fetch Prayer Times
const fetchPrayerTimes = async (district) => {
  try {
    showLoadingMessage("নামাজের সময় লোড হচ্ছে...");
    
    const response = await fetch(`http://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(district)}&country=Bangladesh&method=2`);
    const data = await response.json();
    
    if (!data?.data?.[0]?.timings) {
      showErrorMessage("তথ্য পাওয়া যায়নি");
      return;
    }

    // Update Islamic Date
    const hijriDate = data.data[0].date.hijri;
    const islamicDate = `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}`;
    document.getElementById('islamic-date').textContent = `ইসলামি তারিখ: ${islamicDate}`;

    // Process Prayer Times
    const times = data.data[0].timings;
    adjustPrayerTimes(times);
    showPrayerTimes(times);

  } catch (error) {
    showErrorMessage("ডেটা লোড করতে সমস্যা হয়েছে");
    console.error("Error:", error);
  }
};

// Time Adjustments
const adjustPrayerTimes = (times) => {
  if (times.Fajr) times.Fajr = adjustTime(times.Fajr, -14);
  if (times.Asr) times.Asr = adjustTime(times.Asr, 48);
  if (times.Isha) times.Isha = adjustTime(times.Isha, 15);
};

const adjustTime = (time, offset) => {
  const match = time.match(/(\d{2}):(\d{2})/);
  if (!match) return time;
  
  let [_, hours, minutes] = match;
  let totalMinutes = parseInt(hours) * 60 + parseInt(minutes) + offset;
  
  totalMinutes = (totalMinutes + 1440) % 1440;
  const newHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const newMinutes = (totalMinutes % 60).toString().padStart(2, '0');
  
  return `${newHours}:${newMinutes}`;
};

// Display Prayer Times
const showPrayerTimes = (times) => {
  const prayerTimesDiv = document.getElementById("prayer-times");
  prayerTimesDiv.innerHTML = '<h2>🕌 নামাজের সময়সূচী</h2>';
  
  const grid = document.createElement('div');
  grid.className = 'prayer-grid';

  const mainPrayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Sunset", "Maghrib", "Isha"];
  const otherPrayers = ["Imsak", "Midnight", "Firstthird", "Lastthird"];

  // Main Prayers
  mainPrayers.forEach(prayer => {
    if (prayerNamesBn[prayer]) {
      const card = document.createElement('div');
      card.className = 'prayer-card';
      const cleanTime = formatTimeWithAMPM(times[prayer].split(' ')[0]);
      card.innerHTML = `
        <div class="prayer-name">${prayerNamesBn[prayer]}</div>
        <div class="prayer-time">${cleanTime}</div>
        <div class="countdown" id="countdown-${prayer}"></div>
      `;
      grid.appendChild(card);
    }
  });

  // Other Prayers
  const otherGrid = document.createElement('div');
  otherGrid.className = 'prayer-grid';
  otherPrayers.forEach(prayer => {
    if (prayerNamesBn[prayer]) {
      const card = document.createElement('div');
      card.className = 'prayer-card';
      const cleanTime = formatTimeWithAMPM(times[prayer].split(' ')[0]);
      card.innerHTML = `
        <div class="prayer-name">${prayerNamesBn[prayer]}</div>
        <div class="prayer-time">${cleanTime}</div>
      `;
      otherGrid.appendChild(card);
    }
  });

  prayerTimesDiv.appendChild(grid);
  prayerTimesDiv.appendChild(otherGrid);
  prayerTimesDiv.classList.add('fade-in');

  // Start countdown for main prayers
  startCountdown(times);
};

// Format time with AM/PM
const formatTimeWithAMPM = (time) => {
  const [hours, minutes] = time.split(':');
  const hoursInt = parseInt(hours);
  const ampm = hoursInt >= 12 ? 'PM' : 'AM';
  const adjustedHour = hoursInt % 12 || 12; // 12-hour format
  return `${adjustedHour}:${minutes} ${ampm}`;
};

// Start Countdown
const startCountdown = (times) => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  Object.entries(times).forEach(([prayer, time]) => {
    const [hours, minutes] = time.split(':');
    const prayerTime = parseInt(hours) * 60 + parseInt(minutes);
    const diff = prayerTime - currentTime;

    if (diff > 0) {
      const countdownElement = document.getElementById(`countdown-${prayer}`);
      if (countdownElement) {
        setInterval(() => {
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const remaining = prayerTime - currentTime;
          if (remaining > 0) {
            const hoursRemaining = Math.floor(remaining / 60);
            const minutesRemaining = remaining % 60;
            countdownElement.textContent = `${hoursRemaining} ঘন্টা ${minutesRemaining} মিনিট বাকি`;
          } else {
            countdownElement.textContent = "সময় শেষ";
          }
        }, 1000);
      }
    }
  });
};

// Time and Date Functions
function updateCurrentTime() {
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  document.getElementById('current-time').textContent = 
    new Date().toLocaleTimeString('en-US', options);
}

// Event Listeners
districtSelect.addEventListener('change', (e) => {
  if (e.target.value) fetchPrayerTimes(e.target.value);
});

// Initial Setup
setInterval(updateCurrentTime, 1000);
updateCurrentTime();

// Utility Functions
const showLoadingMessage = (msg) => {
  document.getElementById("prayer-times").innerHTML = `<p class="loading">${msg}</p>`;
};

const showErrorMessage = (msg) => {
  document.getElementById("prayer-times").innerHTML = `<p class="error">${msg}</p>`;
};
