var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// connect to mongodb
mongoose.connect('mongodb://localhost/food');

// Add headers
app.use(function (req, res, next) {
// Website you wish to allow to connect
res.setHeader('Access-Control-Allow-Origin', '*');
// Request methods you wish to allow
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// Request headers you wish to allow
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
res.setHeader('Access-Control-Allow-Credentials', true);
// Pass to next layer of middleware
next();
});

app.use(bodyParser.json());


  // define model for recipes  =================
  var Recipes = mongoose.model('Recipes', {
    name : {type: String, required: true},
    category : String,
    description: String,
  });

// get all recipes
app.get('/', function(req, res) {
	console.log('GET request');
	Recipes.find(function(err, recipes){
		if (err)
			res.send(err)
		res.json(recipes);

	});
});

// post recipe
app.post('/', function(req, res) {
	console.log('POST' + JSON.stringify(req.body))
	Recipes.create({
		name: req.body.name,
		category: req.body.category,
		description: req.body.description,
	}, function(err, recipes){
		if (err)
			res.send(err);
	})
		res.send("recipes");

});

// delete recipe
app.delete('/:recipe_id', function(req, res){
	Recipes.remove({
		_id: req.params.recipe_id
	}, function(err, recipes) {
		if (err)
			res.send(err);
		Recipes.find(function(err, recipes){
			if (err)
				res.send(err);
			res.json(recipes);
		});
	});
});


// create webserver
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})