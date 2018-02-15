// Rss handling
const Parser = require('rss-parser');
const parser = new Parser();
const RssCache = require('lru-cache')({
  max: 500,
  maxAge: 1000 * 60 * 60,
});

module.exports = {
  getFeed: url =>
    !RssCache.get(url)
      ? parser.parseURL(url).then(feed => {
          RssCache.set(url, Promise.resolve(feed));
          return feed;
        })
      : RssCache.get(url),
};
