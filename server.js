var restify = require('restify'),
	pg = require('pg'),
	respond = require('./respond'),
	committees = require('./committees'),
	transactions = require('./transactions'),
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


committees(server, client);
transactions(server, client);

server.get('/', function(req, res, next) {
	res.send('This is the api end point for hackoregon. Checkout https://github.com/hackoregon/hackoregonnode and submit pulling requests if you want an endpoint');
})
