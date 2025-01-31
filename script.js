function scrollToBlogs() {
    document.getElementById('blogs').scrollIntoView({ behavior: 'smooth' });
}

function readMore(blogId) {
    alert(`Redirecting to Blog ${blogId} details page!`);
    // Implement navigation logic here
}


// Function to handle the search
document.getElementById("search-btn").addEventListener("click", function () {
    const query = document.getElementById("search-input").value.toLowerCase();
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = ""; // Clear previous results

    // Collect all searchable content on the website
    const content = document.querySelectorAll("body *:not(script):not(style)");

    let resultsFound = false;

    content.forEach((element) => {
        const text = element.textContent || element.innerText;
        if (text.toLowerCase().includes(query) && query.length > 0) {
            resultsFound = true;

            // Create and display the result
            const result = document.createElement("div");
            result.textContent = text.trim();
            result.style.padding = "5px";
            result.style.borderBottom = "1px solid #ccc";
            resultsContainer.appendChild(result);
        }
    });

    if (!resultsFound && query.length > 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
    }
});




// vclcklg 
// hello world 
// hlfdfd jdfjjfd fjkdjf dfj jdjjj