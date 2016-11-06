var mysql = require('mysql2');

var MySQLConnection = function(){
	var thiz = this;

	//query
	this.query = function(query , callback){
		var connection = mysql.createConnection({
		  host     : '172.16.14.142',
		  user     : 'root',
		  password : '',
		  database : 'helpub'
		});

		connection.connect();
		
		connection.query(query, function(err, rows, fields) {
		  callback(err , rows, fields, connection);
		});
	};

	//queryBind
	this.queryBind = function(query , bind, callback){
		if(!bind && !bind.length){
			bind = [];
		}
		console.log(bind);
		var connection = mysql.createConnection({
		  host     : '172.16.14.142',
		  user     : 'root',
		  password : '',
		  database : 'helpub'
		});
		 console.log(query);
		//connection.connect();
		connection.query(query, bind,function(err, results) {
	       console.log(err);
		  callback(err , results);
		});
	};

};

module.exports = function(){
	return new MySQLConnection();
};


