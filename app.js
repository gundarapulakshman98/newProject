require('dotenv').config();
const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const mongooseEncryption = require("mongoose-encryption");

const _ = require("lodash");

const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true  , useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email : String ,
  password : String
});

//adding encryption
// const secret = "Thisislittlesecretmessage";
userSchema.plugin(mongooseEncryption , {secret : process.env.SECRET , encryptedFields:["password"]});


const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  const userEmail = req.body.username;
  const userPassword = req.body.password;

  User.findOne({email : userEmail} , function(err,foundUser){
    if (foundUser) {
      if(foundUser.password === userPassword){
          res.render("secrets");
      }else{
        res.send("wrong password");
      }
    } else {
      res.send(err);
    }
  });
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email : req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (!err) {
      res.render("secrets");
    }
  })
});



app.get("/secrets",function(req,res){
  res.render("secrets");
});




app.listen(3000 , function(){
  console.log("server started at PORT:3000... ");
});
