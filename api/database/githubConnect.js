let mysql = require('mysql');

let connection = mysql.createConnection({
  debug: false,
  host: 'bedu',
	port: 3306,
	user: 'csm',
	password:'',
	database: 'cm',
	// timezone: 'PDT'
});

module.exports = connection;