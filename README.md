# Port Russell Site

Frontend application for Port Russell marina management.
The project provides an authenticated interface to manage:

- users
- catways
- reservations

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Bootstrap 5

## Features

- Login page with session persistence in `sessionStorage`
- Protected pages (redirect to login when no user session is found)
- CRUD flows for users, catways, and reservations
- Confirmation pages after create, update, and delete actions
- Home dashboard with connected user summary, current date, and reservation table overview

## Project Structure

```text
.
├── index.html
├── assets/
├── components/
│   ├── navBar.js
│   └── reservationsTable.js
├── js/
│   ├── login.js
│   ├── protectedPage.js
│   ├── connectedUser.js
│   ├── users.js
│   ├── catways.js
│   ├── reservations.js
│   └── extractReservations.js
├── pages/
│   ├── home.html
│   ├── users.html
│   ├── catways.html
│   ├── reservations.html
│   └── subpages/
├── src/
│   ├── config.js
│   └── date.js
└── style/
```

## Configuration

API endpoint selection is handled in `src/config.js`:

- local frontend URL (`http://localhost:5500/`) -> `http://localhost:3000`
- deployed frontend URL (`https://portrussell-site.onrender.com/`) -> `https://portrussell-api.onrender.com`

The helper `config(page)` appends the given API path (example: `"/users"`).

## How To Run

1. Start the backend API (expected on port `3000` in local mode).
2. Serve this frontend with a static server (for example VS Code Live Server on `http://localhost:5500`).
3. Open `index.html` through the local server URL.
4. Sign in with a valid user account.

## Main API Routes Used By The Frontend

- `POST /users/login`
- `GET /users/logout`
- `GET /users`
- `POST /users`
- `PUT /users/:email`
- `DELETE /users/:email`
- `GET /catways`
- `POST /catways`
- `PUT /catways/:catwayNumber`
- `DELETE /catways/:catwayNumber`
- `GET /catways/:catwayNumber/reservations`
- `POST /catways/:catwayNumber/reservations`
- `PUT /catways/:catwayNumber/reservations/:idReservation`
- `DELETE /catways/:catwayNumber/reservations/:idReservation`

## JSDoc Notes

JSDoc comments are now included across the JavaScript codebase for:

- exported functions
- internal handlers
- shared payload/data shapes (`@typedef`)
- global mutable variables (`@type`)
- module bootstrap behavior (auto-run calls and route-based initialization)

If you want to generate documentation locally (optional):

```bash
npx jsdoc -r js src components -d docs -R README.md
```

## Script Initialization Pattern

The frontend relies on module side effects:

- `components/navBar.js` builds the navbar when imported.
- `js/protectedPage.js` checks authentication state immediately.
- feature modules (`users.js`, `catways.js`, `reservations.js`) self-initialize only when the current URL matches their page.
- dashboard utilities (`connectedUser.js`, `extractReservations.js`, `src/date.js`) run immediately on page load.

This pattern is intentional and helps keep page-specific logic isolated.

## Error Handling Contract

Several handlers expect backend error payloads to expose an `errorMessage` field.
When standardizing API errors, keep this field available to preserve UI alert behavior.

## Known Limitations

- Some UI text is still in French.
- A few scripts still contain debug `console.log` statements.
- The code currently does not include automated tests.
