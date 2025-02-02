// 🕌 বাংলাদেশের জেলার তালিকা
const districts = [
  "বরগুনা", "বরিশাল", "ভোলা", "ঝালকাঠী", "পটুয়াখালী", "পিরোজপুর", "বান্দরবান", "ব্রাহ্মনবাড়ীয়া", "চাঁদপুর", 
  "চট্টগ্রাম", "কুমিল্লা", "কক্সবাজার", "ফেনী", "খাগড়াছড়ি", "লক্ষীপুর", "নোয়াখালী", "রাঙ্গামাটি", "ঢাকা", "ফরিদপুর", 
  "গাজীপুর", "গোপালগঞ্জ", "কিশোরগঞ্জ", "মাদারীপুর", "মানিকগঞ্জ", "মুন্সীগঞ্জ", "নারায়ণগঞ্জ", "নরসিংদী", "রাজবাড়ী", 
  "শরীয়তপুর", "টাঙ্গাইল", "জামালপুর", "ময়মনসিংহ", "নেত্রকোনা", "শেরপুর", "বাগেরহাট", "চুয়াডাঙা", "যশোর", "ঝিনাইদহ", 
  "খুলনা", "কুষ্টিয়া", "মাগুরা", "মেহেরপুর", "নড়াইল", "সাতক্ষীরা", "রাজশাহী", "বগুরা", "জয়পুরহাট", "নওগাঁ", "নাটোর", 
  "চাঁপাই নওয়াবগঞ্জ", "পাবনা", "রাজশাহী", "সিরাজগঞ্জ", "রংপুর", "গাইবান্ধা", "কুড়িগ্রাম", "নীলফামারী", "লালমনিরহাট", 
  "দিনাজপুর", "ঠাকুরগাঁও", "পঞ্চগড়", "হবিগঞ্জ", "মৌলভীবাজার", "সুনামগঞ্জ", "সিলেট"
];

// ✅ জেলা ড্রপডাউন পূরণ করুন
const districtSelect = document.getElementById("district");
districts.forEach(district => {
  const option = document.createElement("option");
  option.value = district;
  option.textContent = district;
  districtSelect.appendChild(option);
});

// ✅ নামাজের বাংলা নাম
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

// ✅ নামাজের সময় API থেকে আনুন (async/await ব্যবহার)
const fetchPrayerTimes = async (district) => {
  const apiUrl = `http://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(district)}&country=Bangladesh&method=2`;

  try {
    // লোডিং বার্তা দেখান
    showLoadingMessage("নামাজের সময় লোড হচ্ছে...");

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data?.data?.[0]?.timings) {
      showErrorMessage("নামাজের সময় পাওয়া যায়নি।");
      return;
    }

    const times = data.data[0].timings;
    adjustPrayerTimes(times); // সময় ঠিক করুন
    showPrayerTimes(times);   // UI-তে দেখান
  } catch (error) {
    showErrorMessage("API থেকে নামাজের সময় আনতে সমস্যা হয়েছে।");
    console.error("API Fetch Error:", error);
  }
};

// ✅ নামাজের সময় ঠিক করুন (ফজর -14 মিনিট, আসর +48 মিনিট, ইশা +15 মিনিট)
const adjustPrayerTimes = (times) => {
  if (times.Fajr) times.Fajr = adjustTime(times.Fajr, -14);
  if (times.Asr) times.Asr = adjustTime(times.Asr, 48);
  if (times.Isha) times.Isha = adjustTime(times.Isha, 15);
};

// ✅ সময় ঠিক করুন (HH:MM থেকে সময় পরিবর্তন)
const adjustTime = (time, offset) => {
  let match = time.match(/\d{2}:\d{2}/);
  if (!match) return time; // ভুল হলে আসল সময় দেখান

  let [hours, minutes] = match[0].split(":").map(Number);
  minutes += offset;

  while (minutes < 0) {
    minutes += 60;
    hours = hours === 0 ? 23 : hours - 1;
  }
  while (minutes >= 60) {
    minutes -= 60;
    hours = (hours + 1) % 24;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// ✅ UI-তে নামাজের সময় দেখান (বাংলা নাম + (+06) বাদ)
const showPrayerTimes = (times) => {
  const prayerTimesDiv = document.getElementById("prayer-times");
  prayerTimesDiv.innerHTML = ""; // আগের ডাটা মুছুন

  const ul = document.createElement("ul");
  ul.classList.add("prayer-list");

  for (const prayer in times) {
    if (prayerNamesBn[prayer]) {
      const li = document.createElement("li");
      const timeWithoutZone = times[prayer].split(" ")[0]; // (+06) অংশ মুছে ফেলা
      li.innerHTML = `<span class="prayer-name">${prayerNamesBn[prayer]}</span> <span class="prayer-time">${timeWithoutZone}</span>`;
      ul.appendChild(li);
    }
  }

  prayerTimesDiv.appendChild(ul);
  prayerTimesDiv.classList.add("fade-in"); // অ্যানিমেশন যোগ করুন
};

// ✅ লোডিং বার্তা দেখান
const showLoadingMessage = (message) => {
  const prayerTimesDiv = document.getElementById("prayer-times");
  prayerTimesDiv.innerHTML = `<p class="loading">${message}</p>`;
};

// ✅ এরর বার্তা দেখান
const showErrorMessage = (message) => {
  const prayerTimesDiv = document.getElementById("prayer-times");
  prayerTimesDiv.innerHTML = `<p class="error">${message}</p>`;
};

// ✅ এরিয়া নির্বাচন করলে নামাজের সময় দেখান
districtSelect.addEventListener("change", () => {
  const district = districtSelect.value;
  if (district) {
    fetchPrayerTimes(district);
  }
});
