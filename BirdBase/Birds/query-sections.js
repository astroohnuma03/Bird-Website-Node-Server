import axios from "axios";

// Current list of approved sections to add to each bird. Will probably update list or replace with actual
// fuzzy match system later on.
const allowed_sections = [
  "Intro",
  "Description",
  "Habitat",
  "Habitat and range",
  "Behavior",
  "Distribution",
  "Distribution and habitat",
  "Distribution and range",
  "Range",
  "Behavior and ecology",
  "Diet",
  "Reproduction"
]

// Given a string representing a section, returns true if the section matches at least one section
// in the allowed_sections list. Otherwise returns false.
function is_section_allowed(section) {
  const allowed = false;
  const len = allowed_sections.length;

  for (let i = 0; i < len; i++) {
    if (section.toLowerCase() == allowed_sections[i].toLowerCase()) {
      allowed = true
    }
  }

  return allowed;
}

// Function to query and retrieve a list of sections to add to a bird entry given a bird page
export default function query_sections(query) {
  const sections = new Map([
    ["Intro", 0]
  ]);
  const sections_query = await axios.get(
    `https://en.wikipedia.org/w/api.php?action=parse&page=${query}&prop=tocdata&format=json`,
    {
      headers: {
        "User-Agent":
          "BirdSearch/1.0 (astroohnuma@gmail.com)"
      }
    }
  );
  const sections_json = sections_query.data;

  for (let i = 1; i <= sections_json.tocdata.sections.length; i++) {
    const section_title = sections_json.tocdata.sections[i].line;
    const section_index = sections_json.tocdata.sections[i].index;

    sections.set(section_title, section_index);
  }

  const bad_sections = [];
  sections.forEach (function(value, key) {
    if (!(is_section_allowed(key))) {
      bad_sections.push(key);
    }
  })

  for (let i = 0; i < bad_sections.length; i++) {
    sections.delete(bad_sections[i]);
  }

  return sections;
}