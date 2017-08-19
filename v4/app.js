var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    seedDB       = require("./seeds");
   // Comments     = require("./models/comments");
mongoose.Promise = global.Promise;

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v3", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



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

//+++++++++++++++++++++++++++++++
//CAMPGROUND ROUTES
//+++++++++++++++++++++++++++++++

//INDEX -show all campgrounds
app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
    res.render("campgrounds/new");
});

//SHOW -shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//++++++++++++++++++++++++++++++++++++
// COMMENTS ROUTES
//++++++++++++++++++++++++++++++++++++

//NEW- Show for to create new comment
app.get("/campgrounds/:id/comments/new", function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

//CREATE - POST new comments to DB
app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
    //connect new comment to campground
    
        }
    })
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});