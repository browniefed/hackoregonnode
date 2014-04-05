var restify = require('restify');
var pg = require('pg');
var conString = {
	user: process.env.RDS_USER,
	database: 'hackoregon',
	password: process.env.RDS_PASS,
	post: '5432',
	host: 'hackoregon.cr7ctfkctdpv.us-west-2.rds.amazonaws.com'
}
pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('select sub_type, sum(amount) from raw_committee_transactions group by sub_type order by sum(amount) desc;', function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].numbor);
    //output: 1
  });
});
