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
      documents[item.url] = {
        title: item.data.title,
        url: item.url,
        content: item.content,
      };
    });

    const idx = lunr(function () {
      this.ref("url");
      this.field("title");
      this.field("content");

      collection.forEach(function (doc) {
        this.add(doc);
      }, this);
    });

    return JSON.stringify({ idx, documents });
  }
}
