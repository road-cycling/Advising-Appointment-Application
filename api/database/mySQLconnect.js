let mysql = require('mysql');

let connection = mysql.createConnection({
  debug: false,
  host: 'bu',
	port: 3306,
	user: 'cm',
	password:'k7',
	database: 'c'
});

module.exports = connection;

// File "/usr/bin/cqlsh", line 141, in <module>
// from cassandra.cluster import Cluster
// File "cassandra/cluster.py", line 47, in
