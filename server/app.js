const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

// require('../client/src/assets/images')

//initialize the app
const app = express();

//Middlewares
//Form data Middleware
app.use(bodyParser.urlencoded({
    extended: true
}));

//Json Body Middleware
app.use(bodyParser.json());

//cors middleware
app.use(cors());

//setting up static directory
app.use(express.static(path.join(__dirname, 'public')));

//use the passport middleware
app.use(passport.initialize());
//bring passport strategy
require('./config/passport')(passport);

mongoose.Promise = global.Promise;
//db config and connect to database
const db = require('./config/keys').mongoURI;
mongoose.connect(db, {
    useNewUrlParser:true
}).then(() => {
    console.log(`Database connected successfully ${db}`)
}).catch(err => {
    console.log(`Unable to connect to database ${err}`)
});

// app.get('/', (req, res) => {
//     return res.send("hello world");
// });

var routes = require('./routes/api/products');
routes(app);

var routes2 = require('./routes/api/transactions');
routes2(app);

// const products = require('./routes/api/products');
// app.use('/api/products', products);


const users = require('./routes/api/users');
app.use('/api/users', users);

//handle production
if(process.env.NODE_ENV === 'production') {
    //static folder
    app.use(express.static(__dirname + '/public/'));

    //handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

// const transactions = require('./routes/api/transactions');
// app.use('/api/transactions', transactions);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

