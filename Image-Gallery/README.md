# 🖼️ Dark Gallery - Image Gallery Website

A sleek and modern **Image Gallery Web App** that fetches and displays images dynamically.  
It comes with a **dark-themed design**, smooth animations, and a **lightbox view** for a better user experience.

---

## 🚀 Features
- 🔎 **Dynamic image loading** (with Unsplash API or fallback using Lorem Picsum).
- 🎨 **Dark-themed UI** with stylish overlays.
- 🖼️ **Lightbox mode** to view images in fullscreen.
- ⏪ **Next/Previous navigation** inside the lightbox.
- ⌨️ **Keyboard controls**:
  - `Esc` → Close lightbox  
  - `←` / `→` → Navigate images
- 📂 **Category filters** (Nature, Architecture, Technology, People, Abstract).
- ⚡ **Lazy loading & smooth scroll animations** for performance.

---

## 🛠️ Tech Stack
- **HTML5**  
- **CSS3** (custom dark theme + transitions)  
- **JavaScript (ES6)**  
- **Unsplash API** (or fallback with [Picsum Photos](https://picsum.photos/))

---

## 📂 Project Structure
image-gallery/
│── index.html # Main HTML file
│── style.css # Stylesheet
│── script.js # JS logic (API + lightbox + filters)
│── README.md # Project documentation

yaml
Copy code

---

## ⚡ Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/itsanshtyagi/codealpha_tasks.git
   cd codealpha_tasks/image-gallery
Open index.html in your browser.

(Optional) Replace the placeholder Unsplash API key inside script.js:

js
Copy code
const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${categories[category]}&per_page=20&orientation=landscape&client_id=YOUR_ACCESS_KEY`
);
🎯 Future Enhancements
🔍 Add a search bar for custom queries.

💾 Save favorite images using local storage or Supabase.

📱 Make it fully responsive for mobile.

👨‍💻 Author
Built with ❤️ by Ansh Tyagi
📧 anshtyagi0000@gmail.com 