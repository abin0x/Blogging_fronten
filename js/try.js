// Districts list of Bangladesh
const districts = [
  "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ",
  "যশোর", "কুমিল্লা", "রাজবাড়ি", "বগুড়া", "দিনাজপুর", "পাবনা", "টাঙ্গাইল", "নোয়াখালী",
  "ফেনী", "ঝিনাইদহ", "নীলফামারী", "সাতক্ষীরা", "খাগড়াছড়ি", "চাঁপাইনবাবগঞ্জ", "গাজীপুর",
  "কুষ্টিয়া", "ব্রাহ্মণবাড়িয়া", "মিরপুর", "শরিয়তপুর", "শাহজাদপুর", "পটুয়াখালী",
  "লক্ষ্মীপুর", "মুন্সীগঞ্জ", "নারায়ণগঞ্জ", "কক্সবাজার", "মেহেরপুর", "নাটোর",
  "মাগুরা", "বরগুনা", "জামালপুর", "চুয়াডাঙ্গা", "সিরাজগঞ্জ", "গোপালগঞ্জ",
  "ফরিদপুর", "কিশোরগঞ্জ", "রাঙ্গামাটি", "বান্দরবান", "মৌলভীবাজার", "নরসিংদী",
  "মানিকগঞ্জ", "লালমনিরহাট", "গাইবান্ধা", "ভোলা", "ঠাকুরগাঁও", "পঞ্চগড়", "জয়পুরহাট",
  "কুড়িগ্রাম", "চাঁদপুর", "সাতক্ষীরা", "নওগাঁ"
];

// Populate the district dropdown
const districtSelect = document.getElementById("district");
districts.forEach(district => {
  const option = document.createElement("option");
  option.value = district;
  option.textContent = district;
  districtSelect.appendChild(option);
});

// Fetch prayer times from API
const fetchPrayerTimes = (district) => {
  const apiUrl = `http://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(district)}&country=Bangladesh&method=2`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (!data || !data.data || !data.data[0] || !data.data[0].timings) {
        console.error("Invalid API response:", data);
        return;
      }

      const times = data.data[0].timings;
      adjustPrayerTimes(times); // Adjust Fajr (-14 min) and Isha (+15 min)
      showPrayerTimes(times); // Display prayer times in UI
    })
    .catch(error => {
      console.error("Error fetching prayer times:", error);
    });
};

// Adjust Fajr time (-14 min) and Isha time (+15 min)
const adjustPrayerTimes = (times) => {
  if (!times || !times.Fajr || !times.Isha) {
    console.error("Invalid prayer times:", times);
    return;
  }

  // Adjust Fajr (-14 min)
  times.Fajr = adjustTime(times.Fajr, -14);

  // Adjust Isha (+15 min)
  times.Isha = adjustTime(times.Isha, 15);
};

// Helper function to adjust time by minutes
const adjustTime = (time, offset) => {
  if (!time.includes(":")) return time;

  let [hours, minutes] = time.trim().split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) return time;

  minutes += offset;

  if (minutes >= 60) {
    minutes -= 60;
    hours = (hours + 1) % 24;
  } else if (minutes < 0) {
    minutes += 60;
    hours = (hours === 0) ? 23 : hours - 1;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// Show prayer times in UI
const showPrayerTimes = (times) => {
  const prayerTimesDiv = document.getElementById("prayer-times");
  const ul = document.createElement("ul");
  ul.classList.add("prayer-list");

  for (const prayer in times) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="prayer-name">${prayer}</span> <span class="prayer-time">${times[prayer]}</span>`;
    ul.appendChild(li);
  }

  prayerTimesDiv.innerHTML = ''; // Clear previous data
  prayerTimesDiv.appendChild(ul);
  prayerTimesDiv.classList.add("fade-in"); // Add animation
};

// Event listener for district selection
districtSelect.addEventListener("change", () => {
  const district = districtSelect.value;
  if (district) {
    fetchPrayerTimes(district);
  }
});