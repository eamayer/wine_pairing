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
    console.log(JSON.parse(rawdata).wine_list[type])
    return JSON.parse(rawdata).wine_list[type].ingredient
}

function getWineDescription(type) {
    const fs = require('fs');
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    console.log(JSON.parse(rawdata).wine_list[type])
    return JSON.parse(rawdata).wine_list[type].wine_description
}


router.get('/', function(req, res, next) {
    // let url = 'http://api.openweathermap.org/data/2.5/weather?q=seattle&&units=imperial&APPID=fcf2b499d5e59f490f19a928b3469d31'
    let varietal = req.query.varietal
    if (varietal === 'default') {
        let error = "you did not pick a varietal, please try again"
        res.render('index', {error: error})
    } else {
        let ingredient = getIngredient(varietal)
        req2(ingredient)
        // wine(varietal)
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
    //         display(responses)
    //     });
    // }


    function req2(ingredient) {
        const options = {
            method: 'GET',
            url: 'https://yummly2.p.rapidapi.com/feeds/auto-complete',
            qs: {q: ingredient + " soup"},
            headers: {
                'x-rapidapi-host': 'yummly2.p.rapidapi.com',
                'x-rapidapi-key': '73e0afa9b4msha6093bd773c83c8p12c8f8jsn68040fedb040',
                useQueryString: true
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let responses = JSON.parse(body);
            let array = responses["searches"]
            display(array)
        });
    }


    function display(recipes){
        let ingredient = getIngredient(varietal)
        let wine_description = getWineDescription(varietal)
        res.render('wine', {wine: varietal, wine_description: wine_description, recipes: recipes, ingredient: ingredient});
        }
    }
);

module.exports = router;
