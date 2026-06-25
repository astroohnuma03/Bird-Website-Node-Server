import axios from "axios";
import * as cheerio from "cheerio";

// Function which takes the results of a wikipedia API query and uses the cheerio library to
// remove unnecessary and messy elements and returns a much cleaner and more usable version
// of the text
function html_cleanup(html_query) {
  const html = html_query.data.parse.text["*"].replace(/<!--[\s\S]*?-->/g, '');
  const $ = cheerio.load(html);

  $("table").remove();
  $("img").remove();
  $("figcaption").remove();
  $("h2").remove();
  $(".gallerybox").remove();
  $(".gallerytext").remove();
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

// Function which given the titles and indexes of sections of a wikipedia page and the original query
// for the wikipedia page, returns a map containing the names of each section as keys and the cleaned
// up text of those sections as values
export default async function query_section_text(sections, query) {
  const section_text_list = await Promise.all(
    sections.map(async (value) => {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${query}&prop=text&section=${value.index}&format=json`,
        {
          headers: {
            "User-Agent":
              "BirdSearch/1.0 (astroohnuma@gmail.com)"
          }
        }
      );

      const clean_section = html_cleanup(response);

      return {
        title: value.title,
        text: clean_section
      };
    })
  );

  console.log(section_text_list);
  return section_text_list;
}