document.addEventListener('DOMContentLoaded', function () {
    const categoryListContainer = document.getElementById('categoryListContainer'); // Container for category list
    const blogsContainer = document.getElementById('blogsContainer'); // Container for blog cards
    const prevButton = document.getElementById('prevPage'); // Previous page button
    const nextButton = document.getElementById('nextPage'); // Next page button
    const currentPageIndicator = document.getElementById('currentPage'); // Current page indicator
    let currentCategoryId = null; // Currently selected category ID
    let currentPage = 1; // Current page number

    // Fetch Categories
    fetch('http://127.0.0.1:8000/api/categories/')
        .then(response => response.json())
        .then(data => {
            displayCategories(data); // Display categories as a list
        })
        .catch(error => console.error('Error fetching categories:', error));

    // Function to display categories as a list
    function displayCategories(categories) {
        categoryListContainer.innerHTML = ''; // Clear existing categories

        // Add 'All Categories' option
        const allCategoriesItem = document.createElement('li');
        allCategoriesItem.textContent = 'All Categories';
        allCategoriesItem.classList.add('category-item');
        allCategoriesItem.addEventListener('click', () => fetchAllBlogs());
        categoryListContainer.appendChild(allCategoriesItem);

        // Add each category as a list item
        categories.forEach(category => {
            const categoryItem = document.createElement('li');
            categoryItem.textContent = category.name;
            categoryItem.classList.add('category-item');
            categoryItem.addEventListener('click', () => {
                currentCategoryId = category.id; // Set current category ID
                currentPage = 1; // Reset to the first page
                fetchBlogsByCategory(category.id);
            });
            categoryListContainer.appendChild(categoryItem);
        });
    }

    // Function to fetch blogs by category
    function fetchBlogsByCategory(categoryId, page = 1) {
        fetch(`http://127.0.0.1:8000/api/cat/${categoryId}/blogs/?page=${page}`)
            .then(response => response.json())
            .then(data => {
                displayBlogs(data.results); // Display the current page's blogs
                updatePaginationControls(data.next, data.previous); // Update pagination buttons
                currentPageIndicator.textContent = `Page ${page}`; // Update current page indicator
            })
            .catch(error => console.error('Error fetching blogs by category:', error));
    }

    // Function to fetch all blogs
    function fetchAllBlogs(page = 1) {
        currentCategoryId = null; // Reset category ID
        fetch(`http://127.0.0.1:8000/api/blogs/?page=${page}`)
            .then(response => response.json())
            .then(data => {
                displayBlogs(data.results); // Display the current page's blogs
                updatePaginationControls(data.next, data.previous); // Update pagination buttons
                currentPageIndicator.textContent = `Page ${page}`; // Update current page indicator
            })
            .catch(error => console.error('Error fetching all blogs:', error));
    }

    // Function to display blogs dynamically
    function displayBlogs(blogs) {
        blogsContainer.innerHTML = ''; // Clear existing blogs
        blogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.classList.add('blog-card');

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
                        ${blog.tags.map(tag => `<span class="blog-tag">${tag.name}</span>`).join('')}
                    </div>
                    <div class="blog-reactions">
                        <span class="good-reactions">Good reactions: ${blog.good_reactions_count}</span>
                        <span class="bad-reactions">Bad reactions: ${blog.bad_reactions_count}</span>
                    </div>
                    <span class="views-count">Views: ${blog.views_count}</span>
                </div>
            `;

            blogsContainer.appendChild(blogCard);
        });
    }

    // Function to update pagination controls
    function updatePaginationControls(next, previous) {
        prevButton.disabled = !previous;
        nextButton.disabled = !next;

        prevButton.onclick = () => {
            if (previous) {
                const prevPage = new URL(previous).searchParams.get('page');
                currentPage = parseInt(prevPage, 10);
                if (currentCategoryId) {
                    fetchBlogsByCategory(currentCategoryId, currentPage);
                } else {
                    fetchAllBlogs(currentPage);
                }
            }
        };

        nextButton.onclick = () => {
            if (next) {
                const nextPage = new URL(next).searchParams.get('page');
                currentPage = parseInt(nextPage, 10);
                if (currentCategoryId) {
                    fetchBlogsByCategory(currentCategoryId, currentPage);
                } else {
                    fetchAllBlogs(currentPage);
                }
            }
        };
    }

    // Initial fetch of all blogs when the page loads
    fetchAllBlogs();
});
