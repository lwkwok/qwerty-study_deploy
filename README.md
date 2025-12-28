# Qwerty English Word Study App

This project is designed to help students study English words before taking the online test.

- **Test site:** [https://qwerty.kaiyi.cool/](https://qwerty.kaiyi.cool/)
- **Study site:** [https://qwerty-studydeploy.vercel.app/](https://qwerty-studydeploy.vercel.app/)

## Features
- Browse and study English words in chapters (20 words per chapter)
- See definitions, part of speech, and phonics (natural or chunked)
- Keyboard navigation and audio pronunciation
- Responsive, simple, and fast (static HTML/JS/CSS)

## How to Use Locally
1. Clone or download this repository.
2. Make sure you have [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or Python installed.
3. Start a local server:
   - **With Live Server:** Right-click `index.html` → "Open with Live Server"
   - **With Python:**
     ```sh
     python -m http.server
     ```
     Then open [http://localhost:8000](http://localhost:8000) in your browser.
4. Study words by chapter, listen to pronunciation, and use keyboard shortcuts for fast review.

## File Structure
- `index.html` — Main HTML file
- `app.js` — App logic (loads JSON, navigation, UI)
- `style.css` — Styles
- `4000_Essential_English_Words-meaning.json` — Word data (JSON array)

## Notes
- The app fetches the JSON file dynamically. You must use a local server (not open the HTML file directly) for it to work.
- You can deploy this app to GitHub Pages, Vercel, Netlify, or any static hosting service.

---

Happy studying!
