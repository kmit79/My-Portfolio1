# My Portfolio Project

A professional full-stack developer portfolio showcasing a variety of web applications built with HTML, CSS, and vanilla JavaScript.

## 🚀 Portfolio Overview
The main portfolio serves as a hub for all projects, featuring a modern, responsive "Purple Vibe" design.

### Key Features:
- **Dynamic Weather Widget:** Uses the Open-Meteo API and BigDataCloud reverse geocoding to show real-time weather based on the user's geolocation.
- **Smart Navigation:** Features high-performance scroll spying and throttled scroll events for active section highlighting.
- **Contact Form:** Integrated with Formspree for serverless form handling, including client-side validation and state feedback.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop views.

---

## 📁 Projects Breakdown

### 1. Pokedex API
A high-quality Pokemon browser that interacts with the PokéAPI.
- **Features:** Fetches the original 151 Pokemon, displays official high-resolution artwork, and provides detailed species descriptions.
- **Logic:** Implements asynchronous data fetching and dynamic filtering as the user types or searches.

### 2. Puzzle Game
A classic 3x3 sliding tile puzzle game.
- **Features:** Custom image selection, "Shuffle" functionality, and a hint system that toggles numbers on tiles.
- **Technical Challenge:** Handles complex background-position calculations to correctly slice images into a grid, including RTL support for the UI.
- **Win State:** Automatically detects when tiles are in the correct sequence and reveals the full image.

### 3. Countries API Explorer
A data-driven application using the REST Countries API.
- **Features:** Lists all global countries in a searchable table and provides a dedicated search for specific country details (capital, population, currency).
- **Logic:** Features alphabetical sorting and dynamic DOM manipulation to render large datasets efficiently.

### 4. Advanced To-Do List
A productivity app built using Object-Oriented Programming (OOP) principles.
- **Features:** Full CRUD (Create, Read, Update, Delete) functionality, task filtering (All, Active, Completed), and live statistics.
- **Persistence:** Uses `localStorage` to save user data across browser sessions.
- **Security:** Implements HTML escaping to prevent XSS (Cross-Site Scripting) from user input.

### 5. MathLearn - Educational Game
A gamified math learning platform designed for kids.
- **Features:** Randomly generated arithmetic problems (+, -, ×, ÷), a countdown timer, and an interactive mascot that reacts to performance.
- **UI/UX:** Supports both on-screen numpad and physical keyboard input for better accessibility.

### 6. Tic Tac Toe Game
A classic strategy game featuring a clean, minimalist interface.
- **Features:** Local multiplayer support, turn-tracking, and a responsive grid that works on all screen sizes.
- **Logic:** Implements win-condition checks across 8 possible lines and handles draw scenarios when the board is full.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Variables, Grid, Flexbox), JavaScript (ES6+).
- **APIs:** 
  - Open-Meteo (Weather)
  - PokéAPI (Pokemon Data)
  - REST Countries (Geographic Data)
  - BigDataCloud (Geocoding)
- **Deployment/Tools:** Formspree for contact forms.

## 📂 Project Structure

```text
My Portfolio/
├── Projects/
│   ├── PokedexAPI/      # pokedex.js, pokedex.css
│   ├── PuzzleGame/      # puzzlegame.js, puzzlegame.css
│   ├── CountriesAPI/    # countries.js, countries.css
│   ├── ToDoList/        # todolist.js, todolist.css
│   ├── MathLearn/       # mathlearn.js, mathlearn.css
│   └── TicTacToe/       # tictactoe.js, tictactoe.css
├── app.js               # Main portfolio logic
├── style.css            # Global styles and variables
└── README.md            # Project documentation
```

## ✍️ Author
**Evgeny Teush**  
Final Project - Full Stack Course

---
*This project was developed as a comprehensive demonstration of frontend development skills, API integration, and user experience design.*