var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
});

// var Campground = mongoose.model("Campground", campgroundSchema);
// module.exports = Campground;
//OR, make the two lines above one with:
module.exports = mongoose.model("Campground", campgroundSchema);