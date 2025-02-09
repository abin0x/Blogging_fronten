const quranDisplay = document.getElementById('quran-display');
const surahSelect = document.getElementById('surah-select');
const surahInfoDisplay = document.getElementById('surah-info');
const scrollButton = document.getElementById('scrollButton');
const scrollSpeedInput = document.getElementById('scrollSpeedInput'); // Get the input element

const arabicQuranURL_quran_academy = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy.json";
const arabicQuranURL_la2 = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quran-la2.json";
const englishTranslationURL = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-ahmedali.json";
const bengaliTranslationURL = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ben-muhiuddinkhan.json";
const transliterationURL = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-laurencemitchel.json";

const surahNames = [
    "Al-Fatiha", "Al-Baqarah", "Aali Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
    "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
    "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
    "Luqman", "As-Sajdah", "Al-Ahzab", "As-Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
    "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
    "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
    "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
    "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
    "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const surahVerseCounts = [ // Corrected verse counts for each Surah
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
    123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
    34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
    54, 53, 89, 59, 37, 35, 38, 29, 19, 45,
    60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
    14, 11, 11, 12, 12, 18, 52, 52, 44, 28,
    28, 20, 56, 40, 31, 50, 40, 46, 42, 29,
    19, 36, 25, 22, 17, 19, 26, 30, 20, 15,
    21, 11, 8, 8, 19, 5, 8, 8, 11, 11,
    8, 3, 9, 5, 4, 7, 3, 6, 3, 5,
    4, 5, 6
];

// Populate Surah dropdown
surahNames.forEach((surahName, index) => {
    const option = document.createElement('option');
    option.value = index + 1;
    option.textContent = `${index + 1}. ${surahName}`;
    surahSelect.appendChild(option);
});

// Load default Surah on page load (e.g., Al-Fatiha)
loadSurah();

surahSelect.addEventListener('change', loadSurah);

async function loadSurah() {
    const selectedSurah = surahSelect.value;
    if (!selectedSurah) {
        return;
    }

    const surahIndex = parseInt(selectedSurah) - 1;
    const surahName = surahNames[surahIndex];
    const verseCount = surahVerseCounts[surahIndex];

    surahInfoDisplay.innerHTML = `
        <h2 style="color: #2892f5; font-size: 1.8em; margin-bottom: 10px;">${surahName}</h2>
        <p style="font-size: 1.05rem;">Total Verses: ${verseCount} verses</p>
    `;


    try {
        const response = await fetch(arabicQuranURL_quran_academy);
        const data = await response.json();
        const surahVerses = data.quran.filter(verse => verse.chapter == selectedSurah);
        displaySurah(surahVerses);
    } catch (error) {
        console.error("Error fetching Quran data:", error);
        surahInfoDisplay.innerHTML = "<p>Failed to load Surah info.</p>";
        quranDisplay.innerHTML = "<p>Failed to load Surah verses.</p>";
    }
}

function displaySurah(surahData) {
    quranDisplay.innerHTML = '';

    if (!surahData || surahData.length === 0) {
        quranDisplay.innerHTML = "<p>No verses found for this Surah.</p>";
        return;
    }

    surahData.forEach(verse => {
        const verseLineDiv = document.createElement('div');
        verseLineDiv.classList.add('verse-line');

        const verseTextP = document.createElement('p');
        verseTextP.classList.add('verse-text');
        verseTextP.textContent = verse.text;
        verseLineDiv.appendChild(verseTextP);

        const verseTranslationsDiv = document.createElement('div');
        verseTranslationsDiv.classList.add('verse-translations');
        verseLineDiv.appendChild(verseTranslationsDiv);

        verseLineDiv.addEventListener('click', () => toggleTranslations(verseLineDiv, verse.chapter, verse.verse, verseLineDiv)); // Pass verseLineDiv

        quranDisplay.appendChild(verseLineDiv);
    });
}

async function toggleTranslations(verseLineDiv, chapter, verseNumber, clickedVerseDiv) { // Accept clickedVerseDiv
    const translationsDiv = clickedVerseDiv.querySelector('.verse-translations'); // Use clickedVerseDiv
    if (!translationsDiv) return;

    if (!translationsDiv.classList.contains('show')) {
        document.querySelectorAll('.verse-translations.show').forEach(el => {
            if (el.closest('.verse-line') !== clickedVerseDiv) { // Check against closest verse-line
                el.classList.remove('show');
                el.innerHTML = '';
            }
        });

        translationsDiv.classList.add('show');
        translationsDiv.innerHTML = '<p>Loading translations...</p>';

        try {
            // Fetch Arabic Text (la2)
            const arabicResponse_la2 = await fetch(arabicQuranURL_la2);
            const arabicData_la2 = await arabicResponse_la2.json();
            const arabicVerse_la2 = arabicData_la2.quran.find(v => v.chapter == chapter && v.verse == verseNumber);
            const arabicText_la2 = arabicVerse_la2 ? arabicVerse_la2.text : "Arabic text not found.";

            // Fetch English Translation
            const englishResponse = await fetch(englishTranslationURL);
            const englishData = await englishResponse.json();
            const englishVerse = englishData.quran.find(v => v.chapter == chapter && v.verse == verseNumber);
            const englishText = englishVerse ? englishVerse.text : "English translation not found.";

            // Fetch Bengali Translation
            const bengaliResponse = await fetch(bengaliTranslationURL);
            const bengaliData = await bengaliResponse.json();
            const bengaliVerse = bengaliData.quran.find(v => v.chapter == chapter && v.verse == verseNumber);
            const banglaText = bengaliVerse ? bengaliVerse.text : "Bengali translation not found.";

            translationsDiv.innerHTML = `
                <div class="translation-section" id="arabic-translation-la2">
                    <p>আরবি উচ্চারণ</p>
                    <p class="translation-text">${arabicText_la2}</p>
                </div>
                <div class="translation-section" id="english-translation">
                    <p>ইংরেজি অনুবাদ</p>
                    <p class="translation-text">${englishText}</p>
                </div>
                <div class="translation-section" id="bangla-translation">
                    <p>বাংলা অনুবাদ</p>
                    <p class="translation-text">${banglaText}</p>
                </div>`;

        } catch (error) {
            console.error("Error fetching translations:", error);
            translationsDiv.innerHTML = "<p>Failed to load translations.</p>";
        }

    } else {
        translationsDiv.classList.remove('show');
        translationsDiv.innerHTML = '';
    }
}

function scrollToBottom() {
    let scrollDuration = parseInt(scrollSpeedInput.value, 10); // Get value from input
    if (isNaN(scrollDuration) || scrollDuration < 100) {
        scrollDuration = 15000; // Default duration if input is invalid
        scrollSpeedInput.value = '15000'; // Update input to default value
        alert("Invalid scroll speed. Using default speed."); // Optional alert
    }

    const startTime = performance.now();
    const startY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    function scrollStep(timestamp) {
        const currentTime = timestamp - startTime;
        const scrollYPos = easeInOutQuad(currentTime, startY, documentHeight - startY, scrollDuration);

        window.scrollTo(0, scrollYPos);

        if (currentTime < scrollDuration) {
            requestAnimationFrame(scrollStep);
        }
    }

    // Easing function for smooth scroll (easeInOutQuad)
    function easeInOutQuad(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    }

    requestAnimationFrame(scrollStep);
}