function cl(x){console.log(x)}
var express = require('express');
const mongodb = require('mongodb');
var app = express(), uri = process.env.URL, db;


app.get("/", function (request, response) {
  response.send('<h1>image search api</h1><br><p>search for a specific phrase by pointing to /search/{phrase to search for}</p><br><p>get the latest searches by pointing to /latest</p><br><p>paginate by querying ?offset=2, ?offset=3, etc.');
});


app.get('/search/:img', function (req, res) {
  
  var page = 1;
  var responseArray = [];
  var recentSearches = db.collection('recent-searches');
  
  recentSearches.insert({phrase : req.params.img, timeStamp : new Date().toString()}, function(err) {if (err) throw err;})
  
  if (req.query.offset) {
    page = req.query.offset;
  }
  
  var options = {
    url: "https://api.gettyimages.com/v3/search/images?page="+page+"&page_size=10&fields=id,title,thumb,referral_destinations&sort_order=best&phrase="+req.params.img,
    headers: {
      'Api-Key': process.env.API_KEY
    }
  };
  
 
  var request = require('request');
  request(options, function (error, response, body) {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if (!error && response.statusCode == 200) {
      
      body = JSON.parse(body);

      for (let image of body.images) {

        let information = {
          imageURL : image.display_sizes[0].uri,
          altText : image.title,
          pageURL : (image.referral_destinations[1]) ? image.referral_destinations[1].uri : image.referral_destinations[0].uri
        };
        
        responseArray.push(information);
      }

      res.send(responseArray);
    }
    else {
      res.send(error, response.statusCode);
    }
  });
  
});


app.get('/latest', function (req, res) {

  var page = 1;
  var responseArray;
  
  if (req.query.offset) {
    page = req.query.offset;
  }
  
  var recentSearches = db.collection('recent-searches');
  
  recentSearches.find({}, { _id : 0}, {
    "sort": { "timeStamp": -1 },
  }).toArray(function (err, result) {
    if (err) throw err;
    // paginate response
    responseArray = result.slice((page*10)-10, page*10);
    res.send(responseArray);
  });
  
});


// connect to the db before starting the app server
mongodb.MongoClient.connect(uri, function(err, database) {
  if (err) {console.log(err); process.exit(1);}

  // save db obj from callback for reuse
  db = database;
  console.log('database connection ready ');
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
