var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var myParser = require("body-parser");
router.use(myParser.urlencoded({extended : true}));

//gets all ingredients for a varietal
function getIngredients(type) {
    const fs = require('fs');
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    return JSON.parse(rawdata).wine_list[type].ingredient
}

//gets city location for varietal
function getLocation(type) {
    const fs = require('fs');
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    return JSON.parse(rawdata).wine_list[type].location
}

function getWineDescription(type) {
    const fs = require('fs');
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    return JSON.parse(rawdata).wine_list[type].wine_description
}

router.get('/', function(req, res, next) {

    //changes input from form to format that matches json file (e.g. "Pinot Noir" to "pinot_noir")
    let intermediate = req.query.varietal.split(' ').join('_')
    let varietal = intermediate.toLowerCase()

    //ensures user picked a varietal
    function validateInput() {
        if (varietal === 'default') {
            errorMessage()
        } else {
            let ingredients = getIngredient(varietal)
            getRecipes(ingredients[0])  //uses the first ingredient in the list of ingredients to use for recipes
        }
    } validateInput()

    function errorMessage(){
        const fs = require('fs');
        let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
        let wine_list = JSON.parse(rawdata).wine_list
        let error = "you did not pick a varietal, please try again"
        res.render("index", {wines: wine_list, error: error});
    }

  //  calls microservice to get recipes based on ingredients
    function getRecipes(ingredient) {
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': 'https://recipeapics361.azurewebsites.net/recipe?query='+ ingredient +'&number=5'
            };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let recipe_list_raw = JSON.parse(body);
            getRecipeList(recipe_list_raw.results) //applies to both testing and normal
            })
        }

    // creates list of key/value pair for recipe id and recipe name
    // example output: [{"apple pie": 623434}, {"apple fritter": 37498374}]
    function getRecipeList(all_recipes_raw) {
        let recipe_array = []
        all_recipes_raw.forEach(item => {
            let recipe_obj={}
            recipe_obj["recipe_title"] = item.title;
            recipe_obj["recipe_id"] = item.id;
            recipe_array.push(recipe_obj)
        });
        getMap(recipe_array)
    }

    //calls microservice to get image of map based on location of wine
    function getMap(recipe_array) {
        let city = getLocation(varietal)
        var options = {
            'method': 'GET',
            'url': 'http://3.139.197.13:4000/staticUrl?cityName=' + city + '&imageWidth=300width"&imageHeight=300',
            'headers': {}
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let responses = JSON.parse(body);
            display(responses.imageUrl, recipe_array)
        });
    }

    //displays final results to user
    function display(map_image, recipe_array){
        let ingredient = getIngredients(varietal)
        let location = getLocation(varietal)
        let wine_description = getWineDescription(varietal)
        res.render('recipes', {
            recipes: recipe_array,
            wine_description: wine_description,
            ingredient: ingredient,
            location: location,
            map_image: map_image});
        }
    });


module.exports = router;
