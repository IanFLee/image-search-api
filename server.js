function cl(x){console.log(x)}
var express = require('express');
var app = express();



app.get("/", function (request, response) {
  response.send('search for image');
});

app.get('/search/:img', function (req, res) {
  
  var page = 1;
  var responseArray = [];
  
  if (req.query.offset) {
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
      
      body = JSON.parse(body);

      for (let image of body.images) {
        cl(image.display_sizes);
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


app.get('/events', function (req, res) {

  var page = 1;
  var responseArray;
  
  if (req.query.offset) {
    page = req.query.page;
  }
  
  var options = {
    url: "https://api.gettyimages.com/v3/search/events?phrase=big bang&page="+page+"&page_size=10",
    headers: {
      'Api-Key': process.env.API_KEY
    }
  };
  
 
  var request = require('request');
  request(options, function (error, response, body) {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if (!error && response.statusCode == 200) {
      
      body = JSON.parse(body);
      res.send(body);

    }
    else {
      cl(error);
      res.send(error, response.statusCode);
    }
  });
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
