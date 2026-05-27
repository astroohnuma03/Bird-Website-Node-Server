import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("BirdModel", schema);
export default model;