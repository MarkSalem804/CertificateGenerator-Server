const express = require("express");
const cookieParser = require("cookie-parser");
const Routes = require("./src/Middlewares/routes-config");
const { errorHandler, notFoundHandler } = require("./src/Middlewares/errors");
const cors = require("cors");
const clear = require("clear");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const corsOptions = require("./src/Middlewares/CORS-conf/cors-options");
const credentials = require("./src/Middlewares/CORS-conf/credentials");
const port = process.env.PORT || 5016;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors setup
app.use(credentials);
app.use(cors(corsOptions));

Routes(app);

//error handlers middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  clear(); // Clear the terminal when the server starts
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📡 API Base URL: http://localhost:${port}`);
});
