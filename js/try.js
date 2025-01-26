document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.getElementById("blog-container");
    const categoriesList = document.getElementById("categories-list");
    const recentPostsList = document.getElementById("recent-posts");
    const downloadPdfButton = document.getElementById("download-pdf");

    // Ensure the necessary DOM elements are present
    if (!blogContainer || !categoriesList || !recentPostsList) {
        console.error("Necessary DOM elements are missing.");
        return;
    }

    // Get the blog ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("id");

    if (!blogId) {
        console.error("Blog ID is missing in the URL.");
        return;
    }

    const blogApiUrl = `http://127.0.0.1:8000/api/blogs/${blogId}/`;
    const categoriesApiUrl = "http://127.0.0.1:8000/api/categories/";
    const categoryBlogsApiUrl = "http://127.0.0.1:8000/api/cat/";

    // Fetch and display blog details
    const fetchBlogDetails = () => {
        fetch(blogApiUrl)
            .then(response => response.json())
            .then(blog => {
                const {
                    title,
                    content,
                    featured_image,
                    category,
                    author,
                    created_at,
                    reading_time,
                    views_count,
                    good_reactions_count,
                    bad_reactions_count,
                    related_blogs
                } = blog;

                blogContainer.innerHTML = `
                    <img src="${featured_image}" alt="Blog Image" class="blog-img">
                    <div class="blog-meta-top">
                        <h2 class="blog-title">${title}</h2>
                        <div class="blog-meta-row">
                            <span class="blog-author">Author: ${author}</span>
                            <span class="blog-date">Published: ${created_at}</span>
                            <span class="blog-read-time">Read Time: ${reading_time} mins</span>
                        </div>
                    </div>
                    <div class="blog-meta-bottom">
                        <span class="blog-category">Category: ${category.name}</span>
                        <button id="download-pdf" class="blog-action-btn">📄 Download PDF</button>
                        <button id="copy-link" class="blog-action-btn">🔗 Copy Link</button>
                        <span class="blog-views">Views: ${views_count}</span>
                        <div class="reaction-buttons">
                            <button id="good-reaction" class="reaction-btn">👍 ${good_reactions_count}</button>
                            <button id="bad-reaction" class="reaction-btn">👎 ${bad_reactions_count}</button>
                        </div>
                    </div>
                    <p class="blog-content">${content}</p>
                `;

                // Event listener for Download PDF button
                document.getElementById("download-pdf").addEventListener("click", () => {
                    downloadPdf(blogId);
                });

                // Event listener for Copy Link button
                document.getElementById("copy-link").addEventListener("click", () => {
                    navigator.clipboard.writeText(window.location.href)
                        .then(() => alert("Blog link copied to clipboard!"))
                        .catch(err => console.error("Failed to copy link:", err));
                });

                // Event listeners for Reactions
                document.getElementById("good-reaction").addEventListener("click", () => {
                    handleReaction('good');
                });

                document.getElementById("bad-reaction").addEventListener("click", () => {
                    handleReaction('bad');
                });

                // Display related blogs in the recent posts section
                displayRelatedBlogs(related_blogs);
            })
            .catch(error => {
                console.error("Error fetching blog details:", error);
                blogContainer.innerHTML = `<p>Error loading blog details.</p>`;
            });
    };

    // Handle reactions (good or bad)
    const handleReaction = (reactionType) => {
        const reactionApiUrl = `http://127.0.0.1:8000/api/blogs/${blogId}/react/`;
        const reactionData = { reaction_type: reactionType };

        fetch(reactionApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(reactionData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`You reacted with ${reactionType}`);
                fetchBlogDetails(); // Refresh blog details to update the reaction count
            } else {
                alert('Failed to react. Please try again.');
            }
        })
        .catch(error => {
            console.error("Error reacting to blog:", error);
            alert('Error reacting to blog. Please try again.');
        });
    };

    // Fetch categories for filtering
    const fetchCategories = () => {
        fetch(categoriesApiUrl)
            .then(response => response.json())
            .then(categories => {
                categoriesList.innerHTML = categories
                    .map(category => `
                        <li>
                            <a href="category.html" class="category-link" data-category-id="${category.id}">
                                ${category.name}
                            </a>
                        </li>
                    `)
                    .join("");

                document.querySelectorAll(".category-link").forEach(link => {
                    link.addEventListener("click", e => {
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

    // Display related blogs in the recent posts section
    const displayRelatedBlogs = (relatedBlogs) => {
        if (Array.isArray(relatedBlogs) && relatedBlogs.length > 0) {
            recentPostsList.innerHTML = relatedBlogs
                .map(blog => `
                    <a href="blog_details.html?id=${blog.id}" class="recent-post-item">
                        <img src="${blog.featured_image}" alt="${blog.title}" class="recent-post-img">
                        <div class="recent-post-info">
                            <h4>${blog.title}</h4>
                            <p>Views: ${blog.views_count} | 👍 ${blog.good_reactions_count} | 👎 ${blog.bad_reactions_count}</p>
                        </div>
                    </a>
                `)
                .join("");
        } else {
            recentPostsList.innerHTML = `<p>No related blogs found.</p>`;
        }
    };

    // Function to trigger PDF download using html2pdf
    const downloadPdf = (blogId) => {
        const element = document.getElementById("blog-container");

        // Use html2pdf to generate PDF
        html2pdf()
            .from(element)  // Target the section to be converted to PDF
            .toPdf()
            .get('pdf')
            .then(function (pdf) {
                pdf.save(`blog_${blogId}.pdf`);  // Set the filename for the downloaded PDF
            })
            .catch(function (error) {
                console.error("Error generating PDF:", error);
                alert("Error generating PDF. Please try again.");
            });
    };

    // Call the functions to fetch blog details and categories
    fetchBlogDetails();
    fetchCategories();
});
