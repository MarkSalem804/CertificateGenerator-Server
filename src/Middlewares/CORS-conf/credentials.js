const allowedOrigins = require("./allowed-origins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  // Always set credentials header in development for localhost
  if (
    !origin ||
    allowedOrigins.includes(origin) ||
    (process.env.NODE_ENV === "development" &&
      origin &&
      origin.startsWith("http://localhost:"))
  ) {
    res.header("Access-Control-Allow-Credentials", true);
  }

  next();
};

module.exports = credentials;
