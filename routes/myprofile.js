/**
 * Routes file for Login
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');

exports.openmyprofile = function(req,res)
{
	console.log("homepage.js sessionid "+req.session.userid);
	// check user already exists

	var getmyprofile="select * from users where id='"+req.session.userid+"' ";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{

			res.render('myprofile', { data: results });

		}  
	},getmyprofile);

}

exports.setmyprofile = function(req,res)
{
	var setmyp="UPDATE users SET firstname='"+req.param("firstname")+"', lastname='"+req.param("lastname")+"', contact='"+req.param("contact")+"', location='"+req.param("location")+"' where id='"+req.session.userid+"';";
	console.log("setmyp is "+setmyp);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			//insertTweetId = results[0].id;
			req.session.firstname = req.param("firstname");
			req.session.lastname =  req.param("lastname");
			req.session.contact =  req.param("contact");
			req.session.location =  req.param("location");
			json_responses = {"statusCode" : 200};
			res.send(json_responses);
			console.log("Profile updated");
		}
	},setmyp);
}


//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs
exports.checklogin_bkp = function(req,res)
{
	var username, password;
	username = req.param("username");
	password = req.param("password");

	var json_responses;

	if(username!== ''  && password!== '')
	{
		console.log(username+" "+password);
		if(username === "test" && password === "test")
		{
			//Assigning the session
			req.session.username = username;
			console.log("Session initialized");
			json_responses = {"statusCode" : 200};
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
	}
	else
	{
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
};


//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username});
	}
	else
	{
		res.redirect('/');
	}
};


//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};
