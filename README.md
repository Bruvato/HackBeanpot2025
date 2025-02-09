# RoadToad - Your Ultimate Road Trip Planner

## 🚀 Inspiration

Road trips are all about adventure, but planning one can be overwhelming. We wanted to build a tool that makes it effortless to plan a perfect road trip by handling routing, discovering nearby attractions, creating a Spotify playlist, and even generating a smart packing list. Our goal was to create a seamless travel companion that combines AI-powered recommendations with real-time data to enhance every journey.

## 🌍 What It Does

RoadToad helps users plan road trip routes and activities with the following features:
- **Multiple Route Options:** Choose from different routes from start to end destination.
- **Attraction Filters:** Pinpoints tourist attractions, restaurants, parks, museums, shopping areas, hotels, and gas stations along the route.
- **Weather Insights:** Displays weather forecasts for start and end locations.
- **AI-Powered Packing List:** Generates a personalized packing list based on location, weather, and trip details.
- **Custom Spotify Playlist:** Suggests a road trip playlist based on popular regional genres.
- **Interactive Bingo Game:** A fun way to engage passengers during the trip.

## 🛠 How We Built It

### **Frontend**
- **Frameworks & Libraries:** React, Next.js, Tailwind CSS
- **UI Enhancements:** Radix UI for components, Next Themes for theming

### **Backend**
- **Technologies:** Node.js, Next.js API routes
- **AI Integration:** Google Gemini AI for intelligent recommendations
- **Authentication:** NextAuth.js for secure user authentication

### **APIs & Services**
- **Routing & Attractions:** Google Maps API for fetching route data and points of interest
- **Packing List Generation:** Google Gemini AI for AI-powered packing list customization
- **Music Integration:** Spotify API for generating a regional road trip playlist

## 🚧 Challenges We Ran Into
- Ensuring recommended attractions were **relevant and up-to-date**.
- Managing multiple **external API calls efficiently**.
- Fine-tuning AI to generate **concise, useful lists and descriptions**.
- Securely integrating **user authentication**.
- Handling **merge conflicts** during development.

## 🏆 Accomplishments That We're Proud Of
- **Learning new technologies:** Some team members had never worked with these tools before.
- **Successful integration:** Merging multiple APIs and AI-powered features into a functional web app.
- **First-time builders:** One of our team members built their first-ever web app through this project!

## 📚 What We Learned
- How to **effectively use Google Maps API** for route optimization.
- Fine-tuning **AI-generated content** for clarity and relevance.
- Best practices for **handling authentication** in Next.js using NextAuth.js.
- Managing multiple API integrations in a **full-stack application**.

## 🔮 What's Next for RoadToad
- **Offline Mode:** Access saved trip details without an internet connection.
- **Real-Time Updates:** Fetch live weather, traffic, and road conditions.
- **Budget Planning:** Estimate trip costs based on fuel, accommodations, and attractions.
- **Social Features:** Allow users to share and collaborate on trips with friends.
- **Mobile App:** Expand RoadToad into a native mobile app for better accessibility.

## 📦 Installation & Setup

To run this project locally:

### **Prerequisites**
- Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- Clone this repository:
  ```sh
  git clone https://github.com/your-username/road-trip-planner.git
  cd road-trip-planner
  ```

### **Install Dependencies**
```sh
npm install
```

### **Run Development Server**
```sh
npm run dev
```

### **Build for Production**
```sh
npm run build
```

### **Start Production Server**
```sh
npm start
```

---
**Made with ❤️ by Team RoadToad**
