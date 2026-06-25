import model from "./model.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import query_sections from "./query-sections.js";
import query_section_text from "./query-section-text.js";

export default function BirdRoutes(app) {
  app.get("/api/birds/:birdName", async (req, res) => {
    const { birdName } = req.params;

    // Search the database model to check if the requested bird already exists in the database
    const birds = await model.find({ name: birdName });

    // If the search returns a list with a length greater than 0, the bird exists in the database and return it
    if (birds.length > 0) {
      return res.json(birds[0]);
    }

    // If the bird is not found in the database, use axios to query the wikipedia API and begin
    // gathering its information
    const wiki_rest_query = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${birdName}`,
      {
        // For every wikipedia API query, a header must be used to identify the user to prevent
        // the API request from being denied and causing an error
        headers: {
          "User-Agent":
            "BirdSearch/1.0 (astroohnuma@gmail.com)"
        }
      }
    )

    const wiki_rest_data = wiki_rest_query.data;

    // The GBIF API is queried to find taxonomic data for the bird
    const gbif_query = await axios.get(
      `https://api.gbif.org/v1/species/search?rank=SPECIES&q=${birdName}&qField=VERNACULAR`,
      {
        headers: {
          "User-Agent":
            "BirdSearch/1.0 (astroohnuma@gmail.com)"
        }
      }
    )

    const taxonomy = gbif_query.data.results[0];

    // The query_sections function is given the original query and returns a sections map
    // containing all the approved sections from the original wikipedia page
    const sections = await query_sections(birdName);

    // The query_section_text function is given our previously acquired sections map to return a map
    // containing the text of every section we want
    const sections_full = await query_section_text(sections, birdName);

    // The elements of the bird schema are filled out using the data we have acquired from our
    // various wikipedia and GBIF API queries
    const bird = {
      _id: uuidv4(),
      name: wiki_rest_data.title,
      scientificName: taxonomy.canonicalName,
      sections: sections_full,
      image: wiki_rest_data.thumbnail?.source,
      family: taxonomy.family,
      genus: taxonomy.genus
    };

    await model.create(bird);

    res.json(bird);
  });
}