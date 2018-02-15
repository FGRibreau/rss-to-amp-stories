// -----------------------
// Quick & Dirty prototype I made during AMP-Conf amsterdam first morning
// while discovering amp-stories
// -----------------------

// Rss handling
const Parser = require('rss-parser');
const parser = new Parser();
const RssCache = require('lru-cache')({
  max: 500,
  length: function(n, key) {
    return n * 2 + key.length;
  },
  dispose: function(key, n) {
    n.close();
  },
  maxAge: 1000 * 60 * 60,
});

// amp-story template
const Mustache = require('mustache');
const TMPL = require('fs').readFileSync('./stories.tmpl.html', 'utf8');

// http server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// routes
app.get('/', function(req, res) {
  if (!req.query || !req.query.url) {
    return res.send({
      error: 'Please specify /?url={rss-feed-url} parameter.',
    });
  }

  const rssUrl = req.query.url;

  const feed = !RssCache.get(rssUrl)
    ? parser.parseURL(rssUrl).then(feed => {
        RssCache.set(rssUrl, feed);
        return feed;
      })
    : RssCache.get(rssUrl);

  feed
    .then(feed => {
      return feed;
    })
    .then(feed => res.send(Mustache.render(TMPL, feed)), err => res.send(err));
});

app.get('/end-screen.json', (req, res) =>
  res.send(require('./end-screen.json'))
);

app.listen(PORT, () => console.log('Example app listening on port %s!', PORT));
