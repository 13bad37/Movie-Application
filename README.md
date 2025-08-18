# Movie Explorer

Movie Explorer is a React application designed for discovering and exploring movies through an intuitive and responsive interface. Users can search for movies, browse results, and access detailed information about cast, crew, ratings, and more.

## Language and Tools

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FFDD00?style=flat-square&logo=zustand&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)



## Features

- Search movies by title and/or year.
- Paginated results with navigation controls.
- Cached poster images to reduce API calls.
- Persistent state for last viewed page and scroll position.
- Detailed movie pages with plot, genres, runtime, countries, ratings (IMDb, Rotten Tomatoes, Metacritic), and cast & crew.
- Authentication flow including registration, login, protected routes, token refresh, and persisted login state using Zustand.
- Smooth animations for transitions.
- Back-to-top button for easy navigation.

---

## Screenshots

### Home Screen
![Home Screen](./docs/images/home.png)

### Movies Grid
![Movies Grid](./docs/images/movies.png)

### Movie Details
![Movie Details](./docs/images/details.png)

### Actor Details
![Actor Details](./docs/images/person.png)

---

## Tech Stack

- React (CRA) & React Router
- Tailwind CSS with custom animations
- Axios with interceptor for token refresh
- Zustand for lightweight global state management
- React Country Flag for country icons
- react-hot-toast for inline notifications
- Lucide-React for SVG icons

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/13bad37/movie-explorer.git
   cd movie-explorer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

