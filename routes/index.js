var express = require('express');
const myParser = require("body-parser");
var router = express.Router();
var path = require('path');



/* GET users listing. */
router.get('/', function(req, res, next) {

        const fs = require('fs');
        let rawdata = fs.readFileSync(path.resolve(__dirname, 'wine.json'));
        let wine_list = JSON.parse(rawdata).wine_list

    res.render("index", {wine_list: wine_list});
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
