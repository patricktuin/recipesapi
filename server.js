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
    name: {type: String, required: true},
    description: {type: String, default: ''},
    category: {type: Array, default: []},
    ingredients: {type: Array, default: []},
    preparation: {type: String, default: ''},
    prework_time: {type: Number, default: ''},
    preparation_time: {type: Number, default: ''},
    image: {type: String, default: ''},
    lastchangedate: {type: Date, default: Date.now}
});

// get all recipes
app.get('/', function (req, res) {
    console.log('GET request');
    Recipes.find(function (err, recipes) {
        if (err)
            res.send(err)
        res.json(recipes);

    });
});

// get recipe by id
app.get('/:recipe_id', function (req, res) {
    console.log('GET request for id: ' + req.params.recipe_id);
    Recipes.findOne({_id: req.params.recipe_id}, function (err, recipe) {
        if (err)
            res.send(err)
        res.json(recipe);
    });
});

// post recipe
app.post('/', function (req, res) {
    console.log('POST' + JSON.stringify(req.body))
    Recipes.create({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            ingredients: req.body.ingredients,
            preparation: req.body.preparation,
            prework_time: req.body.prework_time,
            preparation_time: req.body.preparation_time,
            image: req.body.image,
            lastchangedate: Date.now()
        },
        function (err, recipes) {
            if (err) {
                console.log('Adding not succeeded');
                res.send(err);
            } else {
                console.log('Recipe added');
                res.send("Recipe added");
            }
        });
});

// update recipe
app.put('/:recipe_id', function (req, res) {
    Recipes.update({_id: req.params.recipe_id}, {
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            ingredients: req.body.ingredients,
            preparation: req.body.preparation,
            prework_time: req.body.prework_time,
            preparation_time: req.body.preparation_time,
            image: req.body.image,
            lastchangedate: Date.now()
        },
        {upsert: true},
        function (err, recipes) {
            if (err) {
                console.log(err);
                res.send({success: false});
            } else {
                console.log('Recipe change succeeded');
                res.send({success: true});
            }
        });
});

// delete recipe
app.delete('/:recipe_id', function (req, res) {
    //console.log('delete api ' + req.params.recipe_id);
    Recipes.remove({
            _id: req.params.recipe_id
        },
        function (err, recipes) {
            if (err) {
                console.log('Deleting recipe not succeeded');
                res.send(err);
            } else {
                console.log('Recipe deleted');
                res.send("Recipe deleted");
            }
        });
});


// create webserver
var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port);

});