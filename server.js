require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

let urlListe = ["https://habitica.com/"]


function urlshortener(longUrl) {
  urlListe.push(longUrl)
  return urlListe.length-1
}

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


//you can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties
app.post("/api/shorturl", (req, res) => {
   
  let receivedUrl = req.body.url
  let hostname = receivedUrl
    .replace(/http[s]?\:\/\//, '')
    .replace(/\/(.+)?/, '');

    dns.lookup(hostname, (lookupErr, addresses) => {
    if (lookupErr) {
      console.log('lookup() error');
    }
    if (!addresses) {
      res.json({
        error: 'invalid URL'
      });
    } else {
      let shorturl = urlshortener(req.body.url) //req.body 
      res.json({original_url: req.body.url, short_url: shorturl});
    }
    })
})


//when you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
app.get('/api/shorturl/:shorturl', function(req, res) {  
    if(req.params.shorturl < 0 || req.params.shorturl > urlListe.length) {
              res.json({error: 'invalid URL'
      });
    } else {
        let redirectURL = urlListe[parseInt(req.params.shorturl)]
        res.redirect(redirectURL)
    }
    
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
