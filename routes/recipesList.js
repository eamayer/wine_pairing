var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var myParser = require("body-parser");

router.use(myParser.urlencoded({extended : true}));

//gets all ingredients for a varietal
function getIngredients(type) {
    const fs = require('fs');
    let rawData = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    return JSON.parse(rawData).wine_list[type].ingredient
}

//gets city location for varietal
function getLocation(type) {
    const fs = require('fs');
    let rawData = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    return JSON.parse(rawData).wine_list[type].location
}

function getWineDescription(type) {
    const fs = require('fs');
    let rawData = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    return JSON.parse(rawData).wine_list[type].wine_description
}

router.get('/', function(req, res, next) {

    //changes input from form to format that matches json file (e.g. "Pinot Noir" to "pinot_noir")
    let intermediateVarietalName = req.query.varietal.split(' ').join('_')
    let varietal = intermediateVarietalName.toLowerCase()

    //ensures user picked a varietal
    function validateInput() {
        if (varietal === 'default') {
            errorMessage()
        } else {
            let ingredients = getIngredients(varietal)
            getRecipes(ingredients[0])  //uses the first ingredient in the list of ingredients to use for recipes
        }
    } validateInput()

    function errorMessage(){
        const fs = require('fs');
        let rawData = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
        let wineList = JSON.parse(rawData).wine_list
        let error = "you did not pick a varietal, please try again"
        res.render("mainPage", {wines: wineList, error: error});
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
            let recipeListRaw = JSON.parse(body);
            getRecipeList(recipeListRaw.results)
            })
        }

    // creates list of key/value pair for recipe id and recipe name
    // example output: [{"apple pie": 623434}, {"apple fritter": 37498374}]
    function getRecipeList(allRecipesRaw) {
        let recipeArray = []
        allRecipesRaw.forEach(item => {
            let recipeObject={}
            recipeObject["recipe_title"] = item.title;
            recipeObject["recipe_id"] = item.id;
            recipeArray.push(recipeObject)
        });
        getMap(recipeArray)
    }

    //calls microservice to get image of map based on location of wine
    function getMap(recipeArray) {
        let city = getLocation(varietal)
        var options = {
            'method': 'GET',
            'url': 'http://3.139.197.13:4000/staticUrl?cityName=' + city + '&imageWidth=300width"&imageHeight=300',
            'headers': {}
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let responses = JSON.parse(body);
            display(responses.imageUrl, recipeArray)
        });
    }

    //displays final results to user
    function display(mapImage, recipeArray){
        console.log(recipeArray)
        let ingredient = getIngredients(varietal)
        let location = getLocation(varietal)
        let wineDescription = getWineDescription(varietal)
        res.render('recipesList', {
            recipes: recipeArray,
            wine_description: wineDescription,
            ingredient: ingredient,
            location: location,
            map_image: mapImage});
        }
    });


module.exports = router;
