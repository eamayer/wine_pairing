var express = require('express');
const myParser = require("body-parser");
var router = express.Router();
var path = require('path');
const request = require('request');

router.use(myParser.urlencoded({extended : true}));

function getIngredient(type) {
    const fs = require('fs');
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    return JSON.parse(rawdata).wine_list[type].ingredient
}

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

function getMapLink(type) {
    const fs = require('fs');
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    return JSON.parse(rawdata).wine_list[type].map_link
}

router.get('/', function(req, res, next) {
    // let url = 'http://api.openweathermap.org/data/2.5/weather?q=seattle&&units=imperial&APPID=fcf2b499d5e59f490f19a928b3469d31'
    let intermediate = req.query.varietal.split(' ').join('_')
    let varietal = intermediate.toLowerCase()
    if (varietal === 'default') {
        let error = "you did not pick a varietal, please try again"
        const fs = require('fs');
        let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
        let wine_list = JSON.parse(rawdata).wine_list
        res.render("index", {wines: wine_list, error: error});
    } else {
        let ingredient = getIngredient(varietal)
        // let recipes = getRecipes(ingredient[0])
        display()
    }

//requesting recipes
    // function getRecipes(ingredient) {
    //     const options = {
    //         method: 'GET',
    //         url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/wine/dishes',
    //         qs: {wine: varietal},
    //         headers: {
    //             'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    //             'x-rapidapi-key': '73e0afa9b4msha6093bd773c83c8p12c8f8jsn68040fedb040',
    //             useQueryString: true
    //         }
    //     };
    //
    //     request(options, function (error, response, body) {
    //         if (error) throw new Error(error);
    //         console.log(body);
    //         let responses = JSON.parse(body);
    //         console.log(body)
    //         display(responses)
    //     });
    // }
    var obj = {
        recipes: [
            {"name" : "gyros", "link":"https://www.allrecipes.com/recipe/233230/gyros/"},
            {"name" : "roasted lamb", "link":"https://www.allrecipes.com/recipe/233230/gyros/"},
            {"name" : "chickpea puree", "link":"https://www.allrecipes.com/recipe/233230/gyros/"},
        ]}

    function display(){
        let ingredient = getIngredient(varietal)
        let location = getLocation(varietal)
        let wine_description = getWineDescription(varietal)
        let mapLink = getMapLink(varietal)
        // let recipes = obj
        res.render('recipes', {wine_description: wine_description, recipes: obj, ingredient: ingredient, location: location, map_link:mapLink});
        }
    }
);

module.exports = router;
