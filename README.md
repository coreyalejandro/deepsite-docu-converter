# DeepSite Docu Converter

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

## Development

- Frontend with Vite:
  ```bash
  npm run dev
  ```
  This starts a Vite dev server.

- Backend Express server:
  ```bash
  npm start
  ```
  The server serves content from `dist/` at `http://localhost:3000`.

## Build

To bundle the frontend assets:
```bash
npm run build
```
The compiled files are output to `dist/` and can be served by the Express server.
