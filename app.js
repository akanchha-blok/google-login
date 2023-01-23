require('dotenv').config()

const express = require('express')
const {google} = require('googleapis');

const passport = require('passport')

const cookieParser = require('cookie-parser')
const session = require('express-session')
const cookieSession = require('cookie-session')

var flash = require('connect-flash')

const fileuploadRouter = require('./routes/file upload')


const app = express()



require('./passport-setup')


app.set("view engine", "ejs")


app.use('/upload',  express.static('upload'))

app.use(cookieParser());
app.use(session({
    secret: "Shh, its a secret!",
    cookie:{maxAge: 60000},
    saveUninitialized: false,
    resave: false
}));

app.use(flash())




app.use(passport.initialize())

app.use(passport.session())

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // res.redirect('/login');
    res.render("pages/index")
  }


//app.use('/fileupload', fileuploadRouter);
app.use('/fileupload', ensureAuthenticated,
//   // Middleware function to check if the user is logged in
//   (req, res, next) => {
//     if (!req.session.profile) {
//       res.status(401).send('Unauthorized');
//       return;
//     }
//     next();
//   },
  // Middleware function to check if the user has the appropriate permissions
  
//   upload.single('file'), 
//   (req, res) => {
//     // Handle file upload here
//   }
  fileuploadRouter
  );




app.get('/', (req, res) => {
    res.render("pages/index")
})

app.get('/success', (request,response, next) => {
    //res.render('pages/profile.ejs', {name:req.user.displayName, email: req.user.emails[0].value, pic:req.user.photos[0].value, user: req.user})
    response.render('fileupload', {title: 'Welcome to Cloud connect!...infinity', message : request.flash('success')})
})

// app.get('/logout', (req, res) =>{
//     req.session = null;
//     req.logOut();
//     res.redirect('/');
// })

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
        }
      res.redirect('/');
    });
  });

app.get('/google',passport.authenticate('google', {scope:['profile', 'email']}));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
 function(req,res) {
   // Successful authentication, redirect home 
    res.redirect('/success');

})



app.listen(5000, () => {
    console.log("App is running on port 5000")
})