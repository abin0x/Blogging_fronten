document.addEventListener("DOMContentLoaded", function () {
    const categoryListContainer = document.getElementById("categoryListContainer"); // Container for category list
    const blogsContainer = document.getElementById("blogsContainer"); // Container for blog cards
    const prevButton = document.getElementById("prevPage"); // Previous page button
    const nextButton = document.getElementById("nextPage"); // Next page button
    const currentPageIndicator = document.getElementById("currentPage"); // Current page indicator

    let currentCategoryId = null; // Currently selected category ID
    let currentPage = 1; // Current page number

    const API_BASE_URL = "http://127.0.0.1:8000/api";

    // Fetch categories and display them
    fetchCategories();

    // Initial fetch of all blogs
    fetchAllBlogs();

    /**
     * Fetch and display categories
     */
    function fetchCategories() {
        fetch(`${API_BASE_URL}/categories/`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch categories");
                return response.json();
            })
            .then((categories) => displayCategories(categories))
            .catch((error) => console.error("Error fetching categories:", error));
    }

    /**
     * Display categories in the category list
     */
    function displayCategories(categories) {
        categoryListContainer.innerHTML = ""; // Clear existing categories

        // Add 'All Categories' option
        const allCategoriesItem = createCategoryItem("All Categories", null);
        categoryListContainer.appendChild(allCategoriesItem);

        // Add individual categories
        categories.forEach((category) => {
            const categoryItem = createCategoryItem(category.name, category.id);
            categoryListContainer.appendChild(categoryItem);
        });
    }

    /**
     * Create a category list item
     */
    function createCategoryItem(name, id) {
        const categoryItem = document.createElement("li");
        categoryItem.textContent = name;
        categoryItem.classList.add("category-item");
        categoryItem.addEventListener("click", () => {
            currentCategoryId = id; // Set the current category
            currentPage = 1; // Reset to the first page
            id ? fetchBlogsByCategory(id) : fetchAllBlogs(); // Fetch blogs
        });
        return categoryItem;
    }

    /**
     * Fetch blogs by category
     */
    function fetchBlogsByCategory(categoryId, page = 1) {
        fetch(`${API_BASE_URL}/cat/${categoryId}/blogs/?page=${page}`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch blogs by category");
                return response.json();
            })
            .then((data) => handleBlogsResponse(data, page))
            .catch((error) => console.error("Error fetching blogs by category:", error));
    }

    /**
     * Fetch all blogs
     */
    function fetchAllBlogs(page = 1) {
        fetch(`${API_BASE_URL}/blogs/?page=${page}`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch blogs");
                return response.json();
            })
            .then((data) => handleBlogsResponse(data, page))
            .catch((error) => console.error("Error fetching all blogs:", error));
    }

    /**
     * Handle blogs response and update UI
     */
    function handleBlogsResponse(data, page) {
        displayBlogs(data.results); // Display the blogs
        updatePaginationControls(data.next, data.previous); // Update pagination buttons
        currentPageIndicator.textContent = `Page ${page}`; // Update page indicator
    }

    /**
     * Display blogs in the blogs container
     */
    function displayBlogs(blogs) {
        blogsContainer.innerHTML = ""; // Clear existing blogs

        if (blogs.length === 0) {
            blogsContainer.innerHTML = "<p>No blogs found.</p>";
            return;
        }

        blogs.forEach((blog) => {
            const blogCard = createBlogCard(blog);
            blogsContainer.appendChild(blogCard);
        });
    }

    /**
     * Create a blog card element
     */
    function createBlogCard(blog) {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");
        blogCard.innerHTML = `
            <img src="${blog.featured_image}" alt="Blog Image" class="blog-image">
            <div class="blog-content">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-category">${blog.category.name}</p>
                <p class="blog-author">By: ${blog.author}</p>
                <p class="blog-content-preview">${blog.content.substring(0, 100)}...</p>
                <p class="blog-created-at">Created at: ${blog.created_at}</p>
                <p class="blog-reading-time">Reading time: ${blog.reading_time} min</p>
                <div class="blog-tags">
                    ${blog.tags.map((tag) => `<span class="blog-tag">${tag.name}</span>`).join("")}
                </div>
                <div class="blog-reactions">
                    <span class="good-reactions">Good reactions: ${blog.good_reactions_count}</span>
                    <span class="bad-reactions">Bad reactions: ${blog.bad_reactions_count}</span>
                </div>
                <span class="views-count">Views: ${blog.views_count}</span>
            </div>
        `;
        return blogCard;
    }

    /**
     * Update pagination controls (buttons)
     */
    function updatePaginationControls(next, previous) {
        prevButton.disabled = !previous;
        nextButton.disabled = !next;

        prevButton.onclick = () => {
            if (previous) {
                const prevPage = getPageFromUrl(previous) || 1; // Default to page 1 if missing
                currentPage = parseInt(prevPage, 10);
                fetchBlogs();
            }
        };

        nextButton.onclick = () => {
            if (next) {
                const nextPage = getPageFromUrl(next);
                if (nextPage) {
                    currentPage = parseInt(nextPage, 10);
                    fetchBlogs();
                } else {
                    console.error("Invalid next page URL:", next);
                }
            }
        };
    }

    /**
     * Extract the page number from a URL
     */
    function getPageFromUrl(url) {
        try {
            const urlObj = new URL(url, window.location.origin);
            return urlObj.searchParams.get("page"); // Return the 'page' parameter
        } catch (error) {
            console.error("Failed to parse URL:", url, error);
            return null; // Return null if the URL is invalid
        }
    }

    /**
     * Fetch blogs based on the current category and page
     */
    function fetchBlogs() {
        currentCategoryId ? fetchBlogsByCategory(currentCategoryId, currentPage) : fetchAllBlogs(currentPage);
    }
});
