import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import cors from "cors";
import * as cheerio from "cheerio";
import BirdRoutes from "./BirdBase/Birds/routes.js";

mongoose.connect("mongodb://127.0.0.1:27017/birdbase");
const app = express();
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173",
}));
app.use(express.json());
BirdRoutes(app);
app.listen(process.env.port || 4000);