const allowedOrigins = [
  "http://localhost:5173", // Vite default port
  "http://localhost:3000", // React default port
  "http://localhost:5017",
  "http://127.0.0.1:5173", // Alternative localhost
  "http://127.0.0.1:3000", // Alternative localhost
  "https://ecertgen.depedimuscity.com",
  "https://ecertgen.depedimuscity.com:5002",
  "https://sdoic-certigo.depedimuscity.com",
  "https://sdoic-certigo.depedimuscity.com:5017",
];

module.exports = allowedOrigins;
