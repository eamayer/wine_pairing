var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* display wines to chose from main page. Wine varietals from wine JSON file*/
router.get('/', function(req, res, next) {
    let wine_data = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
    let wines = JSON.parse(wine_data).wine_list
    res.render("main_page", {wines: wines});
});

module.exports = router;
