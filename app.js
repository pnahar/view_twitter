
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , session = require('client-sessions');
var login = require('./routes/login');
var signup = require('./routes/signup');
var homepage = require('./routes/homepage');
var tweet = require('./routes/tweet');
var profile = require('./routes/profile');
var follower = require('./routes/follower');
var follow = require('./routes/follow');
var hashtag = require('./routes/hashtag');
var search = require('./routes/search');
var myprofile = require('./routes/myprofile');
var ejs = require("ejs");


var app = express();

// all environments
app.use(session({   
	  
	cookieName: 'session',    
	secret: 'view_assignment_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/profile', profile.getprofile);
app.get('/hashtag', hashtag.gethashtag);
app.get('/search',search.search);
app.get('/myprofile',myprofile.openmyprofile);
app.get('/retweet',tweet.retweet);
app.get('/logout',login.logout);


app.post('/checklogin',login.checklogin);
app.post('/signup',signup.dosignup);
app.post('/homepage',homepage.index);
app.post('/tweet',tweet.sendtweet);
app.post('/follower',follower.checkfollower);
app.post('/follow',follow.follow);
app.post('/unfollow',follow.unfollow);
app.post('/search',search.search);
app.post('/getfollowers',follower.getfollowers);
app.post('/getfollowing',follower.getfollowing);
app.post('/profileupdate',myprofile.setmyprofile);
app.post('/getfollowerslist',follower.getfollowerslist);
app.post('/getfollowinglist',follower.getfollowinglist);
app.post('/getpopularfollower',follower.getpopularfollower);
app.post('/shortestDistance',follower.shortestDistance);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
