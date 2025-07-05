# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern, sleek portfolio website for Ashutosh Mishra. This is a static site built with vanilla HTML, CSS, and JavaScript focusing on modern aesthetics and clean design. The site will be deployed via GitHub Pages and redirect to ashutoshmishra.dev (hosted on Squarespace).

## Development Commands

### Local Development
```bash
# Start local development server
python -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000
```

### Build & Deployment
```bash
# No build process needed - static files ready for deployment
# Deploy to GitHub Pages via git push to main branch
git add .
git commit -m "Update portfolio site"
git push origin main
```

## Architecture

### Project Structure
```
/
├── index.html          # Main portfolio page
├── styles/
│   ├── main.css       # Main stylesheet
│   ├── responsive.css # Mobile/tablet styles
│   └── components.css # Component-specific styles
├── scripts/
│   ├── main.js        # Main JavaScript functionality
│   └── animations.js  # Animation and interaction scripts
├── assets/
│   ├── images/        # Portfolio images and photos
│   ├── icons/         # SVG icons and graphics
│   └── fonts/         # Custom fonts if needed
└── README.md
```

### Modern CSS Practices
- Use CSS Grid and Flexbox for layout
- CSS custom properties (variables) for theming
- Mobile-first responsive design
- Modern CSS features (clamp, min/max, aspect-ratio)
- Semantic HTML5 elements

### JavaScript Approach
- Vanilla ES6+ JavaScript
- Modular code organization
- Smooth animations and transitions
- Progressive enhancement
- Accessibility considerations

## GitHub Pages Configuration

### Domain Setup
- Repository should be configured for GitHub Pages
- Custom domain: ashutoshmishra.dev
- CNAME file should contain: ashutoshmishra.dev

### Deployment
- Automatic deployment on push to main branch
- Static files served directly from repository root
- No build process required

## Performance Optimization

### Best Practices
- Optimize images (WebP format when possible)
- Minify CSS and JavaScript for production
- Use efficient fonts and minimize font loading
- Implement lazy loading for images
- Compress assets and enable gzip
- Use semantic HTML for better SEO

## Design Principles

### Modern Aesthetics
- Clean, minimalist design
- Consistent spacing and typography
- Smooth animations and micro-interactions
- Professional color scheme
- High contrast for accessibility
- Responsive across all devices

### Content Strategy
- Showcase projects with clear descriptions
- Professional bio and skills section
- Contact information and social links
- Resume/CV download option
- Project filtering and search capabilities