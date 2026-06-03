import model from "./model.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import query_sections from "./query-sections.js";

export default function BirdRoutes(app) {
  app.get("/api/birds", async (req, res) => {
    const query = req.query.q;

    const birds = await model.find({
      name: { $regex: query, $options: i }
    });

    if (birds.length > 0) {
      return res.json(birds);
    }

    const wiki_rest_query = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`,
      {
        headers: {
          "User-Agent":
            "BirdSearch/1.0 (astroohnuma@gmail.com)"
        }
      }
    )

    const wiki_rest_data = wiki_rest_query.data;

    const sections = query_sections(query);

    // Fill out the elements of the bird schema here by extracting the data from various API queries
    const bird = {
      _id: uuidv4(),
      name: wiki_rest_data.title,
      scientificName: "",
      sections: {},
      image: wiki_rest_data.thumbnail?.source,
      family: "",
      genus: "",
      region: ""
    };

    await model.create(bird)

    res.json([bird]);
  });
}