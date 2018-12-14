/**
 * Routes file for Signup
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');
var sha1 = require('sha1');


exports.dosignup = function(req,res){
	// check user already exists
	var getUser="select * from users where email='"+req.param("email")+"' or username='" + req.param("username") +"'";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
			else {    
				var insertUser="insert into users values(NULL,'" + req.param("username") +"','" + sha1(req.param("password")) +"','"+req.param("email")+"',NULL,'"+req.param("firstname")+"','"+req.param("lastname")+"',NULL,NULL)";
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else{
						json_responses = {"statusCode" : 101};
						res.send(json_responses);
					}
				},insertUser);
			}
		}  
	},getUser);
}
