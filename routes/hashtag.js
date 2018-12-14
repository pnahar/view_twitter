/**
 * Routes file for Login
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');

exports.gethashtag = function(req,res){
	var hashtagid;
	var getHashtagId="SELECT * FROM hashtag where hashtag='"+req.param("hashtag")+"';";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){

				hashtagid = results[0].id;

				var getTweets="select a.id, a.userid, a.tweets, DATE_FORMAT(a.date, '%m/%d/%Y') as date, b.username from (select * from tweets where tweets.id in (select distinct tweetid from tweetentry where hashtagid='"+hashtagid+"')) a inner join (select * from users)b on a.userid = b.id order by a.id desc;";

				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else 
					{
						if(results.length >= 0){

							res.render('hashtag', { hashtag: req.param("hashtag"), data: results });
							json_responses = {"statusCode" : 200, data: results};
							//res.send(json_responses);
						}
						else {    
							json_responses = {"statusCode" : 401};
							res.send(json_responses);
						}
					}  
				},getTweets);
			}
			else{
				json_responses = {"statusCode" : 404};
				res.send(json_responses);				
			}
		}
	},getHashtagId);
}

