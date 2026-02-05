import interlinker from "@photogabble/eleventy-plugin-interlinker";

export default function (eleventyConfig) {
  // Order matters, put this at the top of your configuration file.
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setInputDirectory("refresher");
  eleventyConfig.setIncludesDirectory("./includes");
  eleventyConfig.addWatchTarget("assets/");
  eleventyConfig.addPassthroughCopy("./assets/bundle.css");
  eleventyConfig.addPassthroughCopy("./assets/sodapop-search.css");
  eleventyConfig.addPassthroughCopy("./assets/index.js");
  // eleventyConfig.addWatchTarget("./includes/*");
  // eleventyConfig.setServerOptions({
  //   watch: ["./assets/*"],
  // });
  eleventyConfig.addGlobalData("siteName", "Refresher");
  eleventyConfig.addGlobalData("email", "simonhildebrandt@gmail.com");

  // TODO debug and reintroduce interlinker plugin
  //eleventyConfig.addPlugin(interlinker);

  // Cache busting filter
  eleventyConfig.addFilter("bust", (url) => {
    // Splits the URL part and the query parameter part if any
    const [urlPart, paramPart] = url.split("?");
    // Returns the URL with a new timestamp query parameter
    return `${urlPart}?v=${Date.now()}${paramPart ? `&${paramPart}` : ""}`;
  });

  // Thanks Joshtronic! https://joshtronic.com/2025/09/07/eleventy-category-tag-pages/
  eleventyConfig.addCollection("decadeDisproved", async (collectionsApi) => {
    const decadeDisproved = new Set();
    const all = collectionsApi.getAll();
    for (const item of all) {
      if (item.data.decade_disproved) {
        decadeDisproved.add(item.data.decade_disproved);
      }
    }

    const decades = Array.from(decadeDisproved).sort();

    const items = decades.map((decade) => {
      return [
        decade,
        all.filter((item) => item.data.decade_disproved === decade),
      ];
    });

    return {
      decades,
      items: Object.fromEntries(items),
    };
  });

  eleventyConfig.addCollection("topics", async (collectionsApi) => {
    const topicSet = new Set();
    const all = collectionsApi.getAll();

    for (const item of all) {
      if (item.data.topics) {
        item.data.topics.forEach((topic) => topicSet.add(topic));
      }
    }

    const topics = Array.from(topicSet).sort();

    const items = topics.map((topic) => {
      return [
        topic,
        all.filter(
          (item) => item.data.topics && item.data.topics.includes(topic),
        ),
      ];
    });

    return {
      topics,
      items: Object.fromEntries(items),
    };
  });

  eleventyConfig.addCollection("recent", async (collectionsApi) => {
    const items = collectionsApi
      .getAll()
      .sort((a, b) => b.updated - a.updated)
      .slice(0, 5);

    return items;
  });

  eleventyConfig.addCollection("random", async (collectionsApi) => {
    const items = collectionsApi.getAll();
    const randomIndex = Math.floor(Math.random() * items.length);
    // Return the element at the random index
    const item = items[randomIndex];
    return item;
  });

  eleventyConfig.addCollection("all", async (collectionsApi) => {
    return collectionsApi.getAll();
  });
}
