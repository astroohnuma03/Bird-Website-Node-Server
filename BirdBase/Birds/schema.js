import mongoose from "mongoose";
const birdSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    scientificName: String,
    sections: {
      type: Map,
      of: String
    },
    image: String,
    family: String,
    genus: String,
    lastUpdated: Date,
    region: String,
  },
  { collection: "birds" }
);
export default birdSchema