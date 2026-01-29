const express = require("express");
const userRouter = require("../User/user-controller");
const certRouter = require("../Routes/certgen-controller");
const signatureRouter = require("../Controllers/signature-controller");

const Routes = (app) => {
  const router = express.Router();

  // API Routes
  router.use("/users", userRouter);
  router.use("/certificate", certRouter);
  router.use("/signature", signatureRouter);

  // Health check endpoint
  router.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  // Mount all routes under /api prefix
  app.use("/api", router);

  // Root endpoint
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "EMUSS API Server",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        users: {
          login: "/api/users/login",
          register: "/api/users/register",
          update: "/api/users/:id",
          delete: "/api/users/:id",
        },
        certificate: {
          addDesignation: "/api/certificate/addDesignation",
          getAllDesignations: "/api/certificate/getAllDesignations",
          addUnit: "/api/certificate/addUnit",
          getAllUnits: "/api/certificate/getAllUnits",
          addSchool: "/api/certificate/addSchool",
          getAllSchools: "/api/certificate/getAllSchools",
          addPDProgram: "/api/certificate/addPDProgram",
          getAllPDPrograms: "/api/certificate/getAllPDPrograms",
          addFundSource: "/api/certificate/addFundSource",
          getAllFundSources: "/api/certificate/getAllFundSources",
          addAttendanceTable: "/api/certificate/addAttendanceTable",
          addMealAttendanceTable: "/api/certificate/addMealAttendanceTable",
        },
      },
      timestamp: new Date().toISOString(),
    });
  });
};

module.exports = Routes;
