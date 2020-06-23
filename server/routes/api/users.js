const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../model/User');
const key = require('../../config/keys').secret;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID

/**
 * @route POST api/users/register
 * @desc Register the user
 * @access Public
 */
router.post('/register', (req, res) => {
    let { 
        name, 
        username, 
        email, 
        password, 
        address,
        birthday,
        confirm_password,
        isAdmin
    } = req.body
    if(password !== confirm_password) {
        return res.status(400).json({
            msg: "Password do not match"
        });
    }

    //check username
    User.findOne({
        username: username
    }).then(user => {
        if(user){
            return res.status(400).json({
                msg: "Username is already taken"
            });
        }
    });
    //check email
    User.findOne({
        email:email
    }).then(user => {
        if(user){
            return res.status(400).json({
                msg: "Email is already registered"
            });
        }
    });

    //data is valid create new user
    let newUser = new User({
        name,
        username,
        password,
        email,
        address,
        birthday,
        isAdmin
    });

    //hash password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "User is registered"
                });
            });
        });
    });

});

/**
 * @route POST /users/login
 * @desc Login the user
 * @access Public
 */
router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username,
    }).then(user => {
        //check if user exists
        if(!user) {
            return res.status(404).json({
                msg: "Account not found / Incorrect Password",
                success: false
            });
        }
        //user exists then check password
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if(isMatch) {
                //password is correct then send json token to user
                const payload = {
                    _id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    address: user.address
                }
                jwt.sign(payload, key, {
                    expiresIn: 604800
                }, (err, token) =>{
                    res.status(200).json({
                        user: user,
                        success: true,
                        token: `Bearer ${token}`,
                        msg: "You are logged in"
                    })
                })
            } else {
                //incorrect password
                return res.status(404).json({
                    msg: "Account not found / Incorrect Password",
                    success: false
                });
            }
        })
    })
});

router.post('/login_admin', (req, res) => {
    User.findOne({
        username: req.body.username,
    }).then(user => {
        //check if user exists
        if(!user) {
            return res.status(404).json({
                msg: "Account not found",
                success: false
            });
        }

        console.log(user.isAdmin)

        if(user.isAdmin == true) {
            bcrypt.compare(req.body.password, user.password).then(isMatch => {
                if(isMatch) {
                    //password is correct then send json token to user
                    const payload = {
                        _id: user.id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        address: user.address
                    }
                    jwt.sign(payload, key, {
                        expiresIn: 604800
                    }, (err, token) =>{
                        res.status(200).json({
                            user: user,
                            success: true,
                            token: `Bearer ${token}`,
                            msg: "You are logged in"
                        })
                    })
                } else {
                    //incorrect password
                    return res.status(404).json({
                        msg: "Incorrect Password",
                        success: false
                    });
                }
            })
        }
        //user exists then check password
        
    })
});

/**
 * @route POST api/users/profile
 * @desc Return the User's data
 * @access Private
 */
router.get('/profile', passport.authenticate('jwt', {
    session:false
}), (req, res) => {
    return res.json({
        user: req.user
    });
});

// check all users
router.get('/', function(req, res) {
    User.find({}, function(err, user){
        if (err){
            res.send(err);
            return;
        }

        res.json(user);
        return;
    })
});


router.delete('/delete/:userId', function(req, res) {
    console.log(req.body)
    User.findByIdAndRemove(req.params.userId, function(err, user) {
        if(err) {
            res.json(err);
            return;
        } else {
            res.json(user);
            return;
        };
    })
});


//edit user data
router.post('/profile/edit_profile', function(req, res) {
    var password = req.body.password;
    var id = req.body._id;

    console.log(req.body)

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if(err) throw err;

            req.body.password = hash;

            User.findOneAndUpdate({"_id": ObjectId(id)}, {
                "$set": {
                    "name": req.body.name,
                    "username": req.body.username,
                    "password": req.body.password,
                    "birthday": req.body.birthday,
                    "address": req.body.address,
                    "email": req.body.email,
                    "isAdmin": req.body.isAdmin
                }
                
            })
            .then(doc => {
                if(!doc) {
                    return res.status(404).end();
                }
        
                return res.status(200).json(doc);
            });
            
        });
            
    });
});


module.exports = router;