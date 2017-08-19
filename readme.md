Logic before styling!

#YelpCamp
*Add Landing Page
*Add Campgrounds Pafe that lists all campgrounds

Each Campground has:
*Name
*Image

camp array(API structure begins here):
[
    {name: "*", image: "http://*.com"},
]

#Layout and basic styling
*Create header and footer partials
*add bootstrap

#Creating new campgrounds
*setup new campground POST route
*Add in body-parser
*Setup route to show form
*add basic unstyled form

#Style Campgrounds Page
*Add better header/title
*Make campgrounds display on a grid

#Databases

##Intro to Databases
*What is a DB?
    *A collection of info/data
    *Has an interface
*SQL(relational) vs NoSQL(non-relational)
*with MongoDB, shut down server each time done working (^C)
*if not, c9 will time out and crash
*to repair:
    cd ~
    ./mongod --repair
    
*if problems persist:
    cd ~/data
    rm mongod.lock
    cd 
    ./mongod


#Our first MongoDB commands
*mongod
*mongo
*help
*show dbs
*use
*insert
*update
*remove

#Mongoose (package for writing mongodb code in JS)
*What is Mongoose?
    ODM (object database mapper: use JS to update/change DB)
*Why are we using it?
*Interact with MongoDB with Mongoosels
 -install mongoose
 -connect to DB
 -Schema
 -Model
 -interact with DB
 
 #Add Mongoose to YelpCamp
 *Install/config mongoose
 *setup campground model
 *use campground model instead of routes
 
 #Show Page (show route)
 *review the RESTful routes we've seen
 *add description to our campground model
 *show db.collection.drop()
 *add a show route/template
 
 #RESTful routes
 
 name    url             verb    description
 ==============================================================================
 INDEX   /dogs           GET     Display a list of all routes (pertinent data)
 (READall standalone)
 NEW     /dogs/new       GET     Display form to make a new dogs
 CREATE  /dogs           POST    Add new dog to DB, then redirect somewhere
 (CREATE pair)
 SHOW    /dogs/:id       GET     Shows extended info about one dog (one resource)
 (READone standalone)
 EDIT    /dogs/:id/edit  GET     Show edit for one dog
 UPDATE  /dogs/:id       PUT     Update a particular dog, then redirect somewhere
 (UPDATE pair)
 DESTROY /dogs/:id       DELETE  Delete a particular dog, then redirect somewhere
 (DESTROY standalone)
 
 #REpresentational State Transfer: REST
 *A way of mapping HTTP routes and CRUD (Create Read Update Destroy) together
 HTTP verb is the ROUTE
 The URL is the PATH from which ROUTES are used
 
 CREATE  /newBlog
 READ    /readAllBlogs
 UPDATE  /updateBlog/:id
 DESTROY /destroyBlog/:id
 
 #Add Mongoose
 * Install and configure Mongoose
 * Setup campground model
 * Use campground model inside of our routes
 
 #Show page
 * Review RESTful routes
 * add description to campground model
 * Ahow db.collection.drop()
 * Add a show route/template
 
 #Refactor Mongoose Code v3
 * Create a models dir
 * Use module.exports
 * Require everything correctly
 
 #Add a Seeds File
* Add a seeds.js file
* Sample data to work with
* Run file every time server starts
* 
#Add Comment Model
* Make errors go away
* Display Comments on campground page
* 
#Comment New/Create v4
* Discuss Nested Routes
* Add the comment new nd create routes
* Add the new comment form
* comment needs to be attached to :id route
* NEW campgrounds/:id/comments/new GET
* CREATE campgrounds/:id/comments POST

#Style SHOW page v5
* add sidebar to show page
* display comments nicely

=========================
AUTH
=========================
#Intro to Auth
* What tools are we using
   * Passport
   * Passport Local
   * Passport Local Mongoose
* Walkthrough with flow
* Discuss sessions
    * Express-Sessions

#Auth code along Part 1
* setup folder structure
* Install needed packages
* Add root and route template
* Add secret route and template

#Auth code along Part 2
* Create user model
* Configure Passport

#Auth code along Part 3
* Add Register routes
* Add Register form

#Auth code along Part 4
* Add login routes
* Add login form

#Auth code along Part 5
* Add logout routes
* Add isLoggedIn middleware
=============================
=============================
##YelpCamp Auth Pt.1 Add User Model v6
* Install all packages needed for Auth
* Define User Model

