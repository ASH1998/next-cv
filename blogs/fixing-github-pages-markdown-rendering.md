---
title: "Fixing GitHub Pages Markdown Rendering Issues"
date: "2025-07-06"
tags: ["GitHub Pages", "JavaScript", "Markdown", "Web Development", "Debugging"]
excerpt: "A comprehensive guide to troubleshooting and fixing markdown rendering issues when deploying a static blog to GitHub Pages."
---

# Fixing GitHub Pages Markdown Rendering Issues

When deploying a static blog site to GitHub Pages, you might encounter issues where markdown content renders perfectly locally but fails to display on the deployed site. This post documents the common causes and solutions for this problem.

## The Problem

The blog system was working perfectly in local development but failing on GitHub Pages deployment. The symptoms included:

- Blog posts not loading or displaying blank content
- JavaScript fetch requests failing silently
- Markdown not being parsed into HTML
- CORS-related errors in browser console

## Root Causes

### 1. Path Resolution Issues

GitHub Pages serves content from a subdirectory when using a project repository (e.g., `username.github.io/repository-name`). This causes relative paths to break.

**Local:** `blogs/index.json` → Works
**GitHub Pages:** `blogs/index.json` → Fails (should be `/repository-name/blogs/index.json`)

### 2. Static File Serving

GitHub Pages has specific rules about serving static files, and sometimes markdown files might not be served correctly without proper configuration.

### 3. CDN Loading Issues

External CDN resources (like marked.js) might fail to load or load after the JavaScript tries to use them.

## Solutions Implemented

### 1. Dynamic Path Resolution

Created a helper function to detect GitHub Pages deployment and adjust paths accordingly:

```javascript
// Helper function to get the correct resource URL
function getResourceUrl(relativePath) {
    // Check if we're running on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        // Get the repository name from the path
        const pathParts = window.location.pathname.split('/');
        const repoName = pathParts[1];
        
        // If we have a repository name and it's not the root, prepend it
        if (repoName && repoName !== '' && !relativePath.startsWith('/')) {
            return `/${repoName}/${relativePath}`;
        }
    }
    
    // For local development or if path is already absolute
    return relativePath;
}
```

### 2. Enhanced Error Handling

Added comprehensive error handling and debugging information:

```javascript
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
```

### 3. Improved Frontmatter Removal

Enhanced the frontmatter removal function to be more robust:

```javascript
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
```

### 4. GitHub Pages Configuration

#### Created `.nojekyll` file
This tells GitHub Pages not to process the site with Jekyll, which is important for vanilla HTML/CSS/JS sites.

#### Added `_config.yml`
```yaml
# GitHub Pages configuration
include:
  - "_*"
  - "*.md"
  - "blogs/*.md"

exclude:
  - "README.md"
  - "CLAUDE.md"
  - "CLAUDE.local.md"

plugins:
  - jekyll-relative-links

markdown: kramdown
relative_links:
  enabled: true
  collections: false
```

#### Created GitHub Actions Workflow
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ "main", "master" ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5. Library Availability Check

Added checks to ensure required libraries are loaded:

```javascript
// Check if marked.js is available
if (typeof marked === 'undefined') {
    throw new Error('Marked.js library is not loaded. Please check your internet connection.');
}
```

### 6. Test Page for Debugging

Created a comprehensive test page (`test-blog.html`) to help diagnose issues:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blog Test</title>
    <script src="https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js"></script>
</head>
<body>
    <div id="test-results"></div>
    <div id="debug-info"></div>
    <div id="blog-index-test"></div>
    <div id="markdown-test"></div>
    
    <script>
        // Test all blog functionality
        async function runTests() {
            // Test marked.js loading
            // Test blog index fetching
            // Test markdown file fetching and parsing
        }
    </script>
</body>
</html>
```

## Debugging Steps

1. **Check Browser Console**: Look for fetch errors, CORS issues, or JavaScript errors
2. **Verify File Paths**: Ensure all resource paths are correct for GitHub Pages
3. **Test CDN Resources**: Confirm external libraries are loading properly
4. **Use Debug Test Page**: Create a simple test page to isolate issues
5. **Check Network Tab**: Monitor failed network requests

## Best Practices

1. **Always use relative paths** that work in both local and deployed environments
2. **Implement proper error handling** with descriptive error messages
3. **Add debugging information** to help troubleshoot issues
4. **Test thoroughly** in both local and production environments
5. **Use GitHub Actions** for consistent deployment
6. **Configure GitHub Pages properly** with `.nojekyll` and `_config.yml`

## Conclusion

GitHub Pages deployment issues are common but solvable. The key is to:
- Understand how GitHub Pages serves files
- Implement dynamic path resolution
- Add comprehensive error handling
- Test thoroughly in both environments

With these fixes, your markdown blog should work seamlessly on both local development and GitHub Pages deployment.

## Related Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Marked.js Documentation](https://marked.js.org/)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
