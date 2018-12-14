/**
 * Routes file for Login
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');
var sha1 = require('sha1');

exports.index = function(req,res){
	var enpass = sha1(req.param("password"));
	var username = req.param("username");

	var getUser="select * from users where username='"+username+"' and password='" + enpass +"'";

	mysql.fetchData(function(err,userResults){
		if(err){
			throw err;
		}
		else {
			if(userResults.length > 0){
				if(req.param("search")==null)
					var getTweets="select a.id, a.userid, a.tweets, DATE_FORMAT(a.date, '%m/%d/%Y') as date, b.username from (select * from tweets where userid='"+userResults[0].id+"' or userid in (select user2 from followers where user1='"+userResults[0].id+"')) a inner join (select * from users)b on a.userid = b.id order by a.id desc";

				else
					var getTweets="select a.id, a.userid, a.tweets, DATE_FORMAT(a.date, '%m/%d/%Y') as date, b.username from (select * from tweets where tweets like '%"+req.param("search")+"%' and (userid='"+userResults[0].id+"' or userid in (select user2 from followers where user1='"+userResults[0].id+"'))) a inner join (select * from users)b on a.userid = b.id order by a.id desc";

				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else{
						if(results.length > 0){

							String.prototype.parseURL = function() {
								return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
									return url.link(url);
								});
							};
							String.prototype.parseUsername = function() {
								return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
									var username = u.replace("@","")
									//alert(username);
									return u.link("/profile?username="+username);
								});
							};
							String.prototype.parseHashtag = function() {
								return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
									var tag = t.replace("#","")
									//alert(tag);
									return t.link("hashtag?hashtag="+tag);
								});
							};
							//console.log("Session initialized is "+results[0].id);
							for(i=0;i<results.length;i++){
								temp_tweet = results[i].tweets;
								console.log(temp_tweet);
								results[i].tweets = temp_tweet.parseURL().parseUsername().parseHashtag();
							}
							json_responses = {"statusCode" : 200, data: results};
							res.send(json_responses);
						}
						else {    
							json_responses = {"statusCode" : 200, data: results};
							res.send(json_responses);
						}
					}  
				},getTweets);

			}
			else {    
				json_response = {"statusCode" : 401, "text": "invalid username/password"};
				res.send(json_response);
			}
		}  
	},getUser);
	
	// check user already exists	
	
}


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
