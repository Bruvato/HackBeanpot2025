# RoadToad - Your Ultimate Road Trip Planner

[Devpost](https://devpost.com/software/roadtoad)

[Video Demo](https://youtu.be/X_MCxgd-IWA)


| ![full page1](https://github.com/user-attachments/assets/3483a03f-4f1b-4ef4-a2c1-661eff1e8bff) |
| :--: |
| *Home Page* |

<br />

| ![map options](https://github.com/user-attachments/assets/59fa45a4-1343-4956-b5a9-d37362e12d0c) | ![weather](https://github.com/user-attachments/assets/091415e6-16e0-4c16-b445-564eb383c452) | ![packing list](https://github.com/user-attachments/assets/b8a7b544-4542-49ea-ab4e-92a535fb9071) | ![playlist](https://github.com/user-attachments/assets/168b0017-534a-43fe-8f38-e6a89c86b033) |
| :---: | :---: | :---: | :---: |
| *Map Options* | *Weather* | *Packing List* | *Playlist* |

<br />

| ![map](https://github.com/user-attachments/assets/f1f1ab80-a87d-4fb1-a6a7-294826940b85) | 
|:--:| 
| *Map* |

<br />

| ![bingo](https://github.com/user-attachments/assets/32844675-adcb-4aa5-8f05-ad6c2fe5e8fd) |
|:--:| 
| *Bingo Board* |




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
git clone https://github.com/your-username/HackBeanpot2025.git
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
