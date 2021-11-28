var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    let recipeId = req.query.recipeId

    function getRecipeData(id) {
        const request = require('request');
        const options = {
            method: 'GET',
            url: 'https://api.spoonacular.com/recipes/'+ id + '/information?includeNutrition=false&apiKey=94f4db6ca00c49ecb09c56df5c37348c'
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let data = JSON.parse(body);
            displayRecipe(data)
        });
    } getRecipeData(recipeId)

    function displayRecipe(data) {
        res.render('fullRecipeDisplayed', {
            title: data.title,
            link: data.sourceUrl,
            summary: data.summary,
            image: data.image,
            time: data.readyInMinutes,
            servings: data.servings,
            ingredients: data.extendedIngredients,
            instructions: data.instructions}
        )
    }
});

module.exports = router;
