# Qitchen

Qitchen is a sushi restaurant landing page designed to showcase a menu of freshly prepared sushi, provide information about the restaurant, and allow customers to make table reservations.

## Features

- **Responsive Navigation** — Navigation links to the Home, Menu, Reservation, About, and Contact sections.
- **Hero Section** — A full-screen introduction with a background image and a button to reserve a table.
- **Sushi Menu** — Displays sushi items across three categories: Maki, Uramaki, and Special Rolls, with images, descriptions, and prices.
- **Table Reservations** — A reservation form with customer details, number of guests, date, time slot, seating preference, and special requests.
- **About Section** — Introduces the restaurant's approach to fresh fish, ingredient quality, and sushi preparation.
- **Restaurant Information** — Includes opening hours, location, contact details, and navigation links in the footer.
- **Responsive Design** — Adapts the layout for desktop, tablet, and mobile screens.
- **Interactive Styling** — Includes hover effects, smooth scrolling, and styled form inputs.

## Technologies

- React
- Vite
- Tailwind CSS

## Getting Started

1. Clone or download the project.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`, then open the URL it prints (usually http://localhost:5173).
4. Build for production with `npm run build` (output goes to `dist/`).

## Project Structure

- `index.html` — Vite entry page
- `src/App.jsx` — page layout
- `src/components/` — Header, Hero, Menu, ProductCard, FavoriteToggle, Reservation, About, Footer
- `src/data/` — menu items and navigation links
- `src/index.css` — Tailwind import and theme colors
- `public/images/` — sushi photos

## Note

Qitchen is a learning project focused on creating a clean, responsive restaurant website using React, Vite, and Tailwind CSS.