const districtSelect = document.getElementById('district');
const namazTimesDiv = document.getElementById('namaz-times');

// Function to fetch Namaz times from Aladhan API
async function fetchNamazTimes(city) {
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Bangladesh&method=1`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.code === 200) {
            const timings = data.data.timings;
            return timings;
        } else {
            throw new Error("Failed to fetch Namaz times");
        }
    } catch (error) {
        console.error("Error fetching Namaz times:", error);
        return null;
    }
}

// Function to update Namaz times on the page
async function updateNamazTimes() {
    const selectedDistrict = districtSelect.value;
    const timings = await fetchNamazTimes(selectedDistrict);

    if (timings) {
        namazTimesDiv.innerHTML = `
            <p>ফজর: ${timings.Fajr}</p>
            <p>যোহর: ${timings.Dhuhr}</p>
            <p>আসর: ${timings.Asr}</p>
            <p>মাগরিব: ${timings.Maghrib}</p>
            <p>ইশা: ${timings.Isha}</p>
        `;
    } else {
        namazTimesDiv.innerHTML = "<p>নামাজের সময় লোড করতে সমস্যা হয়েছে।</p>";
    }
}

// Event listener for district selection change
districtSelect.addEventListener('change', updateNamazTimes);

// Initial call to display Namaz times for the default district
updateNamazTimes();