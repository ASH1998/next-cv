// Helper function to get the correct resource URL
function getResourceUrl(relativePath) {
    // Check if we're running on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        // Get the repository name from the path
        const pathParts = window.location.pathname.split('/');
        const repoName = pathParts[1]; // Assuming the repo name is the first part of the path
        
        // If we have a repository name and it's not the root, prepend it
        if (repoName && repoName !== '' && !relativePath.startsWith('/')) {
            return `/${repoName}/${relativePath}`;
        }
    }
    
    // For local development or if path is already absolute
    return relativePath;
}

// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogs();
});

async function initializeBlogs() {
    const blogsGrid = document.getElementById('blogs-grid');

    try {
        // Load blog index
        const indexUrl = getResourceUrl('blogs/index.json');
        console.log('Fetching blog index from:', indexUrl);
        const response = await fetch(indexUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch blog index: ${response.status} ${response.statusText}`);
        }
        
        const blogPosts = await response.json();
        console.log('Blog posts loaded successfully:', blogPosts.length);

        // Clear loading state
        blogsGrid.innerHTML = '';

        // Sort posts by date (newest first)
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Create blog cards
        blogPosts.forEach(post => {
            const blogCard = createBlogCard(post);
            blogsGrid.appendChild(blogCard);
        });

    } catch (error) {
        console.error('Error loading blog posts:', error);
        console.error('Current URL:', window.location.href);
        console.error('Current origin:', window.location.origin);
        console.error('Current pathname:', window.location.pathname);
        
        blogsGrid.innerHTML = `
            <div class="blog-error">
                <h3>Error loading blog posts</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p><strong>Debug Information:</strong></p>
                <ul>
                    <li>Current URL: ${window.location.href}</li>
                    <li>Origin: ${window.location.origin}</li>
                    <li>Pathname: ${window.location.pathname}</li>
                </ul>
                <p>Please try refreshing the page or check the browser console for more details.</p>
            </div>
        `;
    }

    function createBlogCard(post) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('data-filename', post.filename);

        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tagsHtml = post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('');

        card.innerHTML = `
            <div class="blog-card-header">
                <h3 class="blog-card-title">${post.title}</h3>
                <div class="blog-card-meta">
                    <span class="blog-card-date">${formattedDate}</span>
                    <div class="blog-card-tags">${tagsHtml}</div>
                </div>
            </div>
            <div class="blog-card-body">
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <a href="blog-post.html?post=${post.filename}" class="blog-read-more">Read More</a>
            </div>
        `;

        // Add click event to navigate to blog post
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on the read more link (it has its own href)
            if (e.target.classList.contains('blog-read-more')) {
                return;
            }
            e.preventDefault();
            window.location.href = `blog-post.html?post=${post.filename}`;
        });

        return card;
    }
}

// Additional utility functions for blog functionality
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Configure marked.js options
if (typeof marked !== 'undefined') {
    marked.setOptions({
        highlight: function(code, lang) {
            // If Prism is available, use it for syntax highlighting
            if (typeof Prism !== 'undefined' && lang && Prism.languages[lang]) {
                return Prism.highlight(code, Prism.languages[lang], lang);
            }
            return code;
        },
        breaks: true,
        gfm: true
    });
}
