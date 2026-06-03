import axios from "axios";
import cheerio from "cheerio";

function html_cleanup(html_query) {
  const html = html_query.data.parse.text["*"];
  const $ = cheerio.load(html);

  $("table").remove();
  $("img").remove();
  $(".thumb").remove();
  $(".reference").remove();
  $("sup.reference").remove();
  $(".mw-editsection").remove();
  $(".mw-cite-backlink").remove();
  $(".reference-text").remove();
  $(".mw-references-wrap").remove();
  $("style").remove();
  $("script").remove();
  $("a").each((_, element) => {
    const text = $(element).text();
    $(element).replaceWith(text);
  });

  const cleanedHTML = $(".mw-parser-output").html();

  return cleanedHTML;
}

export default function query_section_text(sections, query) {
  const section_text_map = new Map();
  sections.forEach (function(value, key) {
    const section_text_query = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=parse&page=${query}&prop=text&section=${value}&format=json`,
      {
        headers: {
          "User-Agent":
            "BirdSearch/1.0 (astroohnuma@gmail.com)"
        }
      }
    );

    const clean_section = html_cleanup(section_text_query);
    section_text_map.set(key, clean_section);
  })

  return section_text_map;
}