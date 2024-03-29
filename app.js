//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
// let postContent = []; 

const app = require('express')();

dotenv.config({path : './config.env'});
const DB = process.env.DATABASE;
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to mongodb
mongoose.connect(DB, {useNewUrlParser: true}).then(()=>{
  console.log("Connected to mongodb");
}).catch((err)=>{
  console.log("Error connecting to mongodb" +  err);
});
//db schema:
const postSchema = {
  title: String,
  content: String
};

//mongoose model
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });

}); 


app.get("/", (req, res)=>{
  res.render("home", {startingContent : homeStartingContent, post : postContent});
});

app.get("/about", (req, res)=>{
  res.render("about", {aboutContent : aboutContent});
});

app.get("/contact", (req,res)=>{
  res.render("contact", {contactContent : contactContent});
});


app.get("/compose", (req,res)=>{
  res.render("compose");
});

app.post('/compose',(req, res)=>{
  
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){

    if (!err){
 
      res.redirect("/");
 
    }
 
  });

  res.redirect("/");
});


// route parametersS

// app.get("/posts/parameterName", callback()=>{})
app.get("/posts/:postName", (req, res)=>{
  // console.log(req.params.postName);
  const reqTitle = _.lowerCase(req.params.postName);

  postContent.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if(storedTitle === reqTitle){
      // console.log("match found");
      res.render("post",
      {
        Title: post.title,  
        Content : post.content 
      });
    }
    
  })
});






app.listen( PORT, function() {
  console.log(`Server started on port ${PORT}`);
});