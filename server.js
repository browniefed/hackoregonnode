var restify = require('restify'),
	pg = require('pg'),
	connection = {
		user: process.env.RDS_USER,
		database: 'hackoregon',
		password: process.env.RDS_PASS,
		post: '5432',
		host: 'hackoregon.c1srwyzwwu1a.us-west-2.rds.amazonaws.com'
	},
	server = restify.createServer(),
	client = new pg.Client(connection);

	client.connect();



//Setup up the server
server.listen(process.env.PORT || 8080, function() {
	//server is listineing
});


server.get('/transactions', function(req, res, next) {
	var query = client.query('select sub_type, sum(amount) from raw_committee_transactions group by sub_type order by sum(amount) desc;');

	query.on('row', function(row, result) {
		result.addRow(row);
	});

	query.on('end', function(data) {
		res.contentType = 'json';
		res.send(data.rows);
	});

	query.on('error', function(error) {
		res.status(404);
		res.send(error);
	})
})