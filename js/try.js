document.addEventListener('DOMContentLoaded', function () {
    const categorySelect = document.getElementById('categorySelect');
    const blogsContainer = document.getElementById('blogsContainer');

    // Fetch Categories
    fetch('http://127.0.0.1:8000/api/categories/')
        .then(response => response.json())
        .then(data => {
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));

    // Fetch Blogs based on category selection
    categorySelect.addEventListener('change', function (e) {
        const categoryId = e.target.value;
        if (categoryId) {
            fetchBlogsByCategory(categoryId);
        } else {
            fetchAllBlogs();
        }
    });

    // Function to fetch blogs based on category
    function fetchBlogsByCategory(categoryId) {
        fetch(`http://127.0.0.1:8000/api/cat/${categoryId}/blogs/`)
            .then(response => response.json())
            .then(blogs => {
                displayBlogs(blogs);
            })
            .catch(error => console.error('Error fetching blogs by category:', error));
    }

    // Function to fetch all blogs
    function fetchAllBlogs() {
        fetch('http://127.0.0.1:8000/api/blogs/')
            .then(response => response.json())
            .then(blogs => {
                displayBlogs(blogs);
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

    // Initial fetch of all blogs when the page loads
    fetchAllBlogs();
});
