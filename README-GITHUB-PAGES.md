# AddiFix Website - GitHub Pages Deployment

This is the static version of the AddiFix website optimized for GitHub Pages hosting.

## 🚀 Live Website

Visit the live website at: **https://taz2419.github.io/WebsiteAddifix**

## 📁 Main Files for GitHub Pages

- `index.html` - Main landing page
- `contact.html` - Contact form page
- `styles.css` - Website styling
- `script.js` - JavaScript functionality (static version)
- `bg_images/` - Background images folder

## 🎯 Features (GitHub Pages Version)

- ✅ **Fully Static** - Works without server
- ✅ **Responsive Design** - Mobile and desktop friendly
- ✅ **Visitor Counter** - Simulated using localStorage
- ✅ **Contact Form** - Stores submissions locally
- ✅ **Newsletter Signup** - Email collection with validation
- ✅ **Fast Loading** - Optimized for GitHub Pages CDN

## 🔧 GitHub Pages Setup Instructions

### 1. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" (or "master") branch
6. Select "/ (root)" folder
7. Click "Save"

### 2. Access Your Website
- Your site will be available at: `https://taz2419.github.io/WebsiteAddifix`
- It may take a few minutes for changes to appear

### 3. Custom Domain (Optional)
If you have a custom domain:
1. Add a `CNAME` file with your domain name
2. Configure DNS with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

## 📊 How It Works (Static Version)

### Visitor Counter
- Uses browser localStorage to simulate visitor tracking
- Numbers increment realistically on page visits
- Data persists across browser sessions

### Contact Form
- Validates form fields client-side
- Stores submissions in localStorage
- Shows success messages to users
- For production, integrate with services like Formspree or Netlify Forms

### Newsletter Signup
- Email validation and duplicate checking
- Stores emails locally for demo purposes
- For production, integrate with email services like Mailchimp or ConvertKit

## 🔄 Updating the Website

1. Make changes to your files locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update website"
   git push origin main
   ```
3. Changes will appear on GitHub Pages within minutes

## 📈 Production Enhancements

For a production website, consider integrating:

- **Form Handling**: Formspree, Netlify Forms, or Google Forms
- **Email Marketing**: Mailchimp, ConvertKit, or EmailJS
- **Analytics**: Google Analytics or Plausible
- **Real Visitor Tracking**: Google Analytics or Simple Analytics

## 🎨 Customization

- Edit `styles.css` for design changes
- Modify `script.js` for functionality updates
- Update images in `bg_images/` folder
- Change text content in HTML files

## 🌟 Performance

This static version is optimized for:
- Fast loading times
- SEO-friendly structure
- Mobile responsiveness
- GitHub Pages CDN delivery
