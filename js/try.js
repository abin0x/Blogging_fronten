document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.getElementById("blog-container");
    const categoriesList = document.getElementById("categories-list");
    const recentPostsList = document.getElementById("recent-posts");

    // Get the blog ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id'); // Assumes the URL is something like blog.html?id=2

    const blogApiUrl = `http://127.0.0.1:8000/api/blogs/${blogId}/`; // Blog details API with dynamic blog ID
    const categoriesApiUrl = "http://127.0.0.1:8000/api/categories/"; // Categories API
    const categoryBlogsApiUrl = "http://127.0.0.1:8000/api/cat/"; // Blogs by category API

    // Fetch and display blog details
    const fetchBlogDetails = () => {
        fetch(blogApiUrl)
            .then(response => response.json())
            .then(blog => {
                const { title, content, featured_image, category } = blog;

                blogContainer.innerHTML = `
                    <img src="${featured_image}" alt="Blog Image" class="blog-img">
                    <h2>${title}</h2>
                    <p>${content}</p>
                `;

                // Fetch related blogs by category
                fetchBlogsByCategory(category.id);
            })
            .catch(error => {
                console.error("Error fetching blog details:", error);
                blogContainer.innerHTML = `<p>Error loading blog details.</p>`;
            });
    };

    // Fetch and display categories
    const fetchCategories = () => {
        fetch(categoriesApiUrl)
            .then(response => response.json())
            .then(categories => {
                categoriesList.innerHTML = categories
                    .map(category => `
                        <li>
                            <a href="#" class="category-link" data-category-id="${category.id}">
                                ${category.name}
                            </a>
                        </li>
                    `)
                    .join("");

                // Attach click event listeners to category links
                document.querySelectorAll(".category-link").forEach(link => {
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        const categoryId = e.target.getAttribute("data-category-id");
                        fetchBlogsByCategory(categoryId);
                    });
                });
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
                categoriesList.innerHTML = `<p>Error loading categories.</p>`;
            });
    };

    // Fetch and display blogs by category
    const fetchBlogsByCategory = (categoryId) => {
        fetch(`${categoryBlogsApiUrl}${categoryId}/blogs/`)
            .then(response => response.json())
            .then(blogs => {
                recentPostsList.innerHTML = blogs
                    .map(blog => `
                        <a href="try.html?id=${blog.id}" class="recent-post-item">
                            <img src="${blog.featured_image}" alt="${blog.title}" class="recent-post-img">
                            <div class="recent-post-info">
                                <h4>${blog.title}</h4>
                                <p>Views: ${blog.views_count} | 👍 ${blog.good_reactions_count} | 👎 ${blog.bad_reactions_count}</p>
                            </div>
                        </a>
                    `)
                    .join("");
            })
            .catch(error => {
                console.error(`Error fetching blogs for category ${categoryId}:`, error);
                recentPostsList.innerHTML = `<p>Error loading category blogs.</p>`;
            });
    };

    // Initial data fetch
    fetchBlogDetails(); // Display the main blog
    fetchCategories(); // Load all categories
});
