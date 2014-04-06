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


//Let anyone hit us
server.use(restify.CORS());
//Bring in querys ?page=5 will map to req.query.page
server.use(restify.queryParser());

//Setup up the server
server.listen(process.env.PORT || 8080, function() {
	//server is listineing
});

//ERROR HANDLER
var onErr = function(res, error) {
		res.status(404);
		res.send(error);
};
var onRow = function(res, row, result) {
	result.addRow(row);
};

var onEnd = function(res, data) {
	res.contentType = 'json';
	res.send(data.rows);
}

var respond = function(query, res) {
	query.on('row', onRow.bind(null, res));
	query.on('error', onErr.bind(null, res));
	query.on('end', onEnd.bind(null, res));
}


server.get('/', function(req, res, next) {
	res.send('This is the api end point for hackoregon. Checkout https://github.com/hackoregon/hackoregonnode and submit pulling requests if you want an endpoint');
})

server.get('/transactions', function(req, res, next) {
	var query = client.query('select sub_type, sum(amount) from raw_committee_transactions group by sub_type order by sum(amount) desc;');
	respond(query, res);
});

server.get('/transactions/cash_contributions/:year', function(req, res, next) {
	
	var year = req.params.year;
	var query = client.query('select committee_name, sum(amount) as s from raw_committees inner join raw_committee_transactions on committee_id=filer_id where sub_type=\'Cash Contribution\' and extract(year from tran_date)=$1 group by committee_name order by s desc;', [year]);
	respond(query, res);
});

server.get('/committees', function(req, res, next) {
	var page = req.query.page || 0,
		limit = req.query.limit || 100,
		start = page * limit;
		query = client.query('SELECT * FROM raw_comittees LIMIT $1 OFFSET $2', limit, start);
	respond(query, res);
});

server.get('/commitee/:id', function(req, res, next) {
	var id = req.params.id,
		query = client.query('SELECT * FROM raw_commitees WHERE comittee_id = $1', id);
	respond(query, res);
});
server.get('/committees/:id/transactions', function(req, res, next) {
	var page = req.query.page || 0,
		limit = req.query.limit || 100,
		start = page * limit,
		id = req.params.id,
		query = client.query('SELECT * from raw_committees inner join raw_committee_transactions on committee_id=filer_id WHERE committee_id = $1 LIMIT $2 OFFSET $3', id, limit, start);

	respond(query, res);
});




