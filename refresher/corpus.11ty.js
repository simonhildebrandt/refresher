import lunr from "lunr";

export default class {
  data() {
    return {
      layout: false,
      permalink: "corpus.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const collection = data.collections.all;

    const documents = {};

    collection.forEach((item) => {
      console.log(item.data.title);
      documents[item.url] = {
        title: item.data.title,
        url: item.url,
        content: item.rawInput,
      };
    });

    const idx = lunr(function () {
      this.ref("url");
      this.field("title");
      this.field("content");

      Object.values(documents).forEach(function (doc) {
        this.add(doc);
      }, this);
    });

    return JSON.stringify({ idx, documents });
  }
}
