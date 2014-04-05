var restify = require('restify'),
	pg = require('pg'),
	connection = {
		user: process.env.RDS_USER,
		database: 'hackoregon',
		password: process.env.RDS_PASS,
		post: '5432',
		host: 'hackoregon.cr7ctfkctdpv.us-west-2.rds.amazonaws.com'
	},
	server = restify.createServer(),
	client = new pg.Client(connection);

	client.connect();



//Setup up the server
server.listen(process.env.PORT || 8080, function() {
	//server is listineing
});


server.get('/test', function(req, res, next) {
	var query = client.query('select sub_type, sum(amount) from raw_committee_transactions group by sub_type order by sum(amount) desc;');

	query.on('row', function(err, data) {
		if (err) {
			res.status('404');
			res.send('DB ERROR');
			return;
		}
		res.contentType = 'json';
		res.send(data)
	});
})