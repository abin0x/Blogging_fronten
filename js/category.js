// document.addEventListener("DOMContentLoaded", function () {
//     const categoryListContainer = document.getElementById("categoryListContainer");
//     const blogsContainer = document.getElementById("blogsContainer");
//     const prevButton = document.getElementById("prevPage");
//     const nextButton = document.getElementById("nextPage");
//     const currentPageIndicator = document.getElementById("currentPage");

//     let currentCategoryId = null;
//     let currentPage = 1;
//     const API_BASE_URL = "http://127.0.0.1:8000/api";

//     fetchCategories();
//     fetchAllBlogs();

//     function fetchCategories() {
//         fetch(`${API_BASE_URL}/categories/`)
//             .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch categories'))
//             .then(categories => displayCategories(categories))
//             .catch(error => console.error("Error fetching categories:", error));
//     }

//     function displayCategories(categories) {
//         categoryListContainer.innerHTML = "";
//         const allCategoriesItem = createCategoryItem("All Categories", null);
//         categoryListContainer.appendChild(allCategoriesItem);
//         categories.forEach(category => {
//             const categoryItem = createCategoryItem(category.name, category.id);
//             categoryListContainer.appendChild(categoryItem);
//         });
//     }

//     function createCategoryItem(name, id) {
//         const categoryItem = document.createElement("li");
//         categoryItem.textContent = name;
//         categoryItem.classList.add("category-item");
//         categoryItem.addEventListener("click", () => {
//             currentCategoryId = id;
//             currentPage = 1;
//             id ? fetchBlogsByCategory(id) : fetchAllBlogs();
//         });
//         return categoryItem;
//     }

//     function fetchBlogsByCategory(categoryId, page = 1) {
//         fetch(`${API_BASE_URL}/cat/${categoryId}/blogs/?page=${page}`)
//             .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch blogs by category'))
//             .then(data => handleBlogsResponse(data, page))
//             .catch(error => console.error("Error fetching blogs by category:", error));
//     }

//     function fetchAllBlogs(page = 1) {
//         fetch(`${API_BASE_URL}/blogs/?page=${page}`)
//             .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch blogs'))
//             .then(data => handleBlogsResponse(data, page))
//             .catch(error => console.error("Error fetching all blogs:", error));
//     }

//     function handleBlogsResponse(data, page) {
//         displayBlogs(data.results);
//         updatePaginationControls(data.next, data.previous);
//         currentPageIndicator.textContent = `Page ${page}`;
//     }

//     function displayBlogs(blogs) {
//         blogsContainer.innerHTML = "";
//         if (blogs.length === 0) {
//             blogsContainer.innerHTML = "<p>No blogs found.</p>";
//             return;
//         }
//         blogs.forEach(blog => blogsContainer.appendChild(createBlogCard(blog)));
//     }

//     function convertToBengaliNumber(number) {
//         const englishToBengaliDigits = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
//         return number.toString().split("").map(digit => englishToBengaliDigits[digit] || digit).join("");
//     }

//     function formatCreatedDate(createdAt) {
//         const regex = /^(\d{1,2}) (\w+), (\d{4}) - (\d{1,2}):(\d{2})(AM|PM)$/;
//         const match = createdAt.match(regex);
//         if (!match) return "অজ্ঞাত তারিখ";

//         const bengaliMonths = { "January": "জানুয়ারি", "February": "ফেব্রুয়ারি", "March": "মার্চ", "April": "এপ্রিল", "May": "মে", "June": "জুন", "July": "জুলাই", "August": "আগস্ট", "September": "সেপ্টেম্বর", "October": "অক্টোবর", "November": "নভেম্বর", "December": "ডিসেম্বর" };

//         let hourIn24 = parseInt(match[4]);
//         if (match[6] === "PM" && hourIn24 < 12) hourIn24 += 12;
//         else if (match[6] === "AM" && hourIn24 === 12) hourIn24 = 0;

//         return `${convertToBengaliNumber(match[1])} ${bengaliMonths[match[2]] || match[2]}, ${convertToBengaliNumber(match[3])}`;
//     }

//     function createBlogCard(blog) {
//         const blogCard = document.createElement("div");
//         blogCard.classList.add("blog-card");

//         const imageUrl = blog.featured_image || "https://via.placeholder.com/150";
//         const bengaliFormattedDate = formatCreatedDate(blog.created_at);
//         const contentExcerpt = blog.content.length > 150 ? `${blog.content.slice(0, 100)}...` : blog.content;

//         blogCard.innerHTML = `
//             <h3 class="blog-title">${blog.title}</h3>
//             <img src="${imageUrl}" alt="Blog Image" class="blog-image">
//             <div class="blog-content">
//                 <p class="fas fa-user-edit"> ${blog.author}</p>
//                 <p class="fas fa-clipboard-list"> ${blog.category.name}</p>
//                 <p class="blog-content-preview">${contentExcerpt}</p>
//                 <div class="blog-meta-row">
//                     <span class="fas fa-calendar-check">${bengaliFormattedDate}</span>
//                     <span class="fas fa-eye">${blog.views_count} বার</span>
//                     <span class="fas fa-hourglass">${blog.reading_time} min Read</span>
//                 </div>
//                 <hr>
//                 <div class="blog-actions">
//                     <button class="read-more-button">আরও পড়ুন</button>
//                     <div class="reaction-icons">
//                         <span class="fas fa-thumbs-up"> ${blog.good_reactions_count}</span>
//                         <span class="fas fa-thumbs-down"> ${blog.bad_reactions_count}</span>
//                     </div>
//                 </div>
//             </div>
//         `;

//         blogCard.querySelector(".read-more-button").addEventListener("click", () => {
//             window.location.href = `blog_details.html?id=${blog.id}`;
//         });

//         return blogCard;
//     }

//     function updatePaginationControls(next, previous) {
//         prevButton.disabled = !previous;
//         nextButton.disabled = !next;

//         prevButton.onclick = () => {
//             if (previous) {
//                 const prevPage = getPageFromUrl(previous) || 1;
//                 currentPage = parseInt(prevPage, 10);
//                 fetchBlogs();
//             }
//         };

//         nextButton.onclick = () => {
//             if (next) {
//                 const nextPage = getPageFromUrl(next);
//                 if (nextPage) {
//                     currentPage = parseInt(nextPage, 10);
//                     fetchBlogs();
//                 } else {
//                     console.error("Invalid next page URL:", next);
//                 }
//             }
//         };
//     }

//     function getPageFromUrl(url) {
//         try {
//             const urlObj = new URL(url, window.location.origin);
//             return urlObj.searchParams.get("page");
//         } catch (error) {
//             console.error("Failed to parse URL:", url, error);
//             return null;
//         }
//     }

//     function fetchBlogs() {
//         currentCategoryId ? fetchBlogsByCategory(currentCategoryId, currentPage) : fetchAllBlogs(currentPage);
//     }
// });