##YelpCamp Auth Pt.2 Register
* Configure Passport
* Add register routes
* Add register template
 
##YelpCamp Auth Pt. 3 Login
* Add login routes
* Add login template

##YelpCamp Auth Pt.4 Logout/navbar
* Add logout route
* Prevent users from accessing comments without login
* Add links to navbar
* Show/hide auth links correctly
* 
##YelpCamp Auth Pt.5 - Show/Hide links
* Show/hide auth links in navbar correctly

##Refactor YelpCamp (Routes) v7
* Campground routes
* Comment routes
* Auth routes
* Create new routes directory
* 
##Users + Comments v8
* Associate users and comments
* Save author's name to a comment automatically
* created new object in models/comment.js in commentSchema:
   author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
* added username and id to comments in Create Comments POST route for
  routes/comments.js:
     //add username and id to comments
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    //save comment
    comment.save();
* Changed views/show.ejs to add req.user.username to "forEach(comment)" loop

##Users + Campgrounds v9
* Prevent unauthenticated user from creating a campground
  * use isLoggedIn middleware for CREATE and POST routes to block nonusers
* Save username+id to newly created campground
* Much like "Users + Comments"
    * Alter campgroundSchema to start from models/campground.js
    * add author object to campgroundSchema
* Alter campground CREATE from routes/campgrounds.js to include associations
* Alter views/campgrounds/show.ejs to add "Created by <username>" to show template
* 
# Editing Campgrounds v10
* Add Method-Override to Express App
* Add Edit Route for Campgrounds
* Add Link to Edit Page
* Add Update Route
* Fix $set problem

# Deleting Campgrounds
* Add Destroy Route
* Add Delete Button
* 
# Authorization- what user is allowed to do: Permissions versus Authentication
* User can only edit his campgrounds
* User can only delere his campgrounds
* Hide/show edit and delete buttons

#Editing Comments
* Add Edit route
* Add UPDATE route

Campground Edit route: <!-- /campgrounds/:id/edit -->
Comment Edit route <!-- /campgrounds/:id/comments/:comment_id/edit -->

#Deleting Comments
* Add DESTROY route
* Add Delete button

Campground Destroy route: <!-- /campgrounds/:id -->
Comment Destroy route: <!-- /campgrounds/:id/comments/:comment_id -->

#Authorization Part 2: Comments
* User can only edit his comments
* User can only delete his comments
* Hide/show edit and delete buttons
* Refactor middleware

#Adding in Flash!
* Demo working version
* Install and configure connect-flash
    * app.use(connectFlash()); must come before Passport config in app.js
* Add bootstrap alerts to header

* connect-flash must be requested before redirect, with key-value pair
  * req.connectFlash("error", "Please Log In First!");
* key is called in route of redirect
   * res.render("login", {message: req.connectFlash("error")});
* message (value of key called in route) is displayed on page
   * <h2><%= message %></h2 >
* Will style with Bootstrap

##YelpCamp finishing touches/refactor with Ian: 
* https://github.com/nax3t

# Refactor Landing Page v12
* CSS styling landing page with animations
   * Find new images for animations, or, simply grab images from 
     DB to use.

# Dynamic Pricing

#Git
## Introduction
* What is GIT?
* What is Github?
* Why should you care?
* Novel Writing analogy
* Installing Git

#Git Basics
* Git init
   * only works in directory in which it is initialized
   * Init doesn't auto track all files in the dir
* Git status
   * Check in with Git before moving forward with more code
* Git add
   * Tells git which files to track
* Git commit (-m "Message to refer to changes committed ")
   * Saves files added

# Git Checkout
* Git log
* Git checkout
* Git revert
    * git revert --no-commit <hash>..HEAD
    * git commit

#Deployment
* Digital Ocean, Nodejitsu, Heroku, AWS - servers for deployment
* For deployment, dependencies MUST be listed on package.json
   * When deployed, the server will install the dependencies using npm based
     on the package.json
* package.json needs start script ("start" : "node app.js")
* create git in folder ("git init")
* add packages ("git add app.js")
* git commit
* heroku create
* git remote -v
* git push heroku master

# deployment with DB
* from CLI: heroku run <linux command>
* setting environment vars:
   * for Linux CLI: export VARIABLE=data
   * for heroku: heroku config:set VARIABLE=data
   * in app.js set variable url with env VARIABLE || "hard-coded variable";
     (double pipe means OR).