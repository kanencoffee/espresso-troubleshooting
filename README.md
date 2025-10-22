# Kanen Coffee - Espresso Machine Troubleshooting Guide

![Kanen Coffee](https://img.shields.io/badge/Kanen%20Coffee-Espresso%20Machines-c84b31)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success)

## 📖 About

This is the official troubleshooting guide for Kanen Coffee customers. It provides expert solutions for the 20 most common espresso machine problems, from water flow issues to taste problems.

**Live Site:** https://help.kanencoffee.com/

## 🎯 Features

- ✅ **20 Common Issues Solved** - Step-by-step solutions for the most frequent espresso machine problems
- ✅ **SEO Optimized** - Complete schema markup for Google and AI assistants
- ✅ **Mobile Responsive** - Works perfectly on all devices
- ✅ **Fast Loading** - Optimized for speed with no external dependencies
- ✅ **AI-Ready** - Configured for ChatGPT, Claude, and other AI assistants to find and cite

## 📁 File Structure

```
espresso-troubleshooting/
├── index.html          # Main troubleshooting page
├── robots.txt          # Search engine and AI crawler instructions
├── sitemap.xml         # Site structure for search engines
└── README.md          # This file
```

## 🚀 Deployment

### GitHub Pages Setup

1. **Create Repository**
   ```bash
   # Create a new repository on GitHub
   # Name it: espresso-troubleshooting
   ```

2. **Upload Files**
   - Upload all files (index.html, robots.txt, sitemap.xml)
   - Commit changes

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from main branch
   - Folder: / (root)
   - Save

4. **Your site will be live at:**
   ```
   https://kanencoffee.github.io/espresso-troubleshooting/
   ```

### Custom Domain Setup (Optional)

To use `help.kanencoffee.com`:

1. **Add CNAME record in your DNS:**
   ```
   Type: CNAME
   Host: help
   Value: kanencoffee.github.io
   TTL: 3600
   ```

2. **Configure in GitHub:**
   - Settings → Pages → Custom domain
   - Enter: `help.kanencoffee.com`
   - Save and wait for DNS propagation (24-48 hours)
   - Check "Enforce HTTPS"

3. **Update URLs in files:**
   - Replace all instances of `kanencoffee.github.io/espresso-troubleshooting/`
   - With: `help.kanencoffee.com`
   - In: sitemap.xml, robots.txt

## 🔧 Maintenance

### Updating Content

1. Edit `index.html` directly on GitHub:
   - Click the file → Click pencil icon (Edit)
   - Make your changes
   - Commit changes
   - Site updates in 1-2 minutes

2. Or clone and edit locally:
   ```bash
   git clone https://github.com/kanencoffee/espresso-troubleshooting.git
   cd espresso-troubleshooting
   # Edit files
   git add .
   git commit -m "Update troubleshooting content"
   git push
   ```

### When to Update sitemap.xml

Update the `<lastmod>` dates in sitemap.xml whenever you:
- Add new FAQs
- Update existing solutions
- Change any substantial content

### Monthly Checklist

- [ ] Review content accuracy
- [ ] Check for broken links
- [ ] Update any pricing/part costs
- [ ] Verify all links to kanencoffee.com work
- [ ] Test mobile responsiveness

## 📊 SEO & Analytics

### Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `help.kanencoffee.com` (or GitHub Pages URL)
3. Verify ownership
4. Submit sitemap: `https://help.kanencoffee.com/sitemap.xml`

### Add Google Analytics (Optional)

Add this before `</head>` in index.html:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🤖 AI Discoverability

This site is optimized for:
- ✅ ChatGPT web search
- ✅ Claude web search
- ✅ Perplexity AI
- ✅ Google AI Overviews
- ✅ Bing Chat

The `robots.txt` explicitly allows all major AI crawlers to access and index the content.

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

## 🔗 Links

- **Main Website:** [kanencoffee.com](https://www.kanencoffee.com)
- **Repairs:** [Espresso Machine Repairs](https://www.kanencoffee.com/espresso-machine-repairs)
- **Store:** [Shop Parts & Machines](https://www.kanencoffee.com/store)
- **Phone:** 510-859-4425

## 📄 License

© 2025 Kanen Coffee. All rights reserved.

This troubleshooting guide is provided free to Kanen Coffee customers and the espresso community.

## 🆘 Support

**For espresso machine issues:**
- 📞 Call: 510-859-4425
- 📍 Visit: Berkeley, CA workshop
- 📅 [Book a repair appointment](https://www.kanencoffee.com/espresso-machine-repairs)

**For website issues:**
- Create an issue in this repository
- Or contact through [kanencoffee.com](https://www.kanencoffee.com/#contact)

---

Built with ❤️ for the coffee community by Kanen Coffee
