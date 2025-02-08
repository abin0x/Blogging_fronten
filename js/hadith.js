function getRandomAyah() {
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;
    const apiUrl = `http://api.alquran.cloud/v1/ayah/${randomAyahNumber}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                const arabicText = data.data.text;
                const surahName = data.data.surah.englishName;
                const ayahNumber = data.data.number;

                // Get translation for English
                const englishTranslationUrl = `http://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/quran-uthmani,en.asad`;
                fetch(englishTranslationUrl)
                    .then(response => response.json())
                    .then(englishData => {
                        const englishTranslation = englishData.data[1].text; // English translation

                        // Get translation for Bangla
                        const banglaTranslationUrl = `http://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/bn.bengali`;
                        fetch(banglaTranslationUrl)
                            .then(response => response.json())
                            .then(banglaData => {
                                const banglaTranslation = banglaData.data[0].text; // Bangla translation

                                // Display the Ayah and its metadata
                                document.getElementById("ayah").innerHTML = `
                                    <p><strong>📜 Arabic:</strong> ${arabicText}</p>
                                    <p><strong>📖 English:</strong> ${englishTranslation}</p>
                                    <p><strong>🌿 বাংলা:</strong> ${banglaTranslation}</p>
                                    <div class="metadata">
                                        <p><strong>Surah:</strong> ${surahName}</p>
                                        <p><strong>Ayah Number:</strong> ${ayahNumber}</p>
                                    </div>
                                `;

                                // Get audio for the Ayah
                                const audioUrl = `http://api.alquran.cloud/v1/ayah/${randomAyahNumber}/audio/ar.abdulsamadturki`;
                                document.getElementById("audioSource").src = audioUrl;
                                document.getElementById("ayahAudio").load();
                                document.getElementById("audioPlayer").style.display = "block"; // Show audio player
                            })
                            .catch(error => {
                                console.error("Error fetching Bangla Translation:", error);
                                document.getElementById("ayah").innerHTML = "❌ বাংলা অনুবাদ লোড করা যায়নি, আবার চেষ্টা করুন।";
                            });
                    })
                    .catch(error => {
                        console.error("Error fetching English Translation:", error);
                        document.getElementById("ayah").innerHTML = "❌ ইংরেজি অনুবাদ লোড করা যায়নি, আবার চেষ্টা করুন।";
                    });
            } else {
                document.getElementById("ayah").innerHTML = "❌ আয়াত লোড করা যায়নি, আবার চেষ্টা করুন।";
            }
        })
        .catch(error => {
            console.error("Error fetching Ayah:", error);
            document.getElementById("ayah").innerHTML = "❌ আয়াত লোড করা যায়নি, আবার চেষ্টা করুন।";
        });
}

function getSpecificAyah() {
    const ayahNumber = document.getElementById("ayahNumberInput").value;

    // Check if the input is valid
    if (!ayahNumber || ayahNumber < 1 || ayahNumber > 6236) {
        document.getElementById("ayah").innerHTML = "❌ Invalid Ayah number, please enter a number between 1 and 6236.";
        return;
    }

    const apiUrl = `http://api.alquran.cloud/v1/ayah/${ayahNumber}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                const arabicText = data.data.text;
                const surahName = data.data.surah.englishName;
                const ayahNumber = data.data.number;

                // Get translation for English
                const englishTranslationUrl = `http://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.asad`;
                fetch(englishTranslationUrl)
                    .then(response => response.json())
                    .then(englishData => {
                        const englishTranslation = englishData.data[1].text; // English translation

                        // Get translation for Bangla
                        const banglaTranslationUrl = `http://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/bn.bengali`;
                        fetch(banglaTranslationUrl)
                            .then(response => response.json())
                            .then(banglaData => {
                                const banglaTranslation = banglaData.data[0].text; // Bangla translation

                                // Display the Ayah and its metadata
                                document.getElementById("ayah").innerHTML = `
                                    <p><strong>📜 Arabic:</strong> ${arabicText}</p>
                                    <p><strong>📖 English:</strong> ${englishTranslation}</p>
                                    <p><strong>🌿 বাংলা:</strong> ${banglaTranslation}</p>
                                    <div class="metadata">
                                        <p><strong>Surah:</strong> ${surahName}</p>
                                        <p><strong>Ayah Number:</strong> ${ayahNumber}</p>
                                    </div>
                                `;

                                // Get audio for the Ayah
                                const audioUrl = `http://api.alquran.cloud/v1/ayah/${ayahNumber}/audio/ar.abdulsamadturki`;
                                document.getElementById("audioSource").src = audioUrl;
                                document.getElementById("ayahAudio").load();
                                document.getElementById("audioPlayer").style.display = "block"; // Show audio player
                            })
                            .catch(error => {
                                console.error("Error fetching Bangla Translation:", error);
                                document.getElementById("ayah").innerHTML = "❌ বাংলা অনুবাদ লোড করা যায়নি, আবার চেষ্টা করুন।";
                            });
                    })
                    .catch(error => {
                        console.error("Error fetching English Translation:", error);
                        document.getElementById("ayah").innerHTML = "❌ ইংরেজি অনুবাদ লোড করা যায়নি, আবার চেষ্টা করুন।";
                    });
            } else {
                document.getElementById("ayah").innerHTML = "❌ আয়াত লোড করা যায়নি, আবার চেষ্টা করুন।";
            }
        })
        .catch(error => {
            console.error("Error fetching Ayah:", error);
            document.getElementById("ayah").innerHTML = "❌ আয়াত লোড করা যায়নি, আবার চেষ্টা করুন।";
        });
}
