var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");
   // Comments     = require("./models/comments");
mongoose.Promise = global.Promise;

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v6", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is the key to my hashings!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Without the following middleware, the header tries to find currentUser
//As defined in "/campgrounds". It was not available to all routes,
//so .ejs files hand with currentUser as undefined, saying "esc is not a function"
app.use(function(req, res, next){
    res.locals.currentUser = req.user; //defines user for all routes
    next(); //middleware needs next to move onto next code
});
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
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
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

//=================
//AUTH ROUTES
//=================
//show register form
app.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});
//Show login form
app.get("/login", function(req, res){
    res.render("login");
});
//handle login logic with middleware and callback function
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
//logout logic
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});