function getRandomAyah() {
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;
    getAyahData(randomAyahNumber);
}

function getSpecificAyah() {
    const ayahNumber = document.getElementById("ayahNumberInput").value;
    if (!ayahNumber || ayahNumber < 1 || ayahNumber > 6236) {
        document.getElementById("ayah").innerHTML = "❌ Invalid Ayah number, please enter a number between 1 and 6236.";
        return;
    }
    getAyahData(ayahNumber);
}

function getAyahData(ayahNumber) {
    const apiUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}`;
    const audioUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.alafasy`; // Audio URL

    Promise.all([
        fetch(apiUrl).then(response => response.json()),
        fetch(audioUrl).then(response => response.json()) // Fetch audio data
    ])
    .then(([ayahData, audioData]) => {
        if (ayahData.data && audioData.data && audioData.data.audio) { // Check if both ayah and audio data are available
            const arabicText = ayahData.data.text;
            const surahName = ayahData.data.surah.englishName;
            const ayahNumber = ayahData.data.number;

            const englishTranslationUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.asad`;
            const banglaTranslationUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/bn.bengali`;

            Promise.all([
                fetch(englishTranslationUrl).then(response => response.json()),
                fetch(banglaTranslationUrl).then(response => response.json())
            ])
            .then(([englishData, banglaData]) => {
                const englishTranslation = englishData.data[1].text;
                const banglaTranslation = banglaData.data[0].text;

                document.getElementById("ayah").innerHTML = `
                    <p><strong>📜 Arabic:</strong> ${arabicText}</p>
                    <p><strong>📖 English:</strong> ${englishTranslation}</p>
                    <p><strong>🌿 বাংলা:</strong> ${banglaTranslation}</p>
                    <div class="metadata">
                        <p><strong>Surah:</strong> ${surahName}</p>
                        <p><strong>Ayah Number:</strong> ${ayahNumber}</p>
                    </div>
                `;

                // Set and play the audio
                const audioElement = document.getElementById("ayahAudio");
                audioElement.src = audioData.data.audio;
                audioElement.play();

            })
            .catch(error => {
                console.error("Error fetching translations:", error);
                document.getElementById("ayah").innerHTML += "<p>❌ Error loading translations.</p>";
            });

        } else {
            document.getElementById("ayah").innerHTML = "❌ আয়াত বা অডিও লোড করা যায়নি, আবার চেষ্টা করুন।";
        }
    })
    .catch(error => {
        console.error("Error fetching Ayah or Audio:", error);
        document.getElementById("ayah").innerHTML = "❌ আয়াত বা অডিও লোড করা যায়নি, আবার চেষ্টা করুন।";
    });
}