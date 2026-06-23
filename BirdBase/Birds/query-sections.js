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
  var allowed = false;
  const len = allowed_sections.length;

  for (let i = 0; i < len; i++) {
    if (section.toLowerCase() == allowed_sections[i].toLowerCase()) {
      allowed = true
    }
  }

  return allowed;
}

// Function to query and retrieve a list of sections to add to a bird entry given a bird page
export default async function query_sections(query) {
  const sections = [];
  const sections_query = await axios.get(
    `https://en.wikipedia.org/w/api.php?action=parse&page=${query}&prop=tocdata&format=json`,
    {
      headers: {
        "User-Agent":
          "BirdSearch/1.0 (astroohnuma@gmail.com)"
      }
    }
  );
  
  const sections_json = sections_query.data.parse.tocdata.sections;
  
  for (let i = 0; i < sections_json.length; i++) {
    const section_title = sections_json[i].line;
    const section_index = Number(sections_json[i].index);
    const section = {
      title: section_title,
      index: section_index,
    };
    sections.push(section);
  }

  const bad_sections = [];
  sections.map(function(value, index, array) {
    if (!(is_section_allowed(value.title))) {
      bad_sections.push(value.title);
    }
  })

  const approved_sections = sections.filter(function(value, index, array) {
    const bad = false;
    bad_sections.map(function(value2, index2, array2) {
      if (value.title == value2) {
        bad = true;
      }
    })
    return bad;
  });

  console.log(approved_sections);

  return approved_sections;
}