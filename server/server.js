const express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      massive = require('massive'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0'),
      config = require('./config.js'),
      cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: config.sessionSecret //ANY RANDOM STING/SECRET
}))
app.use(passport.initialize());
app.use(passport.session());


passport.use(new Auth0Strategy({      //OBJECT THAT CONTAINS INFO FORM AUTH0; COPY EXACTLY
   domain:       config.auth0.domain, //OBTAINED FROM AUTH0.COM
   clientID:     config.auth0.clientID, //OBTAINED FROM AUTH0.COM
   clientSecret: config.auth0.clientSecret, //OBTAINED FROM AUTH0.COM
   callbackURL:  config.auth0.callbackUrl
  },
  function(accessToken, refreshToken, extraParams, profile, done) { //PARAMS IN THIS ORDER EVERYTIME
      //ANYDATABASE CALLS

      // db.getUser([profile.auth0.id]).then((err, user) => {
      //   if (user) {
      //     done(null, user[0])
      //   } else {
      //     db.createUser().then((err, user) => {
      //       done(null, user[0])
      //     })
      //   }
      // })


    done(null, { id: 2, username: 'Joe', email: 'joe@joe.com' }) //USUALLY THE USER; HARDCODED
  }
));


passport.serializeUser(function(user, done) {
  console.log('serializing', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('deserialize', user)
  done(null, user);
});


app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', 
{ successRedirect: 'http://localhost:3000/'}));

app.get('/auth/me', function(req, res) {
  if (!req.user) return res.status(200).send('No one logged in!');
  res.status(200).send(req.user);
})
app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})



app.listen( config.port, () => console.log( `Listening on port: ${config.port}` ));