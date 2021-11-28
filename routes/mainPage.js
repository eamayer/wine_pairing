var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* display wines to chose from main page. Wine varietals from wine JSON file*/
router.get('/', function(req, res, next) {
    let wineData = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    let wines = JSON.parse(wineData).wine_list
    res.render("mainPage", {wines: wines});
});

module.exports = router;
