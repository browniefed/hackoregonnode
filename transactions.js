var respond = require('./respond');

module.exports = exports = function(server, client) {
	server.get('/transactions', function(req, res, next) {
		var query = client.query('select sub_type, sum(amount) from raw_committee_transactions group by sub_type order by sum(amount) desc;');
		respond(query, res);
	});

	server.get('/transactions/cash_contributions/:year', function(req, res, next) {
		
		var year = req.params.year;
		var query = client.query('select committee_name, sum(amount) as s from raw_committees inner join raw_committee_transactions on committee_id=filer_id where sub_type=\'Cash Contribution\' and extract(year from tran_date)=$1 group by committee_name order by s desc;', [year]);
		respond(query, res);
	});

}