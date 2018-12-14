/**
 * Routes file for Login
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var login = require('./login');
var session = require('client-sessions');
var sha1 = require('sha1');

exports.follow = function(req,res){
	// check user already exists
	var enpass = sha1(req.param("password"));
	var username = req.param("username");

	var getUser="select * from users where username='"+username+"' and password='" + enpass +"'";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var getUser2="select * from users where username='"+req.param("user2")+"'";

				mysql.fetchData(function(err,results2){
					if(err){
						throw err;
					}
					else 
					{
						if(results2.length > 0){

							var insertFollower="insert into followers values(null,'"+results[0].id+"', '" + results2[0].id +"')";

							mysql.fetchData(function(err,results3){
								if(err){
									throw err;
								}
								else {
									json_responses = {"statusCode" : 200, "text": req.param("username")+" is now following "+req.param("user2")};
									res.send(json_responses);
								}

							},insertFollower);
						}
						else {    
							json_responses = {"statusCode" : 401, "text" : "user2 does not exist"};
							res.send(json_responses);
						}
					}  
				},getUser2);

			}
			else {    

				json_response = {"statusCode" : 401, "text": "invalid username/password"};
				return json_response;
				//res.send(json_response);
			}
		}  
	},getUser);
}

exports.unfollow = function(req,res)
{
	// check user already exists
	var enpass = sha1(req.param("password"));
	var username = req.param("username");

	var getUser="select * from users where username='"+username+"' and password='" + enpass +"'";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else {
			if(results.length > 0){

				var getUser2="select * from users where username='"+req.param("user2")+"'";

				mysql.fetchData(function(err,results2){
					if(err){
						throw err;
					}
					else{
						if(results2.length > 0){

							var deleteFollower="delete from followers where user1='"+results[0].id+"' and user2='" + results2[0].id+"'";

							mysql.fetchData(function(err,results){
								if(err){
									throw err;
								}
								else{

									json_responses = {"statusCode" : 200, "text": username+" is not following "+req.param("user2")};
									res.send(json_responses);
								}

							},deleteFollower);
						}
						else {    
							json_responses = {"statusCode" : 401, "text" : "user2 does not exist"};
							res.send(json_responses);
						}
					}  
				},getUser2);

			}
			else {    
				json_response = {"statusCode" : 401, "text": "invalid username/password"};
				return json_response;
				//res.send(json_response);
			}
		}  
	},getUser);

};

