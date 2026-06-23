import mongoose from "mongoose";
const birdSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    scientificName: String,
    sections: [],
    image: String,
    family: String,
    genus: String,
    lastUpdated: Date
  },
  { collection: "birds" }
);
export default birdSchema