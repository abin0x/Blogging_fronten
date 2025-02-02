// Function to fetch Hadith from a sample API
const fetchHadith = async () => {
  try {
      // Here we are using a hardcoded Hadith API (you can replace it with a real API if you find one)
      const response = await fetch('https://api.sunnah.com/v1/hadiths/random');
      
      // Check if the response is successful
      if (!response.ok) {
          throw new Error('Failed to fetch Hadith');
      }

      const data = await response.json();
      
      // Check if the data is available and contains the Hadith text
      if (data && data.hadith && data.hadith.text) {
          document.getElementById("hadith-text").innerText = data.hadith.text;
      } else {
          document.getElementById("hadith-text").innerText = "Hadith could not be loaded.";
      }
  } catch (error) {
      console.error("Error fetching Hadith:", error);
      document.getElementById("hadith-text").innerText = "Hadith could not be loaded.";
  }
};

// Initial fetch when the page loads
fetchHadith();
// jhj