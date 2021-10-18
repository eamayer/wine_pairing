var express = require('express');
const myParser = require("body-parser");
var router = express.Router();
var path = require('path');

//tried and didn't work:

/* GET users listing. */
router.get('/', function(req, res, next) {

        const fs = require('fs');
        let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
        let wines = JSON.parse(rawdata).wine_list

    let wineArray = []
    let ingredientList = []

    //finds all ingredients and pushes to array
    function findIngredients() {
        let wineTypes = Object.keys(wines);
        let number = wineTypes.length
        for (var i=0; i < number; i++) {
            let ingredients = wines[wineTypes[i]].ingredient;
            ingredients.forEach(singleElement =>{
                ingredientList.push(singleElement)
            })
        }
        } findIngredients()

//finds if an ingredient is in a wine ingredient lise
    function findWinesForIngredient(object, value) {
        let wineTypes = Object.keys(object);
        let number = wineTypes.length
        for (var i=0; i < number; i++) {
            let ingredients = wines[wineTypes[i]].ingredient;
            if (ingredients.includes(value) === true) {
                wineArray.push(wines[wineTypes[i]].varietal)
            }
            }
        } findWinesForIngredient(wines, 'shrimp') // use

    console.log(wineArray)
    console.log(ingredientList)


  // let foodArray = []
    // function printValues(obj) {
    //     for(var k in obj) {
    //         if(obj[k] instanceof Object) {
    //             printValues(obj[k]);
    //         } else {
    //             if (obj[k].key === "ingredient") {
    //
    //                 console.log(obj[k] + "<br>");
    //             }
    //         }
    //     }
    // } printValues(wines)

    res.render("index", {wines: wines});
});

// router.use(myParser.urlencoded({extended : true}));

// router.get('/wine', function(req, res, next) {
//     let varietal = req.query.varietal
//     let error = "You did not pick a varietal, please try again"
//     if (varietal === 'default') {
//         res.render('index', {error: error})
//     } else {
//         // var config = require('/wine.json');
//         // let name = config.name
//         // let location = config.location
//
//
//         res.render('wine', {wine: name});
//     }
// });

module.exports = router;

//\
// router.get('/wine', function(req, res, next) {
//   app.use(myParser.urlencoded({extended : true}));
//   app.get("/sendmessage", function(request, response) {
//     console.log(request.yourFieldName);
//     response.send("Message received.");
//   });
//   res.render('wine', { wine: 'Express' });
// });
// module.exports = router;
//
