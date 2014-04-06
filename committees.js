var respond = require('./respond');
module.exports = exports = function(server, client) {
	server.get('/committees', function(req, res, next) {
		var page = req.query.page || 0,
			limit = req.query.limit || 100,
			start = page * limit;
			query = client.query('SELECT * FROM raw_committees LIMIT $1 OFFSET $2', [limit,start]);
		respond(query, res);
	});

	server.get('/commitee/:id', function(req, res, next) {
		var id = req.params.id,
			query = client.query('SELECT * FROM raw_commitees WHERE comittee_id = $1', [id]);
		respond(query, res);
	});
	server.get('/committee/:id/transactions', function(req, res, next) {
		var page = req.query.page || 0,
			limit = req.query.limit || 100,
			start = page * limit,
			id = req.params.id,
			query = client.query('SELECT * from raw_committees inner join raw_committee_transactions on committee_id=filer_id WHERE committee_id = $1 LIMIT $2 OFFSET $3', [id, limit, start]);

		respond(query, res);
	});
}