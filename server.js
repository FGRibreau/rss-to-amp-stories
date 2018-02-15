// -----------------------
// Quick & Dirty prototype I made during AMP-Conf amsterdam first morning
// while discovering amp-stories
// -----------------------

// amp-story template
const Mustache = require('mustache');
const { resolve } = require('path');
const TMPL = require('fs').readFileSync(
  resolve(__dirname, 'stories.tmpl.html'),
  'utf8'
);

// http server
const express = require('express');
const app = express();

// config
const PORT = process.env.PORT || 8080;

const { getFeed } = require('./rss');

// routes
app.get('/', function(req, res) {
  if (!req.query || !req.query.url) {
    return res.send({
      error: 'Please specify /?url={rss-feed-url} parameter.',
    });
  }

  getFeed(req.query.url).then(
    feed => res.send(Mustache.render(TMPL, feed)),
    err => res.send(err)
  );
});

app.get('/end-screen.json', (req, res) =>
  res.send(require('./end-screen.json'))
);

app.listen(PORT, () => console.log('Example app listening on port %s!', PORT));
