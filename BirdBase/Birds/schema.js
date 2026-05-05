import mongoose from 'mongoose';
const birdSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    scientificName: String,
    description: String,
    image: String,
    family: String,
    source: String,
    lastUpdated: Date,
    region: String,
  },
  { collection: "birds" }
);
export default birdSchema