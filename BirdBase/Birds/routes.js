import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function BirdRoutes(app) {
  app.get("/api/birds", async (req, res) => {
    const query = req.query.q;

    const birds = await model.find({
      name: { $regex: query, $options: i }
    });

    if (birds.length > 0) {
      return res.json(birds);
    }

    const wikiRestQuery = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`
    )

    const wikiRestData = wikiRestQuery.data

    // Fill out the elements of the bird schema here by extracting the data from wikiQuery
    const bird = {
      _id: uuidv4(),
      name: wikiRestData.title,
      scientificName: "",
      sections: {},
      image: wikiRestData.thumbnail?.source,
      family: "",
      genus: "",
      region: ""
    };

    await model.create(bird)

    res.json([bird]);
  });
}