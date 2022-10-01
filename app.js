//jshint esversion:6

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('Users', userSchema);

app.get('/', function(req, res) {
    res.render("home");
});

app.get('/login', function(req, res) {
    res.render("login");
});

app.get('/register', function(req, res) {
    res.render("register");
});

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            if(user) {
                if(bcrypt.compareSync(password, user.password)) {
                    res.render("secrets");
                } else {
                    res.send("Wrong Password");
                }
            } else {
                res.send("User doesn't Exist!!");
            }
        }
    });
});

app.post('/register', function(req, res) {
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
        email: req.body.username,
        password: hash
    });
    newUser.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.listen(3000, function() {
    console.log("Server started at port 3000!");
});