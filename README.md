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

## Security

The Express server sanitizes all generated HTML using [DOMPurify](https://github.com/cure53/DOMPurify) before returning it to clients. This helps prevent XSS when converting untrusted input. If you modify server-side rendering, ensure any HTML sent in responses is sanitized.
