import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import * as cheerio from "cheerio";
import BirdRoutes from "./BirdBase/Birds/routes.js";

mongoose.connect("mongodb://127.0.0.1:27017/birds");
const app = express();
app.use(express.json());
BirdRoutes(app);
app.listen(process.env.port || 4000);