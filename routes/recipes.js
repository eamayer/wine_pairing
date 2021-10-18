var express = require('express');
const myParser = require("body-parser");
var router = express.Router();
var path = require('path');
const request = require('request');


// var XMLHttpRequest = require('xhr2');

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
    let rawLocation = JSON.parse(rawdata).wine_list[type].map_link
    return rawLocation
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
        // req2(ingredient)
        // wine(varietal)
        display(ingredient)
    }


    // function wine(varietal) {
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

    //
    // function req2(ingredient) {
    //     const options = {
    //         method: 'GET',
    //         url: 'https://yummly2.p.rapidapi.com/feeds/auto-complete',
    //         qs: {q: ingredient + " soup"},
    //         headers: {
    //             'x-rapidapi-host': 'yummly2.p.rapidapi.com',
    //             'x-rapidapi-key': '73e0afa9b4msha6093bd773c83c8p12c8f8jsn68040fedb040',
    //             useQueryString: true
    //         }
    //     };
    //
    //     request(options, function (error, response, body) {
    //         if (error) throw new Error(error);
    //         let responses = JSON.parse(body);
    //         let array = responses["searches"]
    //         display(array)
    //     });
    // }


    function display(ingredient){
        // let ingredient = getIngredient(varietal)
        let location = getLocation(varietal)
        let wine_description = getWineDescription(varietal)
        let mapLink = getMapLink(varietal)
        let recipes = ["gyros", "roasted lamb", "chickpea puree"]
        res.render('recipes', {wine_description: wine_description, recipes: recipes, ingredient: ingredient, location: location, map_link:mapLink});
        }
    }
);

module.exports = router;
