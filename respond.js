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

module.exports = exports = respond;