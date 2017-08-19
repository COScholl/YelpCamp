var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Campground   = require("./models/campground");
var Comment     = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image:"https://farm1.staticflickr.com/7/5954480_34a881115f.jpg",
        description: "shdfghsghfgh"
    },
    {
        name: "Beaute",
        image:"https://farm7.staticflickr.com/6186/6090714876_44d269ed7e.jpg",
        description: "fdghdfghdfghfg"
    },
    {
        name: "Greenery row",
        image: "https://farm5.staticflickr.com/4044/4455053417_1f5fac5631.jpg",
        description: "rttyjdfituykdktyd"
    }
];
//wipe everything from DB
function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
    //add seed data (add a few campgrounds)
         data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment");
                            }
                        });
                }
            });
         });
    });
    
    
    //add a few comments
}

module.exports = seedDB;