# Ntando Store Website - Professional Digital Services

A modern, responsive website for Ntando Store offering website design, digital services, and business solutions. This website is fully deployable on Render.com and includes an admin panel for content management.

## 🚀 Features

- **Professional Design**: Modern, responsive layout with smooth animations
- **Service Showcase**: Detailed pricing and service descriptions
- **Admin Panel**: Full content management system
  - Username: `Ntando`
  - Password: `Ntando`
- **Interactive Elements**: Background music, promo slider, contact forms
- **Mobile Responsive**: Works perfectly on all devices
- **SEO Optimized**: Clean HTML5 structure with semantic tags

## 📋 Services Offered

### Website Packages
- **Basic Website**: $50 (one-time) or $10/month for 5 months
- **Premium Website**: $80 (one-time) with advanced features

### Additional Services
- **Business Cards & Logos**: Starting at $10
- **Business Email Services**: $15-$25 per email
- **Premium Apps & Foreign Numbers**: $20/month
- **Business Domains**: $30/month (.nett.to, .zone.id)

## 💳 Payment Information
All payments are processed via EcoCash:
- **EcoCash Number**: +263 786 831 091

## 🛠️ Tech Stack
- HTML5
- CSS3 with modern animations
- Vanilla JavaScript
- Responsive Design
- Static Site Hosting

## 🚀 Deployment on Render.com

### Option 1: Quick Deploy (Recommended)
1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ntandostore.git
   git push -u origin main
   ```

2. **Deploy to Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the repository
   - Use these settings:
     - **Build Command**: `echo 'Static site - no build required'`
     - **Publish Directory**: `.`
     - **Node Version**: `14.x`

### Option 2: Manual Setup
1. **Sign up** at [render.com](https://render.com)
2. **Create a new Web Service**
3. **Choose "Static Site"** as the service type
4. **Connect your Git repository**
5. **Configure build settings**:
   - Build Command: `echo 'Static site - no build required'`
   - Start Command: `python -m http.server 10000`
   - Publish Directory: `.`
   - Root Directory: `.`

### Environment Variables (Optional)
No environment variables are required for this static website.

## 🔧 Local Development

### Prerequisites
- Python 3.9+ or Node.js 14+
- Git

### Running Locally
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ntandostore.git
   cd ntandostore
   ```

2. **Start local server**:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Or using Node.js
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8080`

## 🎨 Customization

### Admin Panel Access
1. Navigate to the website
2. Click "Admin" in the navigation
3. Enter credentials:
   - **Username**: `Ntando`
   - **Password**: `Ntando`

### Available Admin Features
- **Content Management**: Edit hero section text
- **Promotion Management**: Update promotional banners
- **Media Management**: Change logo and background music
- **Site Updates**: Refresh website with latest changes

### Branding Customization
Edit the following files:
- `styles.css`: Modify colors, fonts, and layout
- `index.html`: Update content and structure
- `script.js`: Adjust interactive features

### Color Scheme
Primary colors are defined in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #f59e0b;
    --text-dark: #1f2937;
    --text-light: #6b7280;
}
```

## 📁 Project Structure

```
ntandostore/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript functionality
├── package.json        # Project configuration
├── render.yaml         # Render.com deployment config
├── README.md           # This file
└── todo.md             # Development todo list
```

## 🔒 Security Features

- Content Security Policy headers
- XSS protection headers
- Clickjacking protection
- Secure admin panel with credentials
- Input validation on forms

## 📱 Mobile Optimization

- Fully responsive design
- Touch-friendly navigation
- Optimized images and media
- Fast loading on mobile networks
- Hamburger menu for small screens

## 🌐 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Performance

- Optimized CSS and JavaScript
- Lazy loading for images
- Minimal external dependencies
- Fast loading times
- SEO-friendly URLs

## 🤝 Support

For support or questions:
- **Email**: ntandostore@example.com
- **Phone**: +263 786 831 091
- **Website**: [Your Render.com URL]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔄 Updates

The website includes an admin panel that allows for:
- Real-time content updates
- Promotional banner management
- Logo and media changes
- Site refresh without redeployment

---

**Ready to deploy!** Follow the Render.com deployment instructions above to get your website live.