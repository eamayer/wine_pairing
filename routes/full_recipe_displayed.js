var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    let recipe_id = req.query.recipeID

    function getRecipeData(id) {
        const request = require('request');
        const options = {
            method: 'GET',
            url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/' + id + '/information',
            headers: {
                'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
                'x-rapidapi-key': '73e0afa9b4msha6093bd773c83c8p12c8f8jsn68040fedb040',
                useQueryString: true
            }
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let data = JSON.parse(body);
            displayRecipe(data)
        });
    } getRecipeData(recipe_id)

    function displayRecipe(data) {
        res.render('full_recipe_displayed', {
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
