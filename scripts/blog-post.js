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

// Blog post functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogPost();
});

async function initializeBlogPost() {
    const blogPostTitle = document.getElementById('blog-post-title');
    const blogPostDate = document.getElementById('blog-post-date');
    const blogPostTags = document.getElementById('blog-post-tags');
    const blogPostBody = document.getElementById('blog-post-body');
    const pageTitle = document.getElementById('blog-title');

    try {
        // Get blog filename from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const filename = urlParams.get('post');

        if (!filename) {
            throw new Error('No blog post specified');
        }

        // Load blog index to get metadata
        const indexUrl = getResourceUrl('blogs/index.json');
        console.log('Fetching blog index from:', indexUrl);
        const indexResponse = await fetch(indexUrl);
        
        if (!indexResponse.ok) {
            throw new Error(`Failed to fetch blog index: ${indexResponse.status} ${indexResponse.statusText}`);
        }
        
        const blogPosts = await indexResponse.json();

        // Find the blog post metadata
        const blogPost = blogPosts.find(post => post.filename === filename);

        if (!blogPost) {
            throw new Error('Blog post not found');
        }

        // Update page title and meta
        const formattedDate = new Date(blogPost.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        pageTitle.textContent = `${blogPost.title} - Ashutosh Mishra`;
        blogPostTitle.textContent = blogPost.title;
        blogPostDate.textContent = formattedDate;
        blogPostTags.innerHTML = blogPost.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('');

        // Load and display markdown content
        const contentUrl = getResourceUrl(`blogs/${filename}`);
        console.log('Fetching markdown content from:', contentUrl);
        const contentResponse = await fetch(contentUrl);
        
        if (!contentResponse.ok) {
            throw new Error(`Failed to fetch content: ${contentResponse.status} ${contentResponse.statusText}`);
        }
        
        const markdownContent = await contentResponse.text();
        console.log('Markdown content loaded successfully');

        // Check if marked.js is available
        if (typeof marked === 'undefined') {
            throw new Error('Marked.js library is not loaded. Please check your internet connection.');
        }

        // Remove frontmatter (if present)
        const contentWithoutFrontmatter = removeFrontmatter(markdownContent);

        // Parse markdown to HTML
        const htmlContent = marked.parse(contentWithoutFrontmatter);

        // Update blog content
        blogPostBody.innerHTML = htmlContent;

        // Add copy buttons to all code blocks
        addCopyButtons();

        // Initialize syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
            // Re-add copy buttons after Prism highlighting (in case structure changed)
            setTimeout(() => addCopyButtons(), 100);
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
        console.error('Current URL:', window.location.href);
        console.error('Current origin:', window.location.origin);
        console.error('Current pathname:', window.location.pathname);
        
        blogPostTitle.textContent = 'Error Loading Blog Post';
        blogPostBody.innerHTML = `
            <div class="blog-error">
                <h3>Sorry, there was an error loading the blog post.</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p><strong>Debug Information:</strong></p>
                <ul>
                    <li>Current URL: ${window.location.href}</li>
                    <li>Origin: ${window.location.origin}</li>
                    <li>Pathname: ${window.location.pathname}</li>
                    <li>Requested file: ${filename || 'Not specified'}</li>
                </ul>
                <p>Please try refreshing the page or <a href="blogs.html">go back to the blog list</a>.</p>
            </div>
        `;
    }
}

function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.blog-post-body pre');
    
    codeBlocks.forEach(block => {
        // Check if copy button already exists
        if (block.querySelector('.copy-button')) {
            return;
        }
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Add click event listener
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code');
            if (code) {
                const text = code.textContent;
                
                // Copy to clipboard
                navigator.clipboard.writeText(text).then(() => {
                    // Show success feedback
                    copyButton.textContent = 'Copied!';
                    copyButton.classList.add('copied');
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                        copyButton.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    copyButton.textContent = 'Failed';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                });
            }
        });
        
        // Add button to code block
        block.appendChild(copyButton);
    });
}

function removeFrontmatter(content) {
    // Remove YAML frontmatter if present
    if (content.trim().startsWith('---')) {
        const lines = content.split('\n');
        let endIndex = -1;
        
        // Find the closing ---
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
                endIndex = i;
                break;
            }
        }
        
        if (endIndex !== -1) {
            // Return content after the closing ---
            return lines.slice(endIndex + 1).join('\n').trim();
        }
    }
    return content.trim();
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
        gfm: true,
        headerIds: true,
        mangle: false
    });
}
