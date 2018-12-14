/**
 * Routes file for Signup
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');
var sha1 = require('sha1');

exports.sendtweet = function(req,res){
	console.log("tweet.js Inside tweet()");

	var tweet = req.param("tweet");

	var enpass = sha1(req.param("password"));
	var username = req.param("username");

	var getUser="select * from users where username='"+username+"' and password='" + enpass +"'";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){

				var userid = results[0].id;
				var insertTweetId=0;

				var insertTweet="insert into tweets values(NULL,'" + userid +"','" + req.param("tweet") +"',CURRENT_TIMESTAMP)";

				String.prototype.parseURL = function() {
					return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
						return url.link(url);
					});
				};
				String.prototype.parseUsername = function() {
					return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
						var username = u.replace("@","");

						var checkUsername="SELECT * FROM users where username='"+username+"';";
						mysql.fetchData(function(err,results){
							if(err){
								throw err;
							}
							else{
								if(results.length > 0){
									//username exists
									console.log("tweet.js username exists "+insertTweetId);
									userId = results[0].id;
									var userTweet="INSERT INTO tweetentry values(NULL,'"+insertTweetId+"','"+userId+"',NULL);";
									console.log("tweet.js userTweet is "+userTweet);
									mysql.fetchData(function(err,results){
										if(err){
											throw err;
										}
										else{
											//insertTweetId = results[0].id;
											console.log("username entered in tweet table");
										}
									},userTweet);
								}

								json_responses = {"statusCode" : 101};
								res.send(json_responses);
							}
						},checkUsername);
						//return u.link("/profile?username="+username);
					});
				};

				String.prototype.parseHashtag = function() {

					return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
						var tag = t.replace("#","");

						var checkHashtag="select * from hashtag where hashtag='" + tag +"'";
						mysql.fetchData(function(err,results){
							if(err){
								throw err;
							}
							else{
								if(results.length > 0){
									//Hashtag already here
									var gethashtagId="SELECT id FROM hashtag where hashtag='"+tag+"';";
									mysql.fetchData(function(err,results){
										if(err){
											throw err;
										}
										else 
										{
											hashtagId = results[0].id;
											var hashtagTweet="INSERT INTO tweetentry values(NULL,'"+insertTweetId+"',"+userid+",'"+hashtagId+"');";
											mysql.fetchData(function(err,results){
												if(err){
													throw err;
												}
												else 
												{
													//insertTweetId = results[0].id;
													json_responses = {"statusCode" : 101};
													//res.send(json_responses);
												}
											},hashtagTweet);
										}
									},gethashtagId);
								}
								else{
									//Create the new hashtag
									var insertNewHashtag="INSERT into hashtag values (NULL,'"+tag+"');";
									mysql.fetchData(function(err,results){
										if(err){
											throw err;
										}
										else 
										{
											//hashtagId = results[0].id;
											var gethashtagId="SELECT id FROM hashtag where hashtag='"+tag+"';";
											mysql.fetchData(function(err,results){
												if(err){
													throw err;
												}
												else 
												{
													hashtagId = results[0].id;
													var hashtagTweet="INSERT INTO tweetentry values(NULL,'"+insertTweetId+"',"+userid+",'"+hashtagId+"');";
													mysql.fetchData(function(err,results){
														if(err){
															throw err;
														}
														else 
														{
															//insertTweetId = results[0].id;
															json_responses = {"statusCode" : 101};
															//res.send(json_responses);
															console.log("tweet.js insertTweetId is "+insertTweetId);
														}
													},hashtagTweet);
												}
											},gethashtagId);
										}
									},insertNewHashtag);

								}
							}
						},checkHashtag);
						//return t.link("hashtag?hashtag="+tag);
					});
				};

				mysql.fetchData(function(err,results){
					console.log("Inside fetchdata");
					if(err){
						throw err;
					}
					else 
					{
						var getTweetId="SELECT id FROM tweets where tweets='"+req.param("tweet")+"' ORDER by id desc;";
						mysql.fetchData(function(err,results){
							if(err){
								throw err;
							}
							else{
								insertTweetId = results[0].id;
								json_responses = {"statusCode" : 102};
								//res.send(json_responses);
								tweet.parseHashtag().parseUsername();
							}
						},getTweetId);

						json_responses = {"statusCode" : 200, text: "successfully tweeted!"};
						res.send(json_responses);
					}
				},insertTweet);

			}
			else {    

				json_response = {"statusCode" : 401, "text": "invalid username/password"};
				//return json_response;
				res.send(json_response);
			}
		}  
	},getUser);

}


exports.retweet = function(req,res){
	var getreTweet="SELECT * FROM tweets where id='"+req.param("tweetid")+"';";
	console.log("getreTweet is "+getreTweet);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.render("retweet",{tweet : results[0].tweets });
		}
	},getreTweet);
}
