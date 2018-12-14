/**
 * Routes file for Login
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');
var sha1 = require('sha1');

exports.checklogin = function(req,res)
{
	// check user already exists
	var enpass = sha1(req.param("password"));
	var inemail = req.param("email");
	
	var getUser="select * from users where email='"+inemail+"' and password='" + enpass +"'";
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");

				console.log("Session initialized is "+results[0].id);
				req.session.userid = results[0].id;
				req.session.username = results[0].username;
				req.session.firstname = results[0].firstname;
				req.session.lastname = results[0].lastname;
				req.session.contact = results[0].contact;
				req.session.location = results[0].location;
				
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
			}
			else {    
				
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}  
	},getUser);
}




exports.check = function(req)
{
	// check user already exists
	var enpass = sha1(req.param("password"));
	var username = req.param("username");
	
	var getUser="select * from users where username='"+username+"' and password='" + enpass +"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");

				console.log("Session initialized is "+results[0].id);
				
				json_response = {"statusCode" : 200, "userId": results[0].id};
				console.log(json_response);
				return json_response;
			}
			else {    
				
				json_response = {"statusCode" : 401};
				console.log(json_response);
				return json_response;
				//res.send(json_response);
			}
		}  
	},getUser);
}

exports.getUserId = function(username)
{	
	var getUser="select * from users where username='"+username+"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");

				console.log("Session initialized is "+results[0].id);
				
				json_response = {"statusCode" : 200, "userId": results[0].id};
				return json_response;
			}
			else {    
				
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}  
	},getUser);
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
