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
        const indexResponse = await fetch('blogs/index.json');
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
        const contentResponse = await fetch(`blogs/${filename}`);
        const markdownContent = await contentResponse.text();

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
        blogPostTitle.textContent = 'Error Loading Blog Post';
        blogPostBody.innerHTML = `<p>Sorry, there was an error loading the blog post. Please try again later.</p>`;
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
    if (content.startsWith('---')) {
        const endIndex = content.indexOf('---', 3);
        if (endIndex !== -1) {
            return content.substring(endIndex + 3).trim();
        }
    }
    return content;
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
