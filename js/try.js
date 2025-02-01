// Districts list of Bangladesh
const districts = [
    "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ", 
    "যশোর", "কুমিল্লা", "রাজবাড়ি", "বগুড়া", "দিনাজপুর", "পাবনা", "টাঙ্গাইল", "নোয়াখালী", 
    "ফেনী", "ঝিনাইদহ", "নীলফামারী", "সাতক্ষীরা", "খাগড়াছড়ি", "চাঁপাইনবাবগঞ্জ", "গাজীপুর", 
    "কুষ্টিয়া", "ব্রাহ্মণবাড়িয়া", "মিরপুর", "শরিয়তপুর", "শাহজাদপুর", "পটুয়াখালী", 
    "লক্ষ্মীপুর", "মুন্সীগঞ্জ", "নারায়ণগঞ্জ", "কক্সবাজার", "খুলনা", "মেহেরপুর", 
    "নাটোর", "মাগুরা", "বরগুনা", "বনগাঁও", "জামালপুর", "ব্রাহ্মণবাড়িয়া", "চুয়াডাঙ্গা", 
    "চট্টগ্রাম", "সিরাজগঞ্জ", "গোপালগঞ্জ", "ফরিদপুর", "কিশোরগঞ্জ", "রাঙ্গামাটি", "বান্দরবান", 
    "মৌলভীবাজার", "নরসিংদী", "মানিকগঞ্জ", "খুলনা", "ময়মনসিংহ", "লালমনিরহাট", 
    "কুমিল্লা", "গাইবান্ধা", "নীলফামারী", "ভোলা", "ঠাকুরগাঁও", "পঞ্চগড়", "জয়পুরহাট", 
    "কুড়িগ্রাম", "চাঁদপুর", "মীরসরাই", "সাতক্ষীরা", "নওগাঁ", "বরিশাল", "সিলেট", "কক্সবাজার"
  ];
  
  // Populating the district dropdown
  const districtSelect = document.getElementById("district");
  
  districts.forEach(district => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });
  
  // Fetch prayer times from the API
  const fetchPrayerTimes = (district) => {
    // You can use the "aladhan.com" API to get prayer times based on district
    const apiUrl = `http://api.aladhan.com/v1/calendarByCity?city=${district}&country=Bangladesh&method=2`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const times = data.data[0].timings;
        showPrayerTimes(times);
      })
      .catch(error => {
        console.error("Error fetching prayer times:", error);
      });
  };
  
  // Show prayer times in the UI
  const showPrayerTimes = (times) => {
    const prayerTimesDiv = document.getElementById("prayer-times");
    const ul = document.createElement("ul");
  
    for (const prayer in times) {
      const li = document.createElement("li");
      li.textContent = `${prayer}: ${times[prayer]}`;
      ul.appendChild(li);
    }
  
    prayerTimesDiv.innerHTML = '';
    prayerTimesDiv.appendChild(ul);
    prayerTimesDiv.style.display = 'block';
  };
  
  // Event listener to fetch prayer times when a district is selected
  districtSelect.addEventListener("change", () => {
    const district = districtSelect.value;
    if (district) {
      fetchPrayerTimes(district);
    }
  });
  