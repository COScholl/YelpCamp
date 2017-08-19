var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

 var campgrounds = [
        {name: "Salmon Creek", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
        {name: "Crow Hill", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
        {name: "Brdibrdibr", image: "https://farm3.staticflickr.com/2655/3738566424_180036be3f.jpg"}
    ]

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});


app.post("/campgrounds", function(req, res){
   //get dat from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var newCampground = {name: name, image: image};
   campgrounds.push(newCampground);
   res.redirect("/campgrounds");
});


app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});