var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

/*Campground.create(
    {
        name: "Crow Hill",
        image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
        description: "Historical campsite with no amenities"
    }, function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log("NEWLY CREATED CAMPGROUND: ");
            console.log(campground);
        }
    });*/

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX -show all campgrounds
app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});


//CREATE - add new campgrounds to DB
app.post("/campgrounds", function(req, res){
   //get dat from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name: name, image: image, description: desc};
  //Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
      if(err){
          //redirect user with error message
          console.log(err);
      } else {
          //redirect with new campground
          res.redirect("/campgrounds");
      }
     });
  });

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

//SHOW -shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find campground with provided id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});