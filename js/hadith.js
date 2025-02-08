// DOM Elements
const fetchButton = document.getElementById('fetch-button');
const hadithContent = document.getElementById('hadith-content');
const bookLinks = {
    bukhari: "https://random-hadith-generator.vercel.app/bukhari/",
    muslim: "https://random-hadith-generator.vercel.app/muslim/",
    abudawud: "https://random-hadith-generator.vercel.app/abudawud/",
    ibnmajah: "https://random-hadith-generator.vercel.app/ibnmajah/",
    tirmidhi: "https://random-hadith-generator.vercel.app/tirmidhi/"
};

const bookLimits = {
    bukhari: 7563,
    muslim: 3032,
    abudawud: 3998,
    ibnmajah: 4342,
    tirmidhi: 3956
};

let selectedBook = 'bukhari'; // Default book

// Add event listeners to the navbar links
document.getElementById('bukhari-link').addEventListener('click', () => setSelectedBook('bukhari'));
document.getElementById('muslim-link').addEventListener('click', () => setSelectedBook('muslim'));
document.getElementById('abudawud-link').addEventListener('click', () => setSelectedBook('abudawud'));
document.getElementById('ibnmajah-link').addEventListener('click', () => setSelectedBook('ibnmajah'));
document.getElementById('tirmidhi-link').addEventListener('click', () => setSelectedBook('tirmidhi'));

// Add event listener to fetch random Hadith when the button is clicked
fetchButton.addEventListener('click', fetchHadith);

// Function to set the selected book and fetch a random Hadith
function setSelectedBook(book) {
    selectedBook = book;
    fetchHadith(); // Fetch Hadith when a book is selected
    highlightSelectedBook(book);
}

// Function to highlight the selected book in the navbar
function highlightSelectedBook(book) {
    for (const key in bookLinks) {
        const link = document.getElementById(`${key}-link`);
        if (key === book) {
            link.style.backgroundColor = '#007BFF';
            link.style.color = 'white';
        } else {
            link.style.backgroundColor = '';
            link.style.color = '';
        }
    }
}

// Function to fetch Hadith from the selected book API
function fetchHadith() {
    const randomId = Math.floor(Math.random() * bookLimits[selectedBook]) + 1;
    fetch(`${bookLinks[selectedBook]}${randomId}`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.data) {
                hadithContent.innerHTML = `<div class="error">Error fetching data. No Hadith found.</div>`;
                return;
            }

            const hadithData = data.data;
            renderHadith(hadithData);
        })
        .catch(error => {
            console.error('Error:', error);
            hadithContent.innerHTML = `<div class="error">Something went wrong.</div>`;
        });
}

// Function to render the fetched Hadith on the page
function renderHadith(hadithData) {
    const book = hadithData.book.trim();
    const chapter = hadithData.chapterName.trim();
    const bookname = hadithData.bookName.trim();
    const hadithEnglish = hadithData.hadith_english.trim();
    const header = hadithData.header.trim();
    const reference = hadithData.refno.trim();

    hadithContent.innerHTML = `
        <div class="hadith-details">
            <h2>${book}</h2>
            <p><strong>Book Name:</strong> ${bookname}</p>
            <p><strong>Chapter:</strong> ${chapter}</p>
            <p><strong>Hadith (English):</strong> ${hadithEnglish}</p>
            <p><strong>Source:</strong> ${header}</p>
            <p><strong>Reference:</strong> ${reference}</p>
        </div>
    `;

    // Translate the English Hadith after displaying the original
    translateText(hadithEnglish, 'bn');
}

// Function to translate text using Google Translator API via RapidAPI
function translateText(text, targetLanguage) {
    const data = JSON.stringify({
        from: 'en',
        to: targetLanguage,
        text: text
    });

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            const response = JSON.parse(this.responseText);
            const translatedText = response.trans;
            renderTranslatedHadith(translatedText);
        }
    });

    xhr.open('POST', 'https://google-translate113.p.rapidapi.com/api/v1/translator/text');
    xhr.setRequestHeader('x-rapidapi-key', '947c8d03b9mshd8bd8ed20c26b92p162a6ajsn2e8732db163b'); // Replace with your RapidAPI key
    xhr.setRequestHeader('x-rapidapi-host', 'google-translate113.p.rapidapi.com');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
}

// Function to render the translated Hadith
function renderTranslatedHadith(translatedText) {
    const translatedSection = document.createElement('p');
    translatedSection.innerHTML = `<strong>Translated (Bangla):</strong> ${translatedText}`;
    hadithContent.appendChild(translatedSection);
}

// Initial fetch on page load for the default selected book
fetchHadith();