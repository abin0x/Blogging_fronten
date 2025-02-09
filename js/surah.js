const surahSelect = document.getElementById('surahSelect');
        const ayahContainer = document.getElementById('ayahContainer');
        const mainAudio = document.getElementById('main-audio');

        fetch('https://api.alquran.cloud/v1/quran/ar.alafasy')
            .then(response => response.json())
            .then(data => {
                data.data.surahs.forEach(surah => {
                    const option = document.createElement('option');
                    option.value = surah.number;
                    option.text = surah.name + " (" + surah.englishName + ")";
                    surahSelect.appendChild(option);
                });

                surahSelect.addEventListener('change', () => {
                    const selectedSurah = surahSelect.value;
                    ayahContainer.innerHTML = '';
                    mainAudio.src = "";

                    const selectedSurahData = data.data.surahs.find(surah => surah.number == selectedSurah);
                    if (!selectedSurahData) return;

                    let audioElements = [];

                    selectedSurahData.ayahs.forEach((ayah, index) => {
                        const ayahDiv = document.createElement('div');
                        ayahDiv.classList.add('ayahDiv');
                        ayahDiv.innerHTML = `<p>${ayah.text}</p>`;
                        ayahContainer.appendChild(ayahDiv);

                        const audioElement = new Audio(ayah.audio);
                        audioElements.push(audioElement);
                        ayahDiv.addEventListener('click', () => playAyah(index));

                        // Preload a few ayahs ahead (adjust as needed)
                        if (index < 3) {
                            audioElement.preload = 'auto';
                            audioElement.addEventListener('loadeddata', () => { /* Audio is ready to play */ });
                        }

                        if (index === 0) {
                            audioElement.addEventListener('loadeddata', () => {
                                playAyah(0);
                            });
                        }
                    });

                    function playAyah(index) {
                        if (index < audioElements.length) {
                            mainAudio.src = audioElements[index].src;
                            mainAudio.play();

                            const allAyahDivs = ayahContainer.querySelectorAll('.ayahDiv');
                            allAyahDivs.forEach(div => div.classList.remove('playing'));
                            allAyahDivs[index].classList.add('playing');

                            mainAudio.addEventListener('ended', function onEnded() {
                                mainAudio.removeEventListener('ended', onEnded);
                                // Continuous playback (uncomment if needed)
                                playAyah(index + 1);
                            });
                        }
                    }
                });
            });