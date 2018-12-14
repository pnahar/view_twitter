/**
 * Routes file for Login
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var session = require('client-sessions');
var sha1 = require('sha1');

exports.checkfollower = function(req,res)
{
	// check user already exists
	var getUser="select * from followers where user1='"+req.session.userid+"' and user2='" + req.param("user2") +"'";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){

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

exports.getfollowers = function(req,res)
{
	var enpass = sha1(req.param("password"));
	var username = req.param("username");

	var getUser="select * from users where username='"+username+"' and password='" + enpass +"'";

	mysql.fetchData(function(err,userResults){
		if(err){
			throw err;
		}
		else 
		{
			if(userResults.length > 0){
				// check user already exists
				var getUser="select * from followers where user2='" + userResults[0].id +"'";

				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else 
					{
						json_responses = {"followers" : results.length };
						res.send(json_responses);
					}  
				},getUser);

			}
			else {    
				json_response = {"statusCode" : 401, "text": "invalid username/password"};
				res.send(json_response);
			}
		}  
	},getUser);
	
}


exports.getfollowing = function(req,res)
{
	var enpass = sha1(req.param("password"));
	var username = req.param("username");

	var getUser="select * from users where username='"+username+"' and password='" + enpass +"'";
	console.log("Query is:"+getUser);

	mysql.fetchData(function(err,userResults){
		if(err){
			throw err;
		}
		else 
		{
			if(userResults.length > 0){
				// check user already exists
				// check user already exists
				var getUser="select * from followers where user1='" + userResults[0].id +"'";

				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else 
					{
						json_responses = {"following" : results.length };
						res.send(json_responses);
					}  
				},getUser);

			}
			else {    
				json_response = {"statusCode" : 401, "text": "invalid username/password"};
				res.send(json_response);
			}
		}  
	},getUser);
	
}


exports.getfollowerslist = function(req,res)
{
	// check user exists
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
				var getFollowers="select username from users where id in (select user1 from followers where user2='" + results[0].id +"')";

				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else{
						res.send({"statusCode": 200, data : results });
					}  
				},getFollowers);
			}
			else {    

				json_response = {"statusCode" : 401, "text": "invalid username/password"};
				res.send(json_response);
			}
		}  
	},getUser);

}

exports.getfollowinglist = function(req,res)
{
	// check user exists
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

				var getFollowingList="select username from users where id in (select user2 from followers where user1='" + results[0].id +"')";

				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else{
						json_response = {"statusCode": 200,
								data : results ,status:"Followers"};

						res.send(json_response);
					}  
				},getFollowingList);
			}
			else {    
				json_response = {"statusCode" : 401, "text": "invalid username/password"};
				res.send(json_response);
			}
		}  
	},getUser);
}


exports.getpopularfollower = function(req,res)
{
	// check user exists
	var enpass = sha1(req.param("password"));
	var username = req.param("username");

	var getUser="select * from users where username='"+username+"' and password='" + enpass +"'";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){

				var getPopularFollowingList="select u1.username as user, u2.username as popular_follower from " +
				"(select f5.user1, f6.user2, f5.count from (select f4.user1, max(count) as count from (select id, user1, f.user2, count from followers f inner join "+
				"(SELECT f2.user2, count(f2.user2) as count FROM followers f2 group by f2.user2 order by count(f2.user2) desc) f3 "+
				"on f.user2 = f3.user2) f4 group by f4.user1) f5 " +
				"inner join "+
				"(select id, user1, f.user2, count from followers f inner join " +
				"(SELECT f2.user2, count(f2.user2) as count FROM followers f2 group by f2.user2 order by count(f2.user2) desc) f3 " +
				"on f.user2 = f3.user2) f6 " +
				"on f5.user1 = f6.user1 " +
				"and f5.count = f6.count) t1 "+

				"INNER JOIN users u1 ON t1.user1 = u1.id " +
				"INNER JOIN users u2 ON t1.user2 = u2.id";

				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else{
						json_response = {"statusCode": 200,
								data : results ,status:"Followers"};

						res.send(json_response);
					}  
				},getPopularFollowingList);
			}
			else {    
				json_response = {"statusCode" : 401, "text": "invalid username/password"};
				res.send(json_response);
			}
		}  
	},getUser);	
}

exports.shortestDistance = function(req,res)
{
	// check user already exists
	var enpass = sha1(req.param("password"));
	var username = req.param("username");

	function eqSet(as, bs) {
		if (as.size !== bs.size) return false;
		for (var a in as) if (!bs.has(a)) return false;
		return true;
	}

	function sleep(millis) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () { resolve(); }, millis);
		});
	}

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
					else {
						if(results2.length > 0){


							var getUserCount="select count(*) as count from users;";

							mysql.fetchData(function(err,userCountResults){
								if(err){
									throw err;
								}
								else{
									var distanceNumber = 0;
									var isFound = false;
									var userBase = [results[0].id]
									var userBaseSet = new Set(userBase);
									var tempSet = new Set();

									var selectFollower="select * from followers";
									mysql.fetchData(function(err,results3){
										if(err){
											throw err;
										}
										else {

											while(((userBaseSet.size-1) != userCountResults[0].count) && !isFound){
												for(var i=0; i<results3.length; i++){
													if((userBaseSet.has(results3[i].user1)) && (results3[i].user2 == results2[0].id)){
														isFound = true;
														break;
													}
													else if (userBaseSet.has(results3[i].user1)){
														tempSet.add(results3[i].user2);
														//break;
													}

												}
												if(eqSet(tempSet, userBaseSet)){
													break;

												}
												//userBaseSet = new Set(userBaseSet, tempSet);
												tempSet.forEach(userBaseSet.add, userBaseSet);
												distanceNumber++;
											}

											if(isFound){
												json_responses = {"statusCode" : 200, "distance" : distanceNumber};
												res.send(json_responses);
											}
											else{
												json_responses = {"statusCode" : 200, "distance" : 0};
												res.send(json_responses);
											}
										}
									},selectFollower);
								}  
							},getUserCount);

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