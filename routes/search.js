/**
 * Routes file for Login
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');

exports.search = function(req,res){
	// check user already exists
	var hashtagres;
	var usersres;
	var getHashtag="SELECT * FROM hashtag where hashtag like '%"+req.param("searchparam")+"%';";
	//console.log("gettweetidquery is "+insertTweet);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			var getUsers="SELECT * FROM users where username like '%"+req.param("searchparam")+"%';";
			mysql.fetchData(function(err,results2){
				if(err){
					throw err;
				}
				else 
				{
					res.render('search', { hashtag: results, users: results2 });
				}
			},getUsers);
		}
	},getHashtag);
}


