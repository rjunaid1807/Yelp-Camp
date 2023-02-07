if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.set('strictQuery', true);
main().catch(err => console.log(err));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// CHECK - SUCCESS or ERROR

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})


// Join current directory path to views so that we can access ejs files from any directory

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));    // To parse the req.body. Without this, req.body in POST request will be empty.
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))        // session() has to be used before passport.session acc to passport docs

app.use(passport.initialize());
app.use(passport.session());        // To have persistent login sessions. We dont want to login on each request, even after refresh

passport.use(new LocalStrategy(User.authenticate()));   // we want passport to use localStrategy(required) and for that the authentication method is located in user.js
passport.serializeUser(User.serializeUser());           // Storing user into a session to keep them logged in
passport.deserializeUser(User.deserializeUser());       // Removing user from that session to log them out

app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;         // req.user is object containing user info. If not signed in, req.user = null. we use it in navbar
    res.locals.success = req.flash('success');      // Middleware to display flash msg
    res.locals.error = req.flash('error');
    next();
})


// START - REQUESTS

app.use('/campgrounds', campgroundRoutes);

app.use('/campgrounds/:id/reviews', reviewRoutes);

app.use('/', userRoutes);   // Have to define after app.use(flash()). It goes for all the routes where flash is used

app.get('/', (req, res) => {
    res.render('home')
})


// In case of an error in above code, catchAsync will send it here

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));

})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'O No something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})