/** @notice library imports */
import cors from "cors";
import morgan from "morgan";
import express from "express";
/// External imports

/// Application
export const expressApp = express();

/// Core middlewares
expressApp.use(cors());
expressApp.use(morgan("dev"));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
