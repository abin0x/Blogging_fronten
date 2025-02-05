// Function to convert custom date format to a valid date object
function parseCustomDate(dateString) {
    const dateMatch = dateString.match(/^(\d{1,2}) (\w+), (\d{4}) - (\d{1,2}):(\d{2})(AM|PM)$/);

    if (!dateMatch) return new Date(dateString); // If format doesn't match, return original string

    const [_, day, month, year, hour, minute, period] = dateMatch;

    const months = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    };

    const monthIndex = months[month];
    const hour24 = period === "PM" ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12;

    return new Date(year, monthIndex, day, hour24, minute);
}

// Function to fetch blogs with pagination
async function fetchBlogs(page = 1) {
    const blogsPerPage = 9;  // Number of blogs per page
    const apiUrl = `http://127.0.0.1:8000/api/blogs/?page=${page}&page_size=${blogsPerPage}`;
    const blogsContainer = document.getElementById("blogs-container");
    const paginationContainer = document.getElementById("pagination-container");

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const blogs = data.results; // Assuming 'results' contains the blog list
        const totalBlogs = data.count; // Assuming 'count' contains the total number of blogs
        const totalPages = Math.ceil(totalBlogs / blogsPerPage); // Calculate total pages

        // Clear existing blog cards
        blogsContainer.innerHTML = "";

        // Display blogs
        blogs.forEach((blog) => {
            const blogCard = document.createElement("div");
            blogCard.classList.add("blog-card");

            const imageUrl = blog.featured_image || "https://via.placeholder.com/150";
            const createdAt = parseCustomDate(blog.created_at);
            const formattedDate = isNaN(createdAt) ? "Invalid Date" : createdAt.toLocaleDateString('bn-BD', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            blogCard.innerHTML = `
                <h3>${blog.title}</h3>
                <img src="${imageUrl}" alt="Blog Image">
                <div class="blog-author">লিখেছেন ${blog.author}</div>
                <p>${blog.content.slice(0, 100)}...</p>
                <div class="blog-meta">
                    <span>${formattedDate}</span>
                    <span>${blog.reading_time} Min Read</span>
                    <span>${blog.views_count || 0} Views</span>
                </div>
                <div class="reactions-button-row">
                    <button class="read-more" data-id="${blog.id}">Read More</button>
                    <div class="reactions">
                        <div class="reaction">
                            <i class="fas fa-thumbs-up"></i> ${blog.good_reactions_count || 0}
                        </div>
                        <div class="reaction">
                            <i class="fas fa-thumbs-down"></i> ${blog.bad_reactions_count || 0}
                        </div>
                    </div>
                </div>
            `;

            blogsContainer.appendChild(blogCard);
        });

        // Handle page numbers and show pagination
        renderPagination(paginationContainer, totalPages, page);

        // Add event listener for the "Read More" buttons
        document.querySelectorAll(".read-more").forEach((button) => {
            button.addEventListener("click", () => {
                const blogId = button.getAttribute("data-id");
                window.location.href = `html/blog_details.html?id=${blogId}`;
            });
        });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        blogsContainer.innerHTML = `<p class="error-message">Failed to load blogs. Please try again later.</p>`;
    }
}

// Function to render pagination
function renderPagination(paginationContainer, totalPages, currentPage) {
    paginationContainer.innerHTML = "";

    // "Previous" Button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => fetchBlogs(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    // Dynamic Page Numbers
    const pageNumbersToShow = getDynamicPageNumbers(currentPage, totalPages);

    pageNumbersToShow.forEach((pageNumber) => {
        const pageButton = document.createElement("button");
        pageButton.textContent = pageNumber;
        pageButton.classList.toggle("active", pageNumber === currentPage);
        pageButton.addEventListener("click", () => fetchBlogs(pageNumber));
        paginationContainer.appendChild(pageButton);
    });

    // "Next" Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => fetchBlogs(currentPage + 1));
    paginationContainer.appendChild(nextButton);
}

// Function to determine dynamic page numbers
function getDynamicPageNumbers(currentPage, totalPages) {
    let startPage, endPage;

    // If we're near the beginning, show the first few pages
    if (currentPage <= 2) {
        startPage = 1;
        endPage = Math.min(4, totalPages); // Show pages 1, 2, 3, 4 if there are enough pages
    }
    // If we're near the end, show the last few pages
    else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
        endPage = totalPages;
    }
    // If we're in the middle, show the previous, current, and next pages
    else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
    }

    // Generate the array of page numbers to display
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

// Fetch the blogs when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchBlogs(); // Load first page by default
});

// Function to fetch media albums
async function fetchMedia() {
    const apiUrl = "http://127.0.0.1:8000/api/media/";
    const albumsContainer = document.getElementById("albums-container");
    const viewAllButton = document.getElementById("view-all-button");  // Button to view all media

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const mediaAlbums = await response.json();

        // Clear existing content in the container
        albumsContainer.innerHTML = "";

        // Display only the first 4 albums initially
        const limitedAlbums = mediaAlbums.slice(0, 4);

        limitedAlbums.forEach((album) => {
            const albumCard = document.createElement("div");
            albumCard.classList.add("album-card");

            const imageUrl = album.thumbnail || "https://via.placeholder.com/200"; // Default image if none
            albumCard.innerHTML = `
                <img src="${imageUrl}" alt="Album Image">
                <p>${album.title}</p>
            `;

            // Add event listener to navigate to media page
            albumCard.addEventListener("click", () => {
                window.location.href = `html/media.html`;
            });

            albumsContainer.appendChild(albumCard);
        });

        // Show the "View All" button if there are more than 4 albums
        if (mediaAlbums.length > 4) {
            viewAllButton.style.display = "block";  // Make "View All" button visible
            viewAllButton.addEventListener("click", () => {
                window.location.href = "html/media.html";  // Redirect to media page to view all albums
            });
        } else {
            viewAllButton.style.display = "none";  // Hide "View All" button if no more albums
        }

    } catch (error) {
        console.error("Error fetching media albums:", error);
        albumsContainer.innerHTML = `<p class="error-message">Failed to load media albums. Please try again later.</p>`;
    }
}

// Fetch the media albums when the page loads
document.addEventListener("DOMContentLoaded", fetchMedia);
