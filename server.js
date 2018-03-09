function cl(x){console.log(x)}
var express = require('express');
var app = express();



app.get("/", function (request, response) {
  response.send('search for image');
});

app.get('/:img', function (req, res) {
  
  var page = 1;  
  
  if (req.query.page) {
    page = req.query.page;
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
      
      /* 
      PER SEARCH STRING RETURN:
       image URLs, alt text and page urls 
      */
      
      body = JSON.parse(body);
      
      var information = {
        imageURL : 'a', //body.images[0].display_sizes[0].uri
        altText : 'a', //body.images[0].title
        pageURL : body.images //[0].referral_destinations[1].uri
      };

      res.send(body.images);
      //res.send(body.images[0].display_sizes[0].uri);
      
    }
    else {

    }
  });
  
});


app.get('/latest', function (req, res) {
  
  var page = 1;  
  
  if (req.query.page) {
    page = req.query.page;
  }
  
  var options = {
    url: "https://api.gettyimages.com/v3/search/events?page="+page+"&page_size=10",
    headers: {
      'Api-Key': process.env.API_KEY
    }
  };
  
 
  var request = require('request');
  request(options, function (error, response, body) {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if (!error && response.statusCode == 200) {
      
      /* 
      PER SEARCH STRING RETURN:
       image URLs, alt text and page urls 
      */
      
      body = JSON.parse(body);
      
      for (l
      
      var information = {
        imageURL : 'a', //body.images[0].display_sizes[0].uri
        altText : 'a', //body.images[0].title
        pageURL : body //[0].referral_destinations[1].uri
      };

      res.send(body);
      //res.send(body.images[0].display_sizes[0].uri);
      
    }
    else {

    }
  });
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
